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

class GameLobby extends React.Component<Props> {
    state = {
        displayName: "",
    }
    gameAPI: GameAPI;
    chatInput: React.RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.state.displayName = this.props.location.state;
        this.gameAPI = new GameAPI({
            gameID: this.props.match.params.gameID,
            displayName: this.state.displayName
        });
        this.chatInput = React.createRef<HTMLInputElement>();
    }

    render() {
        const displayName = this.state.displayName;
        if (displayName === "") {
            return <h2>Please log in</h2>
        }

        const message = <h2>Joined the lobby as "{displayName}"</h2>;

        return (
        <div>
            <div>
            <h1>Game ID: {this.props.match.params.gameID}</h1>
            {message}
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
        const text = this.chatInput.current ? this.chatInput.current.value : "";
        if (text.length > 0) {
            this.gameAPI.sendMessage(text);
        }
    }
}

export default GameLobby;
