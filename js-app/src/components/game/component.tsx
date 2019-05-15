import React from "react";
import { Button, TextField } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import GameAPI from "../../api/gameAPI";
import CanvasFreeDrawing from "canvas-free-drawing";

declare var MediaRecorder: any;
interface CanvasElement extends HTMLCanvasElement {
  captureStream(int): any;
}

interface MatchParams {
  gameID: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  displayName: string;
}

interface State {
  displayName: string;
  messageHistory: chatLine[];
}

interface chatLine {
  name: string;
  message: string;
}

class GameLobby extends React.Component<Props, State> {
  myCanvas: HTMLCanvasElement | null;
  myRecordingCanvasRef: React.RefObject<HTMLCanvasElement>;
  myVideoElement: React.RefObject<HTMLVideoElement>;
  myStream: MediaStream;
  gameAPI: GameAPI;
  chatInput: React.RefObject<HTMLInputElement>;
  constructor(props: Props) {
    super(props);
    this.state = {
      displayName: this.props.location.state,
      messageHistory: []
    };
    this.gameAPI = new GameAPI({
      gameID: this.props.match.params.gameID,
      displayName: this.state.displayName,
      onMessage: this.onReceiveMessage
    });
    this.chatInput = React.createRef<HTMLInputElement>();
    this.myCanvas = null;
    this.myRecordingCanvasRef = React.createRef<HTMLCanvasElement>();
    this.myVideoElement = React.createRef<HTMLVideoElement>();
  }

  render() {
    console.log("rerender");
    const displayName = this.state.displayName;
    console.log(displayName);
    if (!displayName) {
      return <h2>Please log in</h2>;
    }

    const message = <h2>Joined the lobby as "{displayName}"</h2>;
    console.log(this.state.messageHistory);
    const h = this.state.messageHistory.map(d => {
      return (
        <div>
          <span>{d.name}:</span> {d.message}
        </div>
      );
    });
    console.log(h);

    return (
      <div>
        <div>
          <h1>Game ID: {this.props.match.params.gameID}</h1>
          {message}
        </div>
        <br />
        <div>
          <TextField
            inputRef={this.chatInput}
            id="chat-input"
            label="chat"
            margin="normal"
            variant="outlined"
            onKeyDown={this.handleKeyDown}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={this.sendMessage}
          >
            Send
          </Button>

          <canvas
            id="cfd"
            style={{ border: "1px solid black" }}
            ref={this.setCanvasRef}
          />
          <canvas
            id="cfd2"
            style={{ border: "1px solid red" }}
            ref={this.myRecordingCanvasRef}
          />
          <video
            id="video"
            style={{ border: "1px solid blue", width: 500, height: 500 }}
            ref={this.myVideoElement}
          />
          {h}
        </div>
      </div>
    );
  }

