import React from "react";

const ClearLast = props => {
  return (
    <div
      className="calcButton"
      id="clearLast"
      onClick={e => {
        props.changeStyle(e);
        props.clearLastEntered();
      }}
    >
      CE
    </div>
  );
};

export default ClearLast;
