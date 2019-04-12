import React, { Component } from "react";
import "./App.css";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Card } from "@material-ui/core";
import OutlinedTextFields2 from "./components/lobby2/component";

class App extends Component {
  render() {
    const nums = [1,2,3];

    const fields: JSX.Element[] = [];
    nums.forEach(num => {
      fields.push(<div>i am printing this: {num}</div>);
    })

    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
        <Typography component="h2" variant="h2" gutterBottom>
          Pictionary is cool
        </Typography>
        <Typography component="h2" variant="h2" gutterBottom>
          Pictionary is still cool
        </Typography>
        <Button variant="contained" color="primary">
          Hello World
          <Typography component="h2" variant="h2" gutterBottom>
            Pictionary is still cool
          </Typography>
        </Button>
        {fields}
        <OutlinedTextFields2></OutlinedTextFields2>
      </div>
    );
  }
}

export default App;
