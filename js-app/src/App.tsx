import React, { Component } from "react";
import "./App.css";
import Typography from "@material-ui/core/Typography";
import GameLobby from "./components/game/component";
import Login from "./components/login/component";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


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

        <Router basename={process.env.PUBLIC_URL}>
          <Route exact path="/" component={Login} />
          <Route path="/:gameID" component={GameLobby} />
        </Router>


      </div>
    );
  }
}

export default App;
