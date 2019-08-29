import React from "react";

const Display = ({ formula, currentVal, result, evaluated }) => {
  return (
    <div id="display">
      <div id="operations-display">
        {evaluated ? `${formula}=${result}` : formula}
      </div>
      <div id="result-display">{currentVal}</div>
    </div>
  );
};

export default Display;
