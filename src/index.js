import './css/styles.css';
import ImagApiServes from './axios-request';
import template from './templates/image-teplate.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import LoadMore from './components/load-more-btn';
import getRefs from './get-refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import smoothScroll from './components/smooth-scroll';

const refs = getRefs();
const ImagesApiServes = new ImagApiServes();
const LoadMoreBtn = new LoadMore({ selector: '.load-more', hidden: true });
let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  scrollZoom: false,
});

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

let totaPaginate = 0;

function onSearch(eve) {
  eve.preventDefault();
  form = eve.currentTarget.elements.searchQuery.value.trim();

  if (form !== '') {
    clearArticles();
    LoadMoreBtn.hide();
    LoadMoreBtn.disable();
    ImagesApiServes.query = form;
    ImagesApiServes.resetPage();
    ImagesApiServes.queryOnServer()
      .then(responseСheck)
      .then(showTotalElements)
      .then(renderOnPage)
      .catch(showingError)
      .finally(eve.currentTarget.reset());
  }
}

function onLoadMore() {
  ImagesApiServes.queryOnServer()
    .then(responseСheck)
    .then(renderOnPage)
    .catch(showingError)
    .finally(hideBtnOnTheEnd);
}

function responseСheck(response) {
  if (response.hits == false) {
    throw new Error();
  }
  return response;
}

function renderOnPage(response) {
  const createHTML = response.hits.map(el => template(el)).join('');
  refs.output.insertAdjacentHTML('beforeend', createHTML);
  gallery.refresh();
  LoadMoreBtn.show();
  LoadMoreBtn.enable();
}

function clearArticles() {
  refs.output.innerHTML = '';
}

function showingError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      timeout: 5000,
    }
  );
}

function showTotalElements(response) {
  totaPaginate = Math.ceil(response.totalHits / 40);
  Notify.success(`Hooray! We found ${response.totalHits} images.`, {
    timeout: 5000,
  });
  return response;
}

function onTheEndSearch() {
  Notify.info("We're sorry, but you've reached the end of search results.", {
    info: {
      background: '#0b78a3',
    },
  });
}

function hideBtnOnTheEnd() {
  smoothScroll();
  if (ImagesApiServes.page > totaPaginate) {
    LoadMoreBtn.hide();
    LoadMoreBtn.disable();
    onTheEndSearch();
  }
}
