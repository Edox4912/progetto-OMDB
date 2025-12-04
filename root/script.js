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
function checkImage(url) {
    return new Promise((resolve) => {
        if (!url || url === 'N/A') {
            resolve('https://via.placeholder.com/300x450/16213e/e94560?text=Locandina+Non+Disponibile');
            return;
        }
        
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve('https://via.placeholder.com/300x450/16213e/e94560?text=Immagine+Non+Disponibile');
        img.src = url;
    });
}

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

function updatePagination(totalResults, currentPage) {
   
    totalPages = Math.ceil(totalResults / 10);
    
   
    currentPageElement.textContent = currentPage;
    totalPagesElement.textContent = totalPages;

    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
    
   
    paginationElement.style.display = 'flex';
}


function hidePagination() {
    paginationElement.style.display = 'none';
}


function clearResults() {
    resultsContainer.innerHTML = '';
}


function showLoading() {
    loadingElement.style.display = 'block';
}

function hideLoading() {
    loadingElement.style.display = 'none';
}


function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}


function hideError() {
    errorElement.style.display = 'none';
}
const popup = document.getElementById('movie-popup');
const popupClose = document.querySelector('.popup-close');
const popupPoster = document.getElementById('popup-poster');
const popupTitle = document.getElementById('popup-title');
const popupYear = document.getElementById('popup-year');
const popupRating = document.getElementById('popup-rating');
const popupRuntime = document.getElementById('popup-runtime');
const popupGenre = document.getElementById('popup-genre');
const popupPlot = document.getElementById('popup-plot');
const popupDirector = document.getElementById('popup-director');
const popupActors = document.getElementById('popup-actors');
const popupWriter = document.getElementById('popup-writer');
const popupLanguage = document.getElementById('popup-language');
const popupAwards = document.getElementById('popup-awards');
const popupBoxOffice = document.getElementById('popup-boxoffice');


popupClose.addEventListener('click', closePopup);
popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        closePopup();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
        closePopup();
    }
});

function displayMovies(movies) {
    resultsContainer.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.style.cursor = 'pointer';
        
        const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/16213e/e94560?text=No+Image';
        
        movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.Title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-year">${movie.Year}</p>
                <p class="movie-type">${movie.Type}</p>
            </div>
        `;
        
        movieCard.addEventListener('click', () => {
            showMovieDetails(movie.imdbID);
        });
        
        resultsContainer.appendChild(movieCard);
    });
}


async function showMovieDetails(imdbID) {
    showLoading();
    
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);
        const movie = await response.json();
        
        hideLoading();
        
        if (movie.Response === 'True') {
            populatePopup(movie);
            openPopup();
        } else {
            showError('Impossibile caricare i dettagli del film');
        }
    } catch (error) {
        hideLoading();
        showError('Errore di connessione. Riprova più tardi.');
        console.error('Errore:', error);
    }
}


function populatePopup(movie) {
    
    popupPoster.src = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/16213e/e94560?text=No+Image';
    popupPoster.alt = movie.Title;
    
    
    popupTitle.textContent = movie.Title;
    popupYear.textContent = movie.Year;
    
   
    popupRating.textContent = `⭐ ${movie.imdbRating !== 'N/A' ? movie.imdbRating : 'N/D'}`;
    popupRuntime.textContent = movie.Runtime !== 'N/A' ? movie.Runtime : 'Durata N/D';
    popupGenre.textContent = movie.Genre !== 'N/A' ? movie.Genre : 'Genere N/D';
    
    
    popupPlot.textContent = movie.Plot !== 'N/A' ? movie.Plot : 'Trama non disponibile.';
    
    
    popupDirector.textContent = movie.Director !== 'N/A' ? movie.Director : 'N/D';
    popupActors.textContent = movie.Actors !== 'N/A' ? movie.Actors : 'N/D';
    popupWriter.textContent = movie.Writer !== 'N/A' ? movie.Writer : 'N/D';
    popupLanguage.textContent = movie.Language !== 'N/A' ? movie.Language : 'N/D';
    popupAwards.textContent = movie.Awards !== 'N/A' ? movie.Awards : 'Nessun premio';
    popupBoxOffice.textContent = movie.BoxOffice !== 'N/A' ? movie.BoxOffice : 'N/D';
}


function openPopup() {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closePopup() {
    popup.classList.remove('active');
    document.body.style.overflow = 'auto'; 
}
