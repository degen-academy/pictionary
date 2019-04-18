import React from "react";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { RouteComponentProps } from "react-router";

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
}

class GameLobby extends React.Component<Props> {
    state = {
        displayName: "",
    }
    socket: WebSocket = new WebSocket('wss://auxhu82pyl.execute-api.us-west-2.amazonaws.com/dev/');
    constructor(props: Props) {
        super(props);
        const currentUser = firebase.auth().currentUser;
        if (currentUser === null) {
            return;
        }
        const displayName = currentUser.displayName || '';
    
        this.socket.onopen = () => {
            this.socket.send(JSON.stringify({
                action: "join",
                game_id: this.props.match.params.gameID,
                name: displayName,
            }))
            this.socket.addEventListener('message', this.messageHandler);
        }

        this.state = { displayName }
    }
    render() {;
        var message = <div>"please log in"</div>;
        if (this.state.displayName !== '') {
            message = <h2>Joined the lobby as "{this.state.displayName}"</h2>;
        }

        return (
        <div>
            <h1>Game ID: {this.props.match.params.gameID}</h1>
            {message}
            <Button variant="contained" color="primary">
                Start Game
            </Button>

        </div>
        );
    }
   

    private messageHandler = (e: MessageEvent) => {
        console.log(e);
    };
}

export default GameLobby;
