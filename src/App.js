import { useState } from "react";
import { useEffect } from "react";
import { BounceLoader } from "react-spinners";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Logo from "./components/Logo";
import Search from "./components/Search";
import NumResults from "./components/NumResults";
import ListBox from "./components/ListBox";
import WatchedBox from "./components/WatchedBox";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import WatchedSummary from "./components/WatchedSummary";
import WatchedList from "./components/WatchedList";
import StarRating from "./components/StarRating";
import ErrorMessage from "./components/ErrorMessage";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const override = {
  display: "block",
  margin: "300px auto",
};

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(() => {
    const watchedMovies = localStorage.getItem('watched')
    return watchedMovies ? JSON.parse(watchedMovies) : []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  console.log(watched);

  const getMovieData = async () => {
    const controller = new AbortController();

    try {
      setIsLoading(true);
      setIsError("");
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_SECRET_KEY}&s=${query}`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error("Something went wront");
      const data = await res.json();
      if (data.Response === "False") throw new Error("Movie not found");
      setMovies(data.Search);
      setIsError('')
    } catch (err) {
      if (err.name !== "AbortError") {
        setIsError(err.message);
      }
    } finally {
      setIsLoading(false);
    }

    removeMovieData();
    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    if (query.length < 3) {
      setMovies([]);
      setIsError("");
      return;
    }
    getMovieData();
    // eslint-disable-next-line
  }, [query]);

  const getMovieId = (id) => {
    // console.log(id)
    setSelectedId((previousId) => (id === previousId ? null : id));
  };

  const removeMovieData = () => {
    setSelectedId(null);
  };

  const addWatchedMovie = (movie) => {
    setWatched((prevMovie) => [...prevMovie, movie]);
  };

  const handleDeleteMovie = (id) => {
    setWatched((prevList) => prevList.filter((movie) => movie.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched))
  }, [watched])

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <ListBox>
          {/* {isLoading ? (
            <BounceLoader color={"white"} cssOverride={override} />
          ) : (
            <MovieList movies={movies} />
          )} */}

          {isLoading && <BounceLoader color={"white"} cssOverride={override} />}
          {!isLoading && !isError && (
            <MovieList movies={movies} getMovieId={getMovieId} />
          )}
          {isError && <ErrorMessage message={isError} />}
        </ListBox>
        <WatchedBox>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              removeMovieData={removeMovieData}
              selectedMovie={selectedMovie}
              setSelectedMovie={setSelectedMovie}
              addWatchedMovie={addWatchedMovie}
              userRating={userRating}
              setUserRating={setUserRating}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                handleDeleteMovie={handleDeleteMovie}
              />
            </>
          )}
        </WatchedBox>
      </Main>
    </>
  );
}
