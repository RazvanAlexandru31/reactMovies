import React from "react";
import Star from "./Star";
import { useState } from "react";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
  gap: "4px",
};



const StarRating = ({ maxRating = 5, color='#fcc419', size=16, setUserRating, userRating }) => {

  const [tempRating, setTempRating] = useState(0);

  const textStyle = {
    lineHeight: "0",
    margin: "1",
    color,
    fontSize: `${size}px`,
  };


  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onRate={() => setUserRating(i + 1)}
            full={tempRating ? tempRating >= i + 1 : userRating >= i + 1}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
          />
        ))}
      </div>
      <p style={textStyle}>{tempRating || userRating || ""}</p>
    </div>
  );
};

export default StarRating;
