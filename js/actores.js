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

async function fetchActors(id, type) {
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=${LANGUAGE}`);
        const credits = await response.json();
        displayActors(credits.cast);
    } catch (error) {
        console.error('Error fetching actors:', error);
    }
}

function displayActors(actors) {
    const actorsContainer = document.getElementById('actors-container');
    actorsContainer.innerHTML = ''; // Limpiar cualquier contenido existente

    actors.forEach((actor, index) => {
        const actorItem = document.createElement('div');
        actorItem.className = 'actor';
        actorItem.style.setProperty('--animation-delay', `${index * 0.1}s`);
        actorItem.innerHTML = `
            <img src="${IMG_BASE_URL}${actor.profile_path}" alt="${actor.name}">
            <h3>${actor.name}</h3>
            <p>${actor.character}</p>
        `;
        actorsContainer.appendChild(actorItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const { id, type } = getParamsFromUrl();
    if (id && type) {
        fetchActors(id, type);
    }

    // Manejar el clic en el botón de regreso
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        window.history.back();
    });
});
