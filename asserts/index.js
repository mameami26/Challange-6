const apiKey = 'cde9eecce78b4b0d70d3b7aedcab7e44';
const searchForm = document.querySelector("#search-form");
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryDiv = document.getElementById('search-history');
const searchButton = document.getElementById("search-button");
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

function creatWeatherCard() {
  const cardString = '<div class="card"> <ul class="list-group list-group-flush"><li class="list-group-item">An item</li> <li class="list-group-item">A second item</li> <li class="list-group-item">A third item</li> </ul><div class="card-footer"> Card footer </div></div>'
  const cardElement = $(cardString)

      let createDiv = $("div");

    }

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherData(city);
    updateSearchHistory(city);
  }
});

function fetchWeatherData(city) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)])
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(data => {
      displayCurrentWeather(data[0]);
      displayForecast(data[1]);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function displayCurrentWeather(data) {
  currentWeatherDiv.innerHTML = `
    <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
    <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather icon">
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
  forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';
  for (let i = 0; i < data.list.length; i += 8) {  
    const forecast = data.list[i];
    forecastDiv.innerHTML += `
      <div>
        <h3>${new Date(forecast.dt_txt).toLocaleDateString()}</h3>
        <img src="http://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="Weather icon">
        <p>Temperature: ${forecast.main.temp}°C</p>
        <p>Humidity: ${forecast.main.humidity}%</p>
        <p>Wind Speed: ${forecast.wind.speed} m/s</p>
      </div>
    `;
  }
}

function updateSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
  }
}

function displaySearchHistory() {
  searchHistoryDiv.innerHTML = '<h2>Search History</h2>';
  searchHistory.forEach(city => {
    const cityElement = document.createElement('p');
    cityElement.textContent = city;
    cityElement.addEventListener('click', () => fetchWeatherData(city));
    searchHistoryDiv.appendChild(cityElement);
  });
}


displaySearchHistory();