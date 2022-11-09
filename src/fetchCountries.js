const BASE_URL = 'https://restcountries.com/v3.1/name/';
// const countryName = '';

export function fetchCountries(name) {
  return fetch(`${BASE_URL}${name}`)
    .then(response => {
      return response.json();
    })
    .then(getCountryFromArray);
}
function getCountryFromArray(array) {
  return array.reduce(
    (acc, obj) => ({
      ...obj,
    }),

    {}
  );
}
