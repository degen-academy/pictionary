import React from "react";
import { TextField } from "@material-ui/core";

class OutlinedTextFields extends React.Component {
  state = {
    name: "Cat in the Hat",
    age: "",
    multiline: "Controlled",
    currency: "EUR"
  };

  handleChange = (name: string) => (event: { target: { value: string } }) => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    return (
      <form noValidate autoComplete="off">
        <TextField
          id="outlined-uncontrolled"
          label="Name"
          defaultValue="foo"
          margin="normal"
          variant="outlined"
        />
      </form>
    );
  }
}

export default OutlinedTextFields;
