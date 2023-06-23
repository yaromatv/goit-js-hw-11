import PicsApiService from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const picsApiService = new PicsApiService();

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.search-input'),
  searchBtn: document.querySelector('.search-button'),
  moreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSearchClick);
refs.moreBtn.addEventListener('click', onMoreClick);

async function onSearchClick(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';
  picsApiService.pageReset();
  refs.moreBtn.classList.add('is-hidden');

  if (event.currentTarget.elements.searchQuery.value === '') {
    Notify.warning('Please type something.');
    return;
  }

  picsApiService.query = event.currentTarget.elements.searchQuery.value;

  const data = await picsApiService.fetchQuery();

  if (data.totalHits === 0) {
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  Notify.success(`Hooray! We found ${data.totalHits} images.`);

  renderCard(data);
  refs.moreBtn.classList.remove('is-hidden');

  checkEndReach();
}

async function onMoreClick() {
  const data = await picsApiService.fetchQuery();
  renderCard(data);
  checkEndReach();
}

function checkEndReach() {
  if (picsApiService.total < 40 * (picsApiService.page - 1)) {
    refs.moreBtn.classList.add('is-hidden');

    Notify.warning(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}

function renderCard(data) {
  const fragment = document.createDocumentFragment();

  data.hits.forEach(item => {
    const card = document.createElement('div');
    card.className = 'photo-card';

    card.innerHTML = `<img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        Likes <br/><b>${item.likes}</b>
      </p>
      <p class="info-item">
        Views <br/><b>${item.views}</b>
      </p>
      <p class="info-item">
        Comments <br/><b>${item.comments}</b>
      </p>
      <p class="info-item">
        Downloads <br/><b>${item.downloads}</b>
      </p>
    </div>`;

    fragment.appendChild(card);
  });

  refs.gallery.appendChild(fragment);
}
