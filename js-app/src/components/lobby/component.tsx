import React from "react";
import { TextField, Button } from "@material-ui/core";
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyC8GlZSkhT_-jVM7pv_5IulaL4PUWfw8ys",
  authDomain: "pictionary-c2ea2.firebaseapp.com",
  databaseURL: "https://pictionary-c2ea2.firebaseio.com",
  projectId: "pictionary-c2ea2",
  storageBucket: "pictionary-c2ea2.appspot.com",
  messagingSenderId: "1067811636183"
};

class OutlinedTextFields extends React.Component {
  state = {
    displayName: "foo",
    lobbyName: "new lobby"
  };

  constructor() {
    super({});

    // TODO: firebase stuff should be in its own component, probably a react hook wrapping children components
    firebase.initializeApp(firebaseConfig);

    // sign out of any previous sessions
    firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(
          `joined "${this.state.lobbyName}" as "${this.state.displayName}"`
        );
      }
    });
  }

  componentWillUnmount() {
    firebase.auth().signOut();
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
            defaultValue={this.state.lobbyName}
            margin="normal"
            variant="outlined"
            onChange={this.handleChange("lobbyName")}
          />
        </form>
        <Button variant="contained" color="primary" onClick={this.login}>
          Log in
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
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}

export default OutlinedTextFields;
