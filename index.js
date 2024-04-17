let isShowingHourly = false;
let input = document.getElementById("cityName");

input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("search-button").click();
  }
})

document.getElementById("search-button").addEventListener("click", fetchData);

document.addEventListener("DOMContentLoaded", function() {
  const defaultCity = "Zurich";
  document.getElementById("cityName").value = defaultCity;
  fetchData(defaultCity);
});



async function fetchData(){
  try {
    const cityName = document.getElementById("cityName").value.toLowerCase();
    console.log(cityName)
    const apiKey = "9bac4069dcb545479f0143227241404"
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=3&aqi=no`

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Could not fetch resource")
    }
    const data = await response.json()
    console.log(data)
    if (!isShowingHourly) {
      displayThreeDays(data);
    } else {
      displayHourly(data);
    }
    document.getElementById("toggle-forecast").addEventListener("click", toggleForecast);
    displayWeather(data);
  }
  catch(error){
    console.log(error)
  }
}

function toggleForecast() {
  isShowingHourly = !isShowingHourly;
  fetchData();
}



function displayWeather(data) {
  const display = document.querySelector(".display");
  const details = document.querySelector(".weather-details");
  if (data) {
    display.innerHTML = `
    <div class="location-time"><h3>${data.location.name}, ${data.location.country}</h3>
      <span>${formatDateTime(data.location.localtime)}</span>
    </div>
    <div class="feels-like">
      <strong>${data.current.temp_c}°C</strong><br>
      <span>${data.current.condition.text}</span><br>
      <span>Feels like ${Math.round(data.current.feelslike_c)}°C</span>
    </div>
    <img src="${data.current.condition.icon}" alt="Weather Icon">`;

    details.innerHTML = `<div id="today"><h3>Today's weather details</div></h4><br>
    <div id="details">
      <div class="detail">
        <span class="label"><i class="fa-solid fa-droplet"></i> Humidity</span>
        <span class="value">${data.current.humidity}%</span>
      </div>
      <div class="detail">
          <span class="label"><i class="fa-solid fa-cloud-rain"></i> Precipitation</span>
          <span class="value">${data.current.precip_in}</span>
      </div>
      <div class="detail">
          <span class="label"><i class="fa-solid fa-wind"></i> Wind Speed</span>
          <span class="value">${data.current.wind_kph} km/h</span>
      </div>
      <div class="detail">
          <span class="label"><i class="fa-solid fa-cloud"></i> Cloudiness</span>
          <span class="value">${data.current.cloud}%</span>
      </div>
      <div class="detail">
          <span class="label"><i class="fa-solid fa-sun"></i> UV Index</span>
          <span class="value">${data.current.uv}</span>
      </div>
    </div>`


  } else {
    display.innerHTML = "Weather data not available for the specified location."
  }
}

function displayHourly(data) {
  const forecast = document.querySelector(".forecast");
  if (data) {
    let content = `<button id="toggle-forecast">3-Day</button>`;
    console.log(data)
    data.forecast.forecastday[0].hour.forEach(hour => {
      content += `
      <div class="hour">
        <div>
          <span>${new Date(hour.time).getHours()}:00</span>
          <img src="${hour.condition.icon}" alt="Weather Icon">
          <span>${Math.round(hour.temp_c)}°C</span>
        </div>
      </div>`;
    });
    forecast.innerHTML = content;
  } else {
    forecast.innerHTML = "Hourly weather data not available.";
  }
}



function displayThreeDays(data) {
  const forecast = document.querySelector(".forecast");
  if (data) {
    let content = `<button id="toggle-forecast">Hourly</button>`;
    data.forecast.forecastday.forEach(day => {
      content += `
      <div id="forecast-info">
        <div>
          <span>${formatDayOfWeek(day.date)}</span>
          <img src="${day.day.condition.icon}" alt="Weather Icon">
          <span>${Math.round(day.day.mintemp_c)}°C/${Math.round(day.day.maxtemp_c)}°C</span>
        </div>
      </div>`;
    });
    forecast.innerHTML = content;
  } else {
    forecast.innerHTML = "Weather data not available for the specified location.";
  }
}


function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const formatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', // full name of the day
    year: 'numeric', // full numeric year
    month: 'long', // full name of the month
    day: 'numeric', // day of the month
    hour: '2-digit', // hour in 2-digit
    minute: '2-digit', // minute in 2-digit
    hour12: false // 24-hour format
  });

  // The format() method automatically formats the date according to the options
  let formattedDateTime = formatter.format(date).replace(',', '.');
  formattedDateTime = formattedDateTime.replace(' at ', ', ');

  return formattedDateTime;
}


function formatDayOfWeek(dateTimeString) {
  const date = new Date(dateTimeString);

  const formatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', // Full name of the day
  });

  return formatter.format(date);
}
