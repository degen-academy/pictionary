import React, { Component } from "react";
import "./App.css";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import OutlinedTextFields from "./components/lobby/component";
import "firebase/auth";

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

        <OutlinedTextFields />
      </div>
    );
  }
}

export default App;