  private setCanvasRef = (el: HTMLCanvasElement) => {
    this.myCanvas = el;
    const cfd = new CanvasFreeDrawing({
      elementId: "cfd",
      width: 500,
      height: 500
    });
    const cfd2 = new CanvasFreeDrawing({
      elementId: "cfd2",
      width: 500,
      height: 500
    });

    // set properties
    cfd.setLineWidth(10); // in px
    cfd.setStrokeColor([0, 0, 255]);
    this.myStream = (el as CanvasElement).captureStream(60);
    const recorder = new MediaRecorder(this.myStream, {
      mimeType: 'video/webm;codecs="vp8"',
      mode: "sequence"
    });
    const allChunks = [];

    const mediaSource = new MediaSource();

    let sourceBuffer;
    let updateend = 0;
    let queue = [];

    const createSourceBuffer = (e: Event) => {
      sourceBuffer = mediaSource.addSourceBuffer('video/webm;codecs="vp8"');
      sourceBuffer.addEventListener(
        "updateend",
        function(e) {
          if (queue.length > 0 && !sourceBuffer.updating) {
            sourceBuffer.appendBuffer(queue.shift());
          }
        },
        true
      );
    };

    const removeSourceBuffer = () => {
      mediaSource.removeSourceBuffer(sourceBuffer);
    };

    mediaSource.addEventListener("sourceopen", createSourceBuffer, true);

    mediaSource.addEventListener("sourceopen", function(e) {
      console.log("m sourceopen: " + mediaSource.readyState);
    });
    mediaSource.addEventListener("sourceended", function(e) {
      console.log("m sourceended: " + mediaSource.readyState);
    });
    mediaSource.addEventListener("sourceclose", function(e) {
      console.log("m sourceclose: " + mediaSource.readyState);
    });
    mediaSource.addEventListener("error", function(e) {
      console.log("m error: " + mediaSource.readyState);
    });

    let ondata = 0;

    const video = document.getElementById("video") as HTMLVideoElement;

    video.addEventListener("canplay", e => {
      video.play();
      console.log("v can play");
    });

    video.addEventListener("canplaythrough", e => {
      video.play();
      console.log("v can playthrough");
    });
    video.addEventListener("loadeddata", e => {
      console.log("v loaded data");
    });

    video.addEventListener("play", e => {
      console.log("v play");
    });

    video.addEventListener("playing", e => {
      console.log("v playing");
    });

    video.addEventListener("stalled", e => {
      console.log("v stalled");
    });

    video.addEventListener("timeupdate", e => {
      console.log("v timeupdate");
    });

    video.addEventListener("pause", e => {
      console.log("v pause");
    });

    video.addEventListener("ended", e => {
      console.log("v ended");
    });

    video.addEventListener("waiting", e => {
      console.log("v waiting");
    });

    video.addEventListener("complete", e => {
      console.log("v complete");
    });

    video.addEventListener("durationchange", e => {
      console.log("v durationchange");
    });
    const mirrorCanvas = e => {
      new Response(e.data as Blob).arrayBuffer().then(res => {
        if (video.paused) {
          video.play();
        }
        if (sourceBuffer.updating || queue.length > 0) {
          console.log("pushed res");
          queue.push(res);
        } else {
          console.log("added source buffer");
          sourceBuffer.appendBuffer(res);
        }
      });
      //     })
      //   let fr = new FileReader();
      //   fr.onloadend = function(e) {
      //     console.log(e);
      //     let res = new Uint8Array(fr.result as ArrayBuffer);
      //     if (sourceBuffer.updating) {
      //       queue.push(fr.result);
      //     } else {
      //       sourceBuffer.appendBuffer(fr.result);
      //     }
      //     ondata++;
      //     console.log(`ondata: ${ondata}`);
      //     if (video.paused) {
      //       video.play();
      //     }
      //   };
      //   fr.readAsArrayBuffer(e.data);
      //   allChunks.push(e);
      //   console.log(allChunks);
    };

    el.addEventListener("mouseup", e => {
      recorder.requestData(1000);
      recorder.pause();
    });
    el.addEventListener("mousedown", e => {
      //   recorder.requestData();
      if (recorder.state === "paused") {
        recorder.resume();
      } else if (recorder.state !== "recording") {
        recorder.start(1000);
      }
    });
    recorder.ondataavailable = (e: any) => {
      console.log("dataavail");
      mirrorCanvas(e);
    };

    recorder.onpause = () => {
      console.log("pause");
    };

    // setInterval(() => {
    //   if (recorder.state === "active") recorder.requestData(1000);
    // }, 1000);

    // start stream
    // recorder.start(1000);

    video.autoplay = true;
    video.src = URL.createObjectURL(mediaSource);
    console.log("video: ");
    console.log(video);
    video.play();
    console.log(mediaSource.activeSourceBuffers);
    console.log(mediaSource.readyState);
  };

  private handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // enter key
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  };

  private sendMessage = () => {
    if (!this.chatInput.current) {
      return;
    }
    const message = this.chatInput.current.value;
    if (message.length > 0) {
      this.gameAPI.sendMessage(message);
      this.chatInput.current.value = "";
    }
    this.setState((prev: State) => ({
      messageHistory: [
        ...prev.messageHistory,
        { name: this.state.displayName, message }
      ]
    }));
  };

  private onReceiveMessage = (event: MessageEvent) => {
    console.log(event.data);
    const _parsed = JSON.parse(event.data);
    const { name, message } = _parsed;
    this.setState((prev: State) => ({
      messageHistory: [...prev.messageHistory, { name, message }]
    }));
  };
}

export default GameLobby;
