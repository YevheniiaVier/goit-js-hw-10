import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';

const a = {};
function countryCardTpl({ flags, name, capital, population, languages }) {
  const murkup = `<div class='country__main'>
  <img src=${flags.svg} alt='${name.official}' class='country__flag' />
  <h2 class='country__name'>${name.official}</h2>
</div>
<p class='country__capital'>Capital:${capital[0]}</p>
<p class='country__population'>Population: ${population}</p>
<p class='country__languages'>Languages: ${languages.ukr}</p>`;
  console.log(murkup);
  return murkup;
}

const refs = {
  countryText: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

// https://restcountries.com/v3.1/name/{name}
// filter: https://restcountries.com/v2/{service}?fields={field},{field},{field}

fetchCountries('poland')
  .then(renderCountryCard)
  .catch(error => console.log(error));

function renderCountryCard(country) {
  const markup = countryCardTpl(country);
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}
