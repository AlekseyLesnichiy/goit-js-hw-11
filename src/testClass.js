export default class PixabayService {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
    }
      makeGallery(value) {
         return value.map(({ tags, likes, views, comments, downloads,webformatURL}) => {
        return `
      
<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
    fetchPictures(gallery) {
    const API_KEY = "25692135-5d828cfba98a327a5afd7ad3f";
    const URL = "https://pixabay.com/api/?key=";
        fetch(`${URL}` + API_KEY + "&q=" + encodeURIComponent(this.searchQuery) +
            `&image_type= photo&orientation=horizontal&safesearch=true&per_page=8&page=${this.page}`)
            .then(response => response.json())
        .then(value => value.hits)
        .then(value => {
            gallery = this.makeGallery(value)
        })
        .then (value => this.incrementPage())
}

  
    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}