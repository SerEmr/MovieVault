const API_KEY = 'TU_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const LANGUAGE = 'es-MX';

// Obtener los parámetros de la URL
function getParamsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        type: params.get('type')
    };
}

async function fetchDetails(id, type) {
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=${LANGUAGE}&append_to_response=videos,credits`);
        const details = await response.json();
        displayDetails(details);
    } catch (error) {
        console.error('Error fetching details:', error);
    }
}

function displayDetails(details) {
    document.getElementById('poster').src = `${IMG_BASE_URL}${details.poster_path}`;
    document.getElementById('title').textContent = `${details.title || details.name} (${details.release_date ? details.release_date.split('-')[0] : details.first_air_date.split('-')[0]})`;
    document.getElementById('release-date').textContent = details.release_date ? `Fecha de Estreno: ${details.release_date}` : `Fecha de Estreno: ${details.first_air_date}`;
    document.getElementById('genres').textContent = `Generos: ${details.genres.map(genre => genre.name).join(', ')}`;
    document.getElementById('overview').textContent = details.overview;

    // Mostrar las estrellas en función de la puntuación
    const rating = Math.round(details.vote_average / 2);
    const starContainer = document.getElementById('stars');
    starContainer.innerHTML = ''; // Limpiar cualquier estrella existente

    const starImage = `../images/${rating}.png`; // Selecciona la imagen de estrellas correspondiente
    const star = document.createElement('img');
    star.src = starImage;
    starContainer.appendChild(star);

    const trailer = details.videos.results.find(video => video.type === "Trailer" && video.iso_639_1 === "es");
    if (trailer) {
        document.getElementById('trailer-container').style.display = 'block';
        document.getElementById('trailer').src = `https://www.youtube.com/embed/${trailer.key}`;
    } else {
        document.getElementById('trailer-container').style.display = 'none';
    }

    const crewList = details.credits.crew.slice(0, 6).map(crew => `<p><strong>${crew.name}</strong> (${crew.job})</p>`).join('');
    document.getElementById('crew').innerHTML = crewList;

    // Manejar el clic en la imagen de actores
    const actorsLink = document.getElementById('actors-link');
    actorsLink.addEventListener('click', () => {
        window.location.href = `actores.html?id=${details.id}&type=${details.media_type || 'movie'}`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const { id, type } = getParamsFromUrl();
    console.log('ID:', id, 'Tipo:', type); // Para depuración
    if (id && type) {
        fetchDetails(id, type);
    }

    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        window.history.back(); // Utiliza el historial del navegador para regresar a la página anterior
    });
});
