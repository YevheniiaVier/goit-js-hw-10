import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetch-countries.js';
import { getRefs } from './get-refs.js';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const refs = getRefs();

function countryCardTpl([{ flags, name, capital, population, languages }]) {
  const lang = Object.values(languages).join(', ');
  return `<div class='country__main'>
  <img src="${flags.svg}" alt="${name.common}" class='country__flag'>
  <h2 class='country__name'>${name.common}</h2>
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
 <img src="${flags.svg}" alt="${name.common}" class = 'country__flag'>
   ${name.common}
</li>
    `;
    })
    .join('');
}

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const searchQuery = e.target.value.trim();
  if (searchQuery === '') {
    clearContent();
    return;
  }
  fetchCountries(searchQuery)
    .then(body => {
      body.forEach((element, index) => {
        if (element.name.common === 'Russia') {
          body[index].flags.svg =
            'https://e7.pngegg.com/pngimages/642/765/png-clipart-feces-pile-of-poo-emoji-logo-others-miscellaneous-brown-thumbnail.png';
        }
      });
      renderContent(body);
    })
    .catch(onFetchError);
}

function renderCountryCard(countries) {
  clearContent();
  const markup = countryCardTpl(countries);
  refs.countryInfo.innerHTML = markup;
}

function renderCountryList(countries) {
  clearContent();
  const markup = countryListMarkup(countries);
  refs.countryList.innerHTML = markup;
}

function onFetchError(error) {
  Notify.failure('Oops, there is no country with that name');
}

function clearContent() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function renderContent(countries) {
  if (countries.length >= 10) {
    clearContent();
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length >= 2 && countries.length < 10) {
    renderCountryList(countries);
  } else if (countries.length === 1) {
    renderCountryCard(countries);
  }
}
