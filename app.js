const auth = ""; //Put API key here
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
const more = document.querySelector('.more');
let page = 1;
let fetchLink;
let currentSearch;
let searchValue;

//eventlinstener
searchInput.addEventListener("input", updateInput);
form.addEventListener('submit', e => {
    e.preventDefault();
    currentSearch = searchValue;
    searchPhotos(searchValue);
});
more.addEventListener('click', loadMore);

function updateInput(e) {
    searchValue = e.target.value;
}

async function fetchAPI(url) {
    const dataFetch = await fetch(url, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            Authorization: auth
        }
    });
    const data = await dataFetch.json();
    return data;
}

function generatePics(data) {
    console.log(data);
    data.photos.forEach(photo => {
        // foreach img have img src and author name
        // console.log(photo);
        const galleryImg = document.createElement('div');
        galleryImg.classList.add('gallery-img');
        galleryImg.innerHTML = `
                <div class="gallery-info">
                <p>${photo.photographer}</p>
                <a href="${photo.src.original}" target="_blank">Download</a>
                </div>
                <img src=${photo.src.large} />`;
        gallery.appendChild(galleryImg);
    });
}

async function curatedPhotos() {
    fetchLink = 'https://api.pexels.com/v1/curated?per_page=15&page=1'
    const data = await fetchAPI(fetchLink);
    generatePics(data);
}

async function searchPhotos(query) {
    clear();
    fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;
    const data = await fetchAPI(fetchLink);
    generatePics(data);
}

function clear() {
    gallery.innerHTML = "";
    searchInput.value = "";
}

async function loadMore() {
    page++;
    if(currentSearch) {
        // fetch more of the search query pages
        fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
    } else {
        // fetch more of the curated images
        fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
    }
    const data = await fetchAPI(fetchLink);
    generatePics(data);
}



curatedPhotos();
