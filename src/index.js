import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetch-countries.js';
import { getRefs } from './get-refs.js';

import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

function countryCardTpl(countries) {
  const { flags, name, capital, population, languages } = countries[0];
  const lang = Object.values(languages).join(', ');
  return `<div class='country__main'>
  <div class="img_thumb"><img src="${flags.svg}" alt="${
    name.official
  }" class='country__flag'></div>
  <h2 class='country__name'>${name.official}</h2>
</div>
<ul class='content'>
  ${
    name
      ? `<li class='content__item'><span class = 'item__title'>Capital:</span> ${capital[0]}</li>`
      : ''
  }
  ${
    population
      ? `<li class='content__item'><span class = 'item__title'>Population:</span> ${population}</li>`
      : ''
  }
  ${
    lang
      ? `<li class='content__item'><span class = 'item__title'>Languages:</span> ${lang}</li>`
      : ''
  }
</ul>`;
}

function countryListMarkup(countryList) {
  return countryList
    .map(({ name, flags }) => {
      return `
    <li class="country__item">
  <div class="img_thumb"><img src="${flags.svg}" alt="${name.official}" class='country__flag'></div>
  <h2 class='country__name'>${name.official}</h2>
</li>
    `;
    })
    .join('');
}

const refs = getRefs();

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const searchQuery = e.target.value.trim();
  if (searchQuery === '') {
    clearContent();
    return;
  }

  fetchCountries(searchQuery).then(renderContent).catch(onFetchError);
}

function renderCountryCard(countries) {
  const markup = countryCardTpl(countries);
  refs.countryInfo.innerHTML = markup;
}

function renderCountryList(countries) {
  //   clearContent();
  const markup = countryListMarkup(countries);
  refs.countryInfo.innerHTML = markup;
}

function onFetchError(error) {
  Notify.failure('Oops, there is no country with that name');
}

function clearContent() {
  refs.countryInfo.innerHTML = '';
}

function renderContent(countries) {
  if (countries.length >= 10) {
    clearContent();
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length >= 2 && countries.length < 10) {
    clearContent();
    renderCountryList(countries);
  } else if (countries.length === 1) {
    renderCountryCard(countries);
  }
}
