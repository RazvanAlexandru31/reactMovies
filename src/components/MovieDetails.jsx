import React from "react";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { BounceLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "300px auto",
};

const MovieDetails = ({
  selectedId,
  removeMovieData,
  selectedMovie,
  setSelectedMovie,
  addWatchedMovie,
  userRating,
  setUserRating,
  watched,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getMovieDetails = async () => {
    setIsLoading(true);
    const res = await fetch(
      `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_SECRET_KEY}&i=${selectedId}`
    );
    const data = await res.json();
    setSelectedMovie(data);
    setIsLoading(false);
  };

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    Year: year,
  } = selectedMovie;

  useEffect(() => {
    getMovieDetails();
    // eslint-disable-next-line
  }, [selectedId]);

  useEffect(() => {
    if(!title) return
    document.title = `Movie | ${title}`

    return () => {
      document.title = 'reactMovies'
    }
  }, [title])

  const addMovie = () => {
    const newMovieWatched = {
      id: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    addWatchedMovie(newMovieWatched);
    removeMovieData();
    setUserRating("");
  };

  const movieExists = watched.map((movie) => movie.id).includes(selectedId);
  const watchedMovieUserRating = watched.find((movie) => movie.id === selectedId)?.userRating;

  return (
    <div className="details">
      {isLoading ? (
        <BounceLoader color={"white"} cssOverride={override} />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={removeMovieData}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>{imdbRating} IMDb Rating</span>
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {movieExists ? (
                <p style={{textAlign: 'center'}}>You rated this movie {watchedMovieUserRating}</p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    setUserRating={setUserRating}
                    userRating={userRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={addMovie}>
                      Add movie
                    </button>
                  )}
                </>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Actors {actors}</p>
            <p>Director {director}</p>
          </section>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
