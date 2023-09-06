import React from "react";

const Snake = ({ snakeDots }) => {
  return (
    <div>
      {snakeDots.map((dot, i) => (
        <div
          key={i}
          style={{
            left: `${dot[0]}%`,
            top: `${dot[1]}%`,
          }}
          className="snake-dot"
        ></div>
      ))}
    </div>
  );
};

export default Snake;
