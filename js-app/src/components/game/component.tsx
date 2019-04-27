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
    messageHistory: string[];
}

class GameLobby extends React.Component<Props, State> {

    gameAPI: GameAPI;
    chatInput: React.RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.state = {
            displayName: this.props.location.state,
            messageHistory: ["hello"]
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
        if (displayName === "") {
            return <h2>Please log in</h2>
        }

        const message = <h2>Joined the lobby as "{displayName}"</h2>;

        const h = this.state.messageHistory.map(message => {
           return <div>{message}</div>
        })
        console.log(h)

        return (
        <div>
            <div>
            <h1>Game ID: {this.props.match.params.gameID}</h1>
            <Button variant="contained" color="primary">
                Start Game
            </Button>

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
        this.setState((prev:State) => ({
            messageHistory: [...prev.messageHistory, event.data]
        }))
    }
}

export default GameLobby;
