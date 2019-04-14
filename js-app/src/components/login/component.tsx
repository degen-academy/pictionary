import React from "react";
import { TextField, Button } from "@material-ui/core";
import firebase from "firebase";
import { RouteComponentProps } from "react-router";

interface MatchParams {
  name: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  gameID: string;
}
class Login extends React.Component<Props> {
  state = {
    displayName: "your name",
    gameID: "new lobby"
  };

  constructor(props: Props) {
    super(props);

    console.log(this.props.match.params);
    // sign out of any previous sessions
    firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(
          `joined "${this.state.gameID}" as "${this.state.displayName}"`
        );
      }
    });
  }


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
        <Button variant="contained" color="primary" onClick={this.login}>
          Join Game
        </Button>
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

  private login = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    firebase
      .auth()
      .signInAnonymously()
      .then(userCredential => {
        const user = userCredential.user;
        if (user) {
          user.updateProfile({
            displayName: this.state.displayName
          })
          .then(() => {
            // redirect user to game lobby URL after login succeeds
            this.props.history.push(`/${this.state.gameID}`)
          });
        }
      });
  };
}

export default Login;