import React from "react";
import { Button } from "@material-ui/core";
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
    displayName: string;
}

class GameLobby extends React.Component<Props> {

    render() {
        const displayName = this.props.location.state;
        if (!displayName) {
            return <h2>Please log in</h2>
        }

        const message = <h2>Joined the lobby as "{displayName}"</h2>;

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
