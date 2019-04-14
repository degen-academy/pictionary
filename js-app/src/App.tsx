import React, { Component } from "react";
import "./App.css";
import Typography from "@material-ui/core/Typography";
import GameLobby from "./components/game/component";
import Login from "./components/login/component";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as firebase from 'firebase';


const firebaseConfig = {
  apiKey: "AIzaSyC8GlZSkhT_-jVM7pv_5IulaL4PUWfw8ys",
  authDomain: "pictionary-c2ea2.firebaseapp.com",
  databaseURL: "https://pictionary-c2ea2.firebaseio.com",
  projectId: "pictionary-c2ea2",
  storageBucket: "pictionary-c2ea2.appspot.com",
  messagingSenderId: "1067811636183"
};

firebase.initializeApp(firebaseConfig);

class App extends Component {
  render() {
    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
        <Typography component="h2" variant="h2" gutterBottom>
          Pictionary
        </Typography>

        <Router>
          <Route exact path="/" component={Login} />
          <Route path="/pictionary/:gameID" component={GameLobby} />
        </Router>


      </div>
    );
  }
}

export default App;
