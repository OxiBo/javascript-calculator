import React from "react";
import Decimal from "./Decimal";

const Digits = props => {
  const onClick = e => {
    props.handleNumbers(e);
    props.changeStyle(e);
  };

  const renderDigits = () => {
    let ids = {
      seven: 7,
      eight: 8,
      nine: 9,
      four: 4,
      five: 5,
      six: 6,
      one: 1,
      two: 2,
      three: 3,
      zero: 0
    };

    // let ids = {
    //   Digit7: 7,
    //   Digit8: 8,
    //   Digit9: 9,
    //   Digit4: 4,
    //   Digit5: 5,
    //   Digit6: 6,
    //   Digit1: 1,
    //   Digit2: 2,
    //   Digit3: 3,
    //   Digit0: 0
    // };
    
    return (ids = Object.entries(ids).map(el => {
      return (
        <div
          className="calcButton"
          id={el[0]}
          key={el[1]}
          onClick={e => onClick(e)}
        >
          {el[1]}
        </div>
      );
    }));
  };

  return (
    <div id="board">
      {renderDigits()}
      <Decimal
        handleDecimal={props.handleDecimal}
        changeStyle={props.changeStyle}
      />
    </div>
  );
};

export default Digits;
