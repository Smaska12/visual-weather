const cityName = document.querySelector('.city-name');
const btnSearch = document.querySelector('.btn-search');

const latitude = document.querySelector('.latitude');
const longitude = document.querySelector('.longitude');
const temp = document.querySelector('.temp');

btnSearch.addEventListener('click', async () => {
    let inputText = cityName.value;

    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputText)}&count=5&language=ru&format=json`
    );

    const data = await response.json();
    const firstResult = data.results[0];

    console.log(firstResult);
})