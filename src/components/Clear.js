import React from "react";

const Clear = props => {
  return (
    <div
      className="calcButton"
      id="clear"
      onClick={e => {
        props.handleClear();
        props.changeStyle(e);
      }}
    >
      AC
    </div>
  );
};

export default Clear;
