import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getMovies, deleteMovie } from "../services/movieService";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import { getGenres } from "../services/genreService";
import ListGroup from "./common/listGroup";
import MoviesTable from "./moviesTable";
import _ from "lodash";
import SearchBox from "./common/searchBox";

class Movies extends Component {
  state = {
    movies: [],
    pageSize: 4,
    currentPage: 1,
    genres: [],
    sortColumn: { path: "title", order: "asc" },
    searchQuery: "",
    selectedGenre: null
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ name: "All Genres", _id: "" }, ...data];
    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);

    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handleDelete = async movie => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter(m => m._id !== movie._id);

    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.");

      this.setState({ movies: originalMovies });
    }
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allMovies;

    if (searchQuery)
      filtered = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { length: count } = this.state.movies;
    const {
      pageSize,
      currentPage,
      genres: items,
      selectedGenre,
      sortColumn,
      searchQuery
    } = this.state;
    const { user } = this.props;

    // if (count === 0) return <p>There are no movies in the database.</p>;

    const { totalCount, data: movies } = this.getPageData();

    return (
      <div className="row">
        <div className="col-2">
          <ListGroup
            items={items}
            selectedItem={selectedGenre}
            onItemSelect={this.handleGenreSelect}
          ></ListGroup>
        </div>

        <div className="col">
          {user && (
            <Link
              style={{ marginBottom: 20 }}
              className="btn btn-primary"
              to="/movies/new"
            >
              New Movie
            </Link>
          )}
          <p>Showing {totalCount} movies in the database.</p>

          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
          ></SearchBox>

          <MoviesTable
            movies={movies}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
            sortColumn={sortColumn}
          ></MoviesTable>
          <Pagination
            pageSize={pageSize}
            itemsCount={totalCount}
            onPageChange={this.handlePageChange}
            currentPage={currentPage}
          ></Pagination>
        </div>
      </div>
    );
  }
}

export default Movies;
