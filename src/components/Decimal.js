import React from "react";

const Decimal = props => {
  return (
    <div
      className="calcButton"
      id="decimal"
      key="."
      onClick={e => {
        props.changeStyle(e);
        props.handleDecimal();
      }}
    >
      .
    </div>
  );
};

export default Decimal;
