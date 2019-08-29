import React, { Component } from "react";

export default class Operators extends Component {
  renderOperators = () => {
    let ids = {
      "+": "add",
      "-": "subtract",
      "*": "multiply",
      "/": "divide"
    };

    return ids = Object.entries(ids).map(el => {
      return (
        <div
          className="calcButton"
          id={el[1]}
          key={el[0]}
          onClick={e => {
            this.props.changeStyle(e);
            this.props.handleOperators(e);
          }}
        >
          {el[0]}
        </div>
      );
    });
  };

  render() {
    return <div id="operators">{this.renderOperators()}</div>;
  }
}
