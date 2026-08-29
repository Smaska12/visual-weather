const cityName = document.querySelector('.city-name');
const btnSearch = document.querySelector('.btn-search');

const latitudeArea = document.querySelector('.latitude');
const longitudeArea = document.querySelector('.longitude');
const windSpeedArea = document.querySelector('.wind-speed');
const humidityArea = document.querySelector('.humidity');
const tempArea = document.querySelector('.temp');

btnSearch.addEventListener('click', async () => {
    let inputText = cityName.value;

    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputText)}&count=5&language=ru&format=json`
    );

    const data = await response.json();
    const firstResult = data.results[0];
    const latitude = firstResult.latitude;
    const longitude = firstResult.longitude;

    getCurrentTemp(latitude, longitude);

    console.log();
})

function getCurrentDateInTimeZone(timeZone) {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        hour12: false
    });

    const parts = formatter.formatToParts(now);
    const get = (type) => parts.find(p => p.type === type).value;

    let hour = get('hour');
    if (hour === '24') hour = '00';

    return `${get('year')}-${get('month')}-${get('day')}T${hour}:00`;
}

async function getCurrentTemp(latitude, longitude) {
    const weather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
    );

    const weatherData = await weather.json();
    const times = weatherData.hourly.time;
    const temps = weatherData.hourly.temperature_2m;
    const windSpeed = weatherData.hourly.wind_speed_10m;
    const humidity = weatherData.hourly.relative_humidity_2m;

    const timezone = weatherData.timezone;
    const currentDate = getCurrentDateInTimeZone(timezone);

    const index = times.indexOf(currentDate);

    latitudeArea.textContent = `Широта: ${latitude}°`;
    longitudeArea.textContent = `Долгота: ${longitude}°`;

    if (index !== -1) {
        const currentTemp = temps[index];
        const currentWindSpeed = windSpeed[index];
        const currentHumidity = humidity[index];
        const displayTime = new Date(times[index]).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
        tempArea.textContent = `Температура: ${currentTemp}°C`;
        windSpeedArea.textContent = `Скорость ветра: ${currentWindSpeed}км/ч`;
        humidityArea.textContent = `Влажность: ${currentHumidity}%`;
        console.log(`Сейчас ${displayTime} (по времени города) → ${currentTemp}°C`);
        return currentTemp;
    } else {
        console.log('Данных для текущего часа нет');
        tempArea.textContent = 'Нет данных';
        return null;
    }
}