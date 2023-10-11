import React from "react";
import Watched from "./Watched";

const WatchedList = ({watched, handleDeleteMovie}) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Watched  key={movie.id} movie={movie} handleDeleteMovie={handleDeleteMovie}/>
      ))}
    </ul>
  );
};

export default WatchedList;
