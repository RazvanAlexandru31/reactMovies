import React from "react";
import Movie from "./Movie";

const MovieList = ({movies, getMovieId}) => {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
       <Movie key={movie.imdbID} movie={movie} getMovieId={getMovieId}/>
      ))}
    </ul>
  );
};

export default MovieList;
