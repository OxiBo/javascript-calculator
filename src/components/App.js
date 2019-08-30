import React, { Component } from "react";

import {
  checkValLimit,
  isOperator,
  removeClass
} from "./../helpers/helperFuncs";

import Display from "./Display";
import Clear from "./Clear";
import ClearLast from "./ClearLast";
import Operators from "./Operators";
import Digits from "./Digits";
import Equals from "./Equals";

const initialState = {
  evaluated: false,
  fullExpression: "", // (?<=[+*\-\/ ])00+(?!\.) or  (^0*(?!\.))|(?<=[+*\-\/])00+(?!\.)
  result: null,
  currentVal: "0", // /^0*(?!\.)/
  prevVal: "",
  lastClicked: ""
};

export default class App extends Component {
  state = initialState;

  componentDidMount() {
    this.onKeyPress();
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress, false);
  }

  handleKeyPress = e => {
    const pressed = e.key.toString();
    switch (true) {
      case /[0-9]/.test(e.key):
        this.handleNumbers(null, pressed);
        break;
      case isOperator(e.key):
        this.handleOperators(null, pressed);
        break;
      case /Enter|=/.test(e.key):
        this.handleEvaluate();
        break;
      case /Backspace/.test(e.key):
        if (this.state.evaluated) {
          this.initializeState();
        } else {
          this.clearLastEntered();
        }
        break;
      case /\./.test(e.key):
        this.handleDecimal();
        break;
      default:
        return null;
    }
  };

  onKeyPress = () => {
    window.addEventListener("keydown", this.handleKeyPress);
  };

  initializeState = () => {
    this.setState(initialState);
  };

  limitReachedWarning = () => {
    this.setState(prevState => ({
      prevVal: prevState.currentVal,
      currentVal: "DIGIT LIMIT MET"
    }));

    // show message 'digit limit met' for 2 seconds
    setTimeout(() => {
      this.setState(prevState => ({
        currentVal: prevState.prevVal
      }));
    }, 2000);
  };

  // change styles of the button when it's clicked
  changeStyle = e => {
    e.target.classList.add("clicked");
    removeClass(
      document.querySelectorAll(".calcButton"),
      "transform",
      "clicked"
    );
  };

  handleNumbers = (e, pressed) => {
    const clicked = pressed || e.target.innerHTML;
    const { fullExpression, lastClicked, currentVal, evaluated } = this.state;
    if (checkValLimit(currentVal) || evaluated) {
      if (!evaluated) {
        this.setState(prevState => ({
          currentVal:
            prevState.currentVal === "0" && clicked === "0"
              ? "0"
              : prevState.currentVal === "0" && /[1-9]/.test(clicked)
              ? clicked
              : isOperator(lastClicked)
              ? clicked
              : prevState.currentVal.concat(clicked),
          fullExpression:
            prevState.fullExpression === "0" && clicked === "0"
              ? "0"
              : prevState.currentVal === "0" &&
                /([^.0-9]0)$/.test(fullExpression)
              ? prevState.fullExpression.slice(0, -1).concat(clicked)
              : prevState.fullExpression.concat(clicked),
          lastClicked: clicked
        }));
      } else {
        this.setState(() => ({
          fullExpression: clicked,
          currentVal: clicked,
          evaluated: false
        }));
      }
    } else {
      this.limitReachedWarning();
    }
  };
  handleOperators = (e, pressed) => {
    const clicked = pressed || e.target.innerHTML;
    const { fullExpression, evaluated, currentVal } = this.state;

    if (fullExpression.length > 0 && !evaluated) {
      this.setState(prevState => ({
        fullExpression:
          /[+/*-]$/.test(prevState.fullExpression) && clicked !== "-"
            ? prevState.fullExpression.replace(/[-+/*]+$/, "").concat(clicked)
            : prevState.lastClicked === "-" && clicked === "-"
            ? prevState.fullExpression
            : prevState.fullExpression.replace(/\.$/, "").concat(clicked),
        currentVal: clicked,
        lastClicked: clicked,
        prevVal: isOperator(prevState.lastClicked)
          ? prevState.prevVal
          : prevState.currentVal
      }));
    } else if (fullExpression.length === 0 && currentVal === "0") {
      this.setState(prevState => ({
        fullExpression: `0${clicked}`,
        currentVal: clicked,
        lastClicked: clicked,
        prevVal: prevState.currentVal
      }));
    } else {
      this.setState(prevState => ({
        fullExpression: prevState.result.concat(clicked),
        currentVal: clicked,
        lastClicked: clicked,
        prevVal: prevState.currentVal,
        evaluated: false
      }));
    }
  };

  // handleOperators = (e, pressed) => {
  //   const clicked = pressed || e.target.innerHTML;
  //   const { fullExpression, evaluated, currentVal } = this.state;

  //   if (fullExpression.length > 0 && !evaluated) {
  //     this.setState(prevState => ({
  //       fullExpression: isOperator(prevState.lastClicked)
  //         ? prevState.fullExpression.slice(0, -1).concat(clicked)
  //         : prevState.fullExpression.replace(/\.$/, "").concat(clicked),
  //       currentVal: clicked,
  //       lastClicked: clicked,
  //       prevVal: isOperator(prevState.lastClicked)
  //         ? prevState.prevVal
  //         : prevState.currentVal
  //     }));
  //   } else if (fullExpression.length === 0 && currentVal === "0") {
  //     this.setState(prevState => ({
  //       fullExpression: `0${clicked}`,
  //       currentVal: clicked,
  //       lastClicked: clicked,
  //       prevVal: prevState.currentVal
  //     }));
  //   } else {
  //     this.setState(prevState => ({
  //       fullExpression: prevState.result.concat(clicked),
  //       currentVal: clicked,
  //       lastClicked: clicked,
  //       prevVal: prevState.currentVal,
  //       evaluated: false
  //     }));
  //   }
  // };

  handleEvaluate = () => {
    const { lastClicked, fullExpression } = this.state;
    if (lastClicked !== "=" && fullExpression) {
      if (isOperator(fullExpression.slice(-1)))
        this.setState(prevState => ({
          fullExpression: prevState.fullExpression.slice(0, -1)
        }));
      this.setState(prevState => ({
        result: (
          Math.round(1000000000000 * eval(prevState.fullExpression)) /
          1000000000000
        ).toString(), //eval(prevState.fullExpression).toString(),
        lastClicked: "=",
        currentVal: (
          Math.round(1000000000000 * eval(prevState.fullExpression)) /
          1000000000000
        ).toString(),
        evaluated: true
      }));
    }
  };
  handleDecimal = () => {
    const { lastClicked, currentVal } = this.state;
    if (checkValLimit(currentVal)) {
      if (!currentVal.includes(".")) {
        this.setState({ lastClicked: "." });
        if (currentVal === "0" || isOperator(lastClicked)) {
          this.setState(prevState => ({
            fullExpression:
              prevState.fullExpression.length === 0 || isOperator(lastClicked)
                ? prevState.fullExpression.concat("0.")
                : prevState.fullExpression.concat("."),
            currentVal: "0.",
            lastClicked: "."
          }));
        } else {
          this.setState(prevState => ({
            fullExpression: prevState.fullExpression.concat("."),
            currentVal: prevState.currentVal.concat("."),
            lastClicked: "."
          }));
        }
      }
    } else {
      this.limitReachedWarning();
    }
  };

  handleClear = () => {
    this.initializeState();
  };

  clearLastEntered = () => {
    const { fullExpression, evaluated } = this.state;
    if (fullExpression && !evaluated) {
      this.setState(prevState => ({
        fullExpression: prevState.fullExpression.slice(0, -1),
        currentVal:
          prevState.currentVal.length > 1
            ? prevState.currentVal.slice(0, -1)
            : prevState.currentVal.length === 1 &&
              prevState.fullExpression.length === 1
            ? "0"
            : prevState.fullExpression.slice(-2, -1),
        lastClicked: prevState.fullExpression.slice(-2, -1)
      }));
    }
  };

  render() {
    const { fullExpression, currentVal, result, evaluated } = this.state;
    return (
      <div id="app">
        <div className="content">
          <header>
            <h1>JavaScript Calculator</h1>
            <hr />
          </header>
          <main>
            <Display
              formula={fullExpression}
              currentVal={currentVal}
              result={result}
              evaluated={evaluated}
            />

            <div id="keyBoard">
              <Clear
                handleClear={this.handleClear}
                changeStyle={this.changeStyle}
              />
              <ClearLast
                clearLastEntered={this.clearLastEntered}
                changeStyle={this.changeStyle}
              />

              <Operators
                handleOperators={this.handleOperators}
                changeStyle={this.changeStyle}
              />
              <Digits
                handleNumbers={this.handleNumbers}
                handleDecimal={this.handleDecimal}
                changeStyle={this.changeStyle}
              />
              <Equals
                handleEvaluate={this.handleEvaluate}
                changeStyle={this.changeStyle}
              />
            </div>
          </main>
        </div>

        <footer>Written and coded by OxiBo, 2019</footer>
      </div>
    );
  }
}
