import React from "react";
import { Button, TextField } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import GameAPI from "../../api/gameAPI";

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

    gameAPI: GameAPI;
    chatInput: React.RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.state = {
            displayName: this.props.location.state,
            messageHistory: []
        }
        this.gameAPI = new GameAPI({
            gameID: this.props.match.params.gameID,
            displayName: this.state.displayName,
            onMessage: this.onReceiveMessage,
        });
        this.chatInput = React.createRef<HTMLInputElement>();
    }

    render() {
        const displayName = this.state.displayName;
        console.log(displayName)
        if (!displayName) {
            return <h2>Please log in</h2>
        }

        const message = <h2>Joined the lobby as "{displayName}"</h2>;
        console.log(this.state.messageHistory)
        const h = this.state.messageHistory.map(d => {
           return <div><span>{d.name}:</span>  {d.message}</div>
        })
        console.log(h)

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
            <Button variant="contained" color="primary" onClick={this.sendMessage}>
                Send
            </Button>
            {h}

            </div>

        </div>
        );
    }

    private handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // enter key
        if (event.keyCode === 13) {
            this.sendMessage();
        }

    }

    private sendMessage = () => {
        if (!this.chatInput.current) {
            return;
        }
        const text = this.chatInput.current.value;
        if (text.length > 0) {
            this.gameAPI.sendMessage(text);
            this.chatInput.current.value = '';
        }
    }


    private onReceiveMessage = (event: MessageEvent) => {
        console.log(event.data);
        const _parsed = JSON.parse(event.data);
        const {name, message} = _parsed;
        this.setState((prev:State) => ({
            messageHistory: [...prev.messageHistory, {name, message}]
        }))
    }
}

export default GameLobby;
