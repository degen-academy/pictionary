import React from "react";
import { TextField, Button } from "@material-ui/core";
import { RouteComponentProps } from "react-router";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from "react-router-dom";

interface MatchParams {
  name: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  gameID: string;
}
class Login extends React.Component<Props> {
  state = {
    displayName: "kiminonawa",
    gameID: "new lobby",
    isLoading: false,
  };

  render() {
    return (
      <div>
        <form noValidate autoComplete="off">
          <TextField
            id="outlined-uncontrolled"
            label="Display Name"
            defaultValue={this.state.displayName}
            margin="normal"
            variant="outlined"
            onChange={this.handleChange("displayName")}
          />
          <TextField
            id="outlined-uncontrolled"
            label="Lobby Name"
            defaultValue={this.state.gameID}
            margin="normal"
            variant="outlined"
            onChange={this.handleChange("lobbyName")}
          />
        </form>
        <Link to={{
          pathname: `/${this.state.gameID.replace(" ", "-")}`,
          state: this.state.displayName,
        }}>
          <Button variant="contained" color="primary">
            Join Game
          </Button>
        </Link>

        <div>
          {this.state.isLoading ? <CircularProgress /> : null}
        </div>
      </div>
    );
  }

  private handleChange = (name: string) => (event: {
    target: { value: any };
  }) => {
    this.setState({
      [name]: event.target.value
    });
  };

}

export default Login;
