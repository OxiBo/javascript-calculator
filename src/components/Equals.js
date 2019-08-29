import React from "react";

const Equals = props => {
  return (
    <div
      className="calcButton"
      id="equals"
      onClick={e => {
        props.changeStyle(e);
        props.handleEvaluate();
      }}
    >
      =
    </div>
  );
};

export default Equals;
