import './sass/main.scss';
// Описан в документации
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";
const axios = require('axios').default;
import Notiflix from 'notiflix';

const refs = {
    "form": document.querySelector("#search-form"),
    "submitBtn": document.querySelector("[data-submit]"),
    "loadBtn": document.querySelector(".load-more"),
    "input": document.querySelector("[data-input]"),
    "gallery": document.querySelector(".gallery")
}
const API_KEY = "25692135-5d828cfba98a327a5afd7ad3f";
const URL = "https://pixabay.com/api/";
let lightbox = new SimpleLightbox('.photo-card a');
let page = 0;
let globalSearchQuery;
let hitsCounter = 0;
 refs.form.addEventListener("submit", evt)
function evt(event) {
  event.preventDefault();
}
refs.loadBtn.classList.add("hidden");
refs.submitBtn.addEventListener("click", onSearch);
refs.loadBtn.addEventListener("click", loadMore);
function onSearch() {
    let searchQuery = refs.input.value.trim();
    
    globalSearchQuery = searchQuery;
    page = 1;
    
    axiGet(searchQuery)
        .then(function (response) {
            if (response.hits.length === 0) {
                throw Error;
            }
            return response;
        })
        .then(value => {
            Notiflix.Notify.success(`Hooray! We found ${value.totalHits} images.`)
           return value.hits
        })
        .then(value => {
            refs.gallery.innerHTML = makeGallery(value)
            refs.loadBtn.classList.remove("hidden");
            lightbox.refresh();
            smoothScroll();
        })
    .catch(error => {
             Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    })
    
}
function axiGet(value) {
    return axios.get(`${URL}`, {
        params: {
            key: API_KEY,
            q: encodeURIComponent(value),
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            per_page: 40,
            page: page,

        }
    })
    .then(response => response.data)
}
function makeGallery(value) {
    return value.map(({ tags, likes, views, comments, downloads,webformatURL,largeImageURL}) => {
        return `
      
<div class="photo-card">
 <a href="${largeImageURL}"> <img src="${webformatURL}" alt="${tags}" loading="lazy"/> </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
       ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
       ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
       ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
       ${downloads}
    </p>
  </div>
</div>`
    }).join(" ");
}

function loadMore() {
    page += 1;
    axiGet(globalSearchQuery)
        .then(response => {
            hitsCounter += response.hits.length;
            if (hitsCounter >= response.totalHits) {
                refs.loadBtn.classList.add("hidden");
                Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
            }
            return response;
        })
    .then(value => value.hits)
        .then(value => {
            refs.gallery.insertAdjacentHTML("beforeend", makeGallery(value))
            lightbox.refresh();
            smoothScroll();
        })
}
function smoothScroll() {
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 5,
  behavior: "smooth",
});
}

// function tryFetch(value) {
//  return       fetch(`${URL}` + API_KEY + "&q=" + encodeURIComponent(value)+ `&image_type= photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
// .then (response => response.json())
// }



// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.


// "We're sorry, but you've reached the end of search results."