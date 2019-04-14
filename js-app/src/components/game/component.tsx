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
    render() {
        const currentUser = firebase.auth().currentUser;
        var message = <div>"please log in"</div>;
        if (currentUser) {
            message = <h2>Joined the lobby as "{currentUser.displayName}"</h2>;
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
}

export default GameLobby;
