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
    displayWeather(data)
    displayThreeDays(data)
  }
  catch(error){
    console.log(error)
  }
}

function displayWeather(data) {
  const display = document.querySelector(".display");
  const details = document.querySelector(".weather-details");
  if (data) {
    display.innerHTML = `${data.location.name}, ${data.location.country} <br>
    ${formatDateTime(data.location.localtime)}<br>
    Temperature: ${data.current.temp_c}°C (${data.current.temp_f}°F)<br>
    ${data.current.condition.text}<div>
    Feels like ${data.current.feelslike_c}°C <br>
    <img src="${data.current.condition.icon}" alt="Weather Icon"></div>`;

    details.innerHTML = `Today's weather details<br>
    Humidity: ${data.current.humidity}<br>
    Precipitation: ${data.current.precip_in}<br>
    Wind Speed: ${data.current.wind_kph}<br>
    Cloudiness: ${data.current.cloud}<br>
    UV Index: ${data.current.uv}<br>`

  } else {
    display.innerHTML = "Weather data not available for the specified location."
  }
}

function displayThreeDays(data) {
  const forecast = document.querySelector(".forecast");
  if (data) {
    let content = "";
    data.forecast.forecastday.forEach(day => {
      content += `<div>
        ${formatDayOfWeek(day.date)}<br>
        ${day.day.mintemp_c}°C/${day.day.maxtemp_c}°C<br>
        ${day.day.condition.text}<div><img src="${day.day.condition.icon}" alt="Weather Icon"></div>
      </div><br>`;
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
