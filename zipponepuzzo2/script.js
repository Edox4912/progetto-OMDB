const API_KEY = '8ce88e44';
const BASE_URL = 'https://www.omdbapi.com/';


const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const paginationElement = document.getElementById('pagination');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const currentPageElement = document.getElementById('current-page');
const totalPagesElement = document.getElementById('total-pages');

let currentPage = 1;
let totalPages = 1;
let currentSearchTerm = '';

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        searchMovies(currentSearchTerm, currentPage);
    }
});

nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        searchMovies(currentSearchTerm, currentPage);
    }
});


function performSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm === '') {
        showError('Inserisci un termine di ricerca');
        return;
    }
    
    currentSearchTerm = searchTerm;
    currentPage = 1;
    searchMovies(searchTerm, currentPage);
}

// Funzione per cercare i film
async function searchMovies(searchTerm, page = 1) {
    showLoading();
    hideError();
    
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&page=${page}`);
        const data = await response.json();
        
        hideLoading();
        
        if (data.Response === 'True') {
            displayMovies(data.Search);
            updatePagination(data.totalResults, page);
        } else {
            showError(data.Error || 'Nessun risultato trovato');
            clearResults();
            hidePagination();
        }
    } catch (error) {
        hideLoading();
        showError('Errore di connessione. Riprova più tardi.');
        console.error('Errore:', error);
    }
}

// Funzione per visualizzare i film
function displayMovies(movies) {
    resultsContainer.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/16213e/e94560?text=No+Image';
        
        movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.Title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-year">${movie.Year}</p>
                <p class="movie-type">${movie.Type}</p>
            </div>
        `;
        
        resultsContainer.appendChild(movieCard);
    });
}

// Funzione per aggiornare la paginazione
function updatePagination(totalResults, currentPage) {
    // Calcola il numero totale di pagine (10 risultati per pagina)
    totalPages = Math.ceil(totalResults / 10);
    
    // Aggiorna gli elementi della paginazione
    currentPageElement.textContent = currentPage;
    totalPagesElement.textContent = totalPages;
    
    // Abilita/disabilita i pulsanti
    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
    
    // Mostra la paginazione
    paginationElement.style.display = 'flex';
}

// Funzione per nascondere la paginazione
function hidePagination() {
    paginationElement.style.display = 'none';
}

// Funzione per cancellare i risultati
function clearResults() {
    resultsContainer.innerHTML = '';
}

// Funzione per mostrare il caricamento
function showLoading() {
    loadingElement.style.display = 'block';
}

// Funzione per nascondere il caricamento
function hideLoading() {
    loadingElement.style.display = 'none';
}

// Funzione per mostrare l'errore
function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Funzione per nascondere l'errore
function hideError() {
    errorElement.style.display = 'none';
}