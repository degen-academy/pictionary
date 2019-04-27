import React from "react";
import { Button, TextField } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import { string } from "prop-types";
import { join } from "path";

// hard-coded players
const players = [
    {
        displayName: "hello"
    },
    {
        displayName: "mynameis"
    }
]

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
    socket:WebSocket;
    
    constructor(props: Props) {
        super(props);

        this.state.displayName = this.props.location.state;

        const socket = new WebSocket('wss://auxhu82pyl.execute-api.us-west-2.amazonaws.com/dev');
        socket.onopen = () => {
            const message = {
                action: "join",
                game_id: this.props.match.params.gameID,
                name: this.state.displayName,
            }
            socket.send(JSON.stringify(message));
        }

        socket.onmessage = (event) => {
            console.log(event);
        }
        this.socket = socket;

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
            <TextField
            id="outlined-uncontrolled"
            label="chat"
            margin="normal"
            variant="outlined"
            />
            </div>
            <br />
            <div>
            <Button variant="contained" color="primary" onClick={this.sendMessage}>
                Chat
            </Button>
            </div>

        </div>
        );
    }

    private sendMessage = () => {
        const message = {
            action: "send_message",
            message: "hello",
            game_id: this.props.match.params.gameID,
            name: this.state.displayName
        }
        this.socket.send(JSON.stringify(message))
    }
}

export default GameLobby;
