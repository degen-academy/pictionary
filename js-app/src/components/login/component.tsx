import React from "react";
import { TextField, Button } from "@material-ui/core";
import firebase from "firebase";
import { RouteComponentProps } from "react-router";
import CircularProgress from '@material-ui/core/CircularProgress';

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
        <img src="https://i.imgur.com/hLul2fK.png" alt="avatar 1" width="150" height="150"></img>
        <img src="https://i.imgur.com/jzA7tpo.png" alt="avatar 2" width="150" height="150"></img>
        <img src="https://i.imgur.com/HuW7c4c.png" alt="avatar 3" width="150" height="150"></img>
        <img src="https://i.imgur.com/uSx99Aq.jpg" alt="avatar 4" width="150" height="150"></img>
        <img src="https://i.imgur.com/YzbCFFQ.jpg" alt="avatar 5" width="150" height="150"></img>
        <img src="https://i.imgur.com/tmvqlro.jpg" alt="avatar 6" width="150" height="150"></img>
        <img src="https://i.imgur.com/uvWszgp.png" alt="avatar 7" width="150" height="150"></img>
        <img src="https://i.imgur.com/IRRw6QW.jpg" alt="avatar 8" width="150" height="150"></img>
        <Button variant="contained" color="primary" onClick={this.login}>
          Join Game
        </Button>
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

  private login = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({isLoading: true});
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
            this.setState({isLoading: false});
            var gameID = this.state.gameID.replace(" ", "-");
            // redirect user to game lobby URL after login succeeds
            this.props.history.push(`/${gameID}`)
          });
        }
      });
  };
}

export default Login;
