const cityName = document.querySelector('.city-name');
const btnSearch = document.querySelector('.btn-search');

const latitudeArea = document.querySelector('.latitude');
const longitudeArea = document.querySelector('.longitude');
const windSpeedArea = document.querySelector('.wind-speed');
const humidityArea = document.querySelector('.humidity');
const tempArea = document.querySelector('.temp');
const dayStatusArea = document.querySelector('.day-status');

btnSearch.addEventListener('click', async () => {
    let inputText = cityName.value.trim();

    if (!inputText) {
        showError("Введите название города");
        return
    }

    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(inputText)}&count=5&language=ru&format=json`
        );

        if (!response) {
            showError('Ошибка сервера, попробуйте позже');
            return
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            showError(`Город "${inputText}" не найден`);
            return
        }

        const firstResult = data.results[0];
        const latitude = firstResult.latitude;
        const longitude = firstResult.longitude;

        getCurrentTemp(latitude, longitude);
    } catch (error) {
        console.log('Ошибка запроса', error);
        showError('Не удалось получить данные. Проверьте подключение к интернету');
    }
})

function showError(message) {
    tempArea.textContent = message;
    latitudeArea.textContent = '';
    longitudeArea.textContent = '';
    windSpeedArea.textContent = '';
    humidityArea.textContent = '';
}

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
    try {
        const weather = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
        );

        if (!weather.ok) {
            showError("Ошибка сервера погоды, попробуйте позже");
            return;
        }

        const weatherData = await weather.json();

        if (!weatherData.hourly || !weatherData.hourly.time) {
            showError('Нет данных о погоде для этой точки');
            return;
        }

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

            const hour = parseInt(currentDate.slice(11, 13), 10);
            const timeOfDay = getTimeOfDay(hour);

            const displayTime = new Date(times[index]).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
            tempArea.textContent = `Температура: ${currentTemp}°C`;
            windSpeedArea.textContent = `Скорость ветра: ${currentWindSpeed}км/ч`;
            humidityArea.textContent = `Влажность: ${currentHumidity}%`;
            dayStatusArea.textContent = `Статус дня: ${timeOfDay}`;

            console.log(`Сейчас ${displayTime} (по времени города) → ${currentTemp}°C`);
            return currentTemp;
        } else {
            console.log('Данных для текущего часа нет');
            tempArea.textContent = 'Нет данных';
            return;
        }
    } catch (error) {
        console.log('Ошибка запроса', error);
        showError('Не удалось получить данные. Проверьте подключение к интернету');
        return;
    }
}

function getTimeOfDay(hour) {
    if (hour >= 6 & hour < 12) return 'Утро';
    if (hour >= 12 & hour < 18) return 'День';
    if (hour >= 18 & hour < 24) return 'Вечер';
    return 'Ночь';
}