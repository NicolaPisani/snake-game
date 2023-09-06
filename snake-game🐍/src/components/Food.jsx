import React from "react";

const Food = ({ foodDot }) => {
  return (
    <div
      style={{
        left: `${foodDot[0]}%`,
        top: `${foodDot[1]}%`,
      }}
      className="food-dot"
    ></div>
  );
};

export default Food;
