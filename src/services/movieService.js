import http from "./httpService";

const apiEndpoint = "/movies";

function moiveUrl(id) {
    return `${apiEndpoint}/${id}`;
}

export function getMovies() {
    return http.get(apiEndpoint);
}

export function deleteMovie(movieId) {
    return http.delete(moiveUrl(movieId));
}

export function getMovie(movieId) {
    return http.get(moiveUrl(movieId));
}

export function saveMovie(movie) {
    if (movie._id) {
        const body = { ...movie };
        delete body._id;
        return http.put(moiveUrl(movie._id), body);
    }
    return http.post(apiEndpoint, movie);
}