const API_KEY = 'TU_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const LANGUAGE = 'es-MX';

let currentPage = 1;
let totalPages = 1;
let currentQuery = '';
let currentCategory = '';

async function fetchMovies(category, page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=${LANGUAGE}&page=${page}`);
        const data = await response.json();
        totalPages = data.total_pages;
        displayMovies(data.results, page);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

async function fetchSeries(category, page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/tv/${category}?api_key=${API_KEY}&language=${LANGUAGE}&page=${page}`);
        const data = await response.json();
        totalPages = data.total_pages;
        displaySeries(data.results, page);
    } catch (error) {
        console.error('Error fetching series:', error);
    }
}

async function fetchMoviesByName(query, page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=${LANGUAGE}&query=${encodeURIComponent(query)}&page=${page}`);
        const data = await response.json();
        totalPages = data.total_pages;
        displayMovies(data.results, page, query);
    } catch (error) {
        console.error('Error searching for movies:', error);
    }
}

async function fetchSeriesByName(query, page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&language=${LANGUAGE}&query=${encodeURIComponent(query)}&page=${page}`);
        const data = await response.json();
        totalPages = data.total_pages;
        displaySeries(data.results, page, query);
    } catch (error) {
        console.error('Error searching for series:', error);
    }
}

async function fetchMoviesByCategory(categoryId, page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&with_genres=${categoryId}&page=${page}`);
        const data = await response.json();
        totalPages = data.total_pages;
        displayMovies(data.results, page);
    } catch (error) {
        console.error('Error fetching movies by category:', error);
    }
}

function displayMovies(movies, page, query) {
    const movieList = document.getElementById('movie-list');
    if (page === 1) {
        movieList.innerHTML = '';
    }

    if (movies.length === 0 && page === 1) {
        movieList.innerHTML = `<p>No se encontraron películas para "${query}".</p>`;
        return;
    }

    movies.forEach((movie, index) => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie';
        movieItem.style.opacity = 0; // Para la animación
        movieItem.innerHTML = `
            <a href="Interfacez/detalle_peliculas.html?id=${movie.id}&type=movie">
                <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.release_date}</p>
            </a>
        `;
        movieList.appendChild(movieItem);
    });

    const loadMoreButton = document.getElementById('load-more');
    if (page < totalPages) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }

    // Animación de las películas cayendo
    setTimeout(() => {
        document.querySelectorAll('.movie').forEach((movie, index) => {
            setTimeout(() => {
                movie.style.opacity = 1;
            }, index * 100); // Intervalo entre cada animación
        });
    }, 1000); // Retraso para la animación
}

function displaySeries(series, page, query) {
    const movieList = document.getElementById('movie-list');
    if (page === 1) {
        movieList.innerHTML = '';
    }

    if (series.length === 0 && page === 1) {
        movieList.innerHTML = `<p>No se encontraron series para "${query}".</p>`;
        return;
    }

    series.forEach((show, index) => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie';
        movieItem.style.opacity = 0; // Para la animación
        movieItem.innerHTML = `
            <a href="Interfacez/detalle_peliculas.html?id=${show.id}&type=tv">
                <img src="${IMG_BASE_URL}${show.poster_path}" alt="${show.name}">
                <h3>${show.name}</h3>
                <p>${show.first_air_date}</p>
            </a>
        `;
        movieList.appendChild(movieItem);
    });

    const loadMoreButton = document.getElementById('load-more');
    if (page < totalPages) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }

    // Animación de las películas cayendo
    setTimeout(() => {
        document.querySelectorAll('.movie').forEach((movie, index) => {
            setTimeout(() => {
                movie.style.opacity = 1;
            }, index * 100); // Intervalo entre cada animación
        });
    }, 1000); // Retraso para la animación
}

document.addEventListener('DOMContentLoaded', () => {
    fetchMovies('popular');
    fetchCategories();

    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchInput = document.getElementById('search-input').value.trim();
        currentPage = 1;
        if (searchInput) {
            currentQuery = searchInput;
            currentCategory = '';
            fetchMoviesByName(searchInput);
        } else {
            currentQuery = '';
            fetchMovies('popular');
        }
    });

    const categorySelect = document.getElementById('category-select');
    categorySelect.addEventListener('change', (event) => {
        const categoryId = event.target.value;
        currentPage = 1;
        if (categoryId) {
            currentCategory = categoryId;
            currentQuery = '';
            fetchMoviesByCategory(categoryId);
        } else {
            currentCategory = '';
            fetchMovies('popular');
        }
    });

    const loadMoreButton = document.getElementById('load-more');
    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        if (currentQuery) {
            fetchMoviesByName(currentQuery, currentPage);
        } else if (currentCategory) {
            fetchMoviesByCategory(currentCategory, currentPage);
        } else {
            fetchMovies('popular', currentPage);
        }
    });
});

async function fetchCategories() {
    try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${LANGUAGE}`);
        const data = await response.json();
        populateCategorySelect(data.genres);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

function populateCategorySelect(categories) {
    const categorySelect = document.getElementById('category-select');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}
