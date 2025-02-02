/* WEATHER REPORT JAVASCRIPT FILE */

//////////*    API CALLS & ASSIGNING API VALUES    *///////////////////////////

const serverAddress = 'http://127.0.0.1:5000';

const populateWeatherReport = function (weatherData) {
  const tempKelvin = weatherData.current.temp;
  const tempFahrenheit = Math.floor((tempKelvin - 273.15) * 1.8 + 32);
  state.temp = tempFahrenheit;
  colorTempChange();
  chooseSky(weatherData.current.weather[0].id);
};

const chooseSky = (skyData) => {
  let sky = '';
  if (
    (skyData >= 701 && skyData <= 781) ||
    (skyData >= 803 && skyData <= 804)
  ) {
    sky = 'Cloudy';
  } else if (skyData >= 200 && skyData <= 599) {
    sky = 'Rainy';
  } else if (skyData >= 600 && skyData <= 700) {
    sky = 'Snowy';
  } else if (skyData >= 800) {
    sky = 'Sunny';
  }
  let skySelect = document.querySelector('#skySelect');
  skySelect.value = sky;
  changeSky();
};

const cityCallWeather = function (serverAddress, city) {
  axios
    .get(`${serverAddress}/location`, {
      params: {
        q: city,
      },
    })
    .then((response) => {
      if (response.data.error === 'Unable to geocode') {
        throw 'Invalid city name';
      }

      let longitude = response.data[0].lon;
      let latitude = response.data[0].lat;

      axios
        .get(`${serverAddress}/weather`, {
          params: {
            lat: latitude,
            lon: longitude,
          },
        })
        .then((response) => {
          populateWeatherReport(response.data);
        })
        .catch((response) => {
          console.log(response.status);
          console.log(
            'There was an unexpected issue with the weather API request.'
          );
        });
    })
    .catch((response) => {
      const cityName = document.querySelector('#cityName');
      cityName.textContent = 'Invalid City Name';
    });
};

//////////*    CITY NAME ENTRY    *////////////////////////////////////////////

const inputElement = document.querySelector('#userInput');

const resetInput = () => {
  const cityName = document.querySelector('#cityName');
  inputElement.value = '';
  cityName.textContent = 'Seattle';
  cityCallWeather(serverAddress, cityName.textContent);
};

const changeCityName = (event) => {
  const cityName = document.querySelector('#cityName');
  const inputCityName = event.target.value;
  if (inputCityName === '') {
    cityName.textContent = 'Seattle';
  } else {
    normalizeCityName(inputCityName);
  }
  cityCallWeather(serverAddress, cityName.textContent);
};

normalizeCityName = (inputCityName) => {
  const normalizedCityName = inputCityName
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
  cityName.textContent = normalizedCityName;
};

const getRealTemp = () => {
  const cityName = document.querySelector('#cityName');
  cityCallWeather(serverAddress, cityName.textContent);
};

//////////*    TEMPERATURE DIFFERENCE    */////////////////////////////////////
('use strict');
const state = {
  temp: 50,
};

const increaseTemp = () => {
  state.temp += 1;
  colorTempChange();
};

const decreaseTemp = () => {
  state.temp -= 1;
  colorTempChange();
};

const colorTempChange = () => {
  let temp = state.temp;
  let color = 'tempRed';
  let landscape = '🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂';
  if (temp >= 80) {
    color = 'tempRed';
    landscape = '🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂';
  } else if (temp >= 70) {
    color = 'tempOrange';
    landscape = '🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷';
  } else if (temp >= 60) {
    color = 'tempYellow';
    landscape = '🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃';
  } else if (temp >= 50) {
    color = 'tempGreen';
    landscape = '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲';
  } else if (temp < 50) {
    color = 'tempTeal';
    landscape = '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲';
  }

  const tempDisplay = document.querySelector('#tempValue');
  tempDisplay.textContent = `${state.temp}`;
  tempDisplay.className = color;
  const gardenLandscape = document.querySelector('#landscape');
  gardenLandscape.textContent = landscape;
};

const changeSky = () => {
  const skySelect = document.getElementById('skySelect').value;

  let sky = '';
  if (skySelect === 'Sunny') {
    sky = '☁️ ☁️ ☁️ ☀️ ☁️ ☁️';
  } else if (skySelect === 'Cloudy') {
    sky = '☁️☁️ ☁️ ☁️☁️ ☁️ 🌤 ☁️ ☁️☁️';
  } else if (skySelect === 'Rainy') {
    sky = '🌧🌈⛈🌧🌧💧⛈🌧🌦🌧💧🌧🌧';
  } else if (skySelect === 'Snowy') {
    sky = '🌨❄️🌨🌨❄️❄️🌨❄️🌨❄️❄️🌨🌨';
  }
  const gardenSky = document.getElementById('sky');
  gardenSky.textContent = sky;
};

/*    EVENT HANDLERS, OTHER MISC    */ /////////////////////////////////////////

const registerEventHandlers = () => {
  cityCallWeather(serverAddress, 'Seattle');

  const upArrow = document.querySelector('#increaseTemp');
  upArrow.addEventListener('click', increaseTemp);

  const downArrow = document.querySelector('#decreaseTemp');
  downArrow.addEventListener('click', decreaseTemp);

  const realTempButton = document.getElementById('realTempButton');
  realTempButton.addEventListener('click', getRealTemp);

  inputElement.addEventListener('change', changeCityName);

  const resetButton = document.querySelector('#resetButton');
  resetButton.addEventListener('click', resetInput);

  const skyControls = document.getElementById('skySelect');
  skyControls.addEventListener('change', changeSky);
};

document.addEventListener('DOMContentLoaded', registerEventHandlers);
