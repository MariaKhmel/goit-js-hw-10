import './css/styles.css';
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.input.addEventListener('input',debounce (onInput,DEBOUNCE_DELAY) );

function onInput(e) {
    const inputValue = e.target.value.trim(); 

    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';

      if(inputValue === '') {
        return
      }
      else {
     fetchCountries(inputValue)
        .then( response => {
        if(response.length > 10) {
   Notify.warning('Too many matches found. Please enter a more specific name.');
        }
             else if (response.length >= 2 && response.length <= 10) {
        refs.countryList.innerHTML = countryListMarkup(response);
    } else {
        refs.countryInfo.innerHTML = countryInfoMarkup(response);
        }
           
                
        }) 
    .catch(error => {
     console.log(error);
     Notify.failure('Oops, there is no country with that name');
     }   )   
    }

}

function countryListMarkup(countries) {
return countries.map(({flags, name}) => {
    return `
    <li class="country-item">
<img class="country-flag" src="${flags.svg}"></img>
<p class="country-name">${name.official}</p>
</li>`;
})
.join('');

}

function countryInfoMarkup(countries) {
return countries.map(({name, flags, capital, population, languages}) =>{
    return `<div class="country-info__name"><img src="${flags.svg}" alt="${
        name.official}" class="country-flag" />${name.official}</div>
        <p><span class="country-info__boldtext">Capital: </span>${capital}</p>
        <p><span class="country-info__boldtext">Population: </span>${population}</p>
        <p><span class="country-info__boldtext">Languages: </span>${Object.values(languages).join(', ')}</p>`;
}).join('');
}

