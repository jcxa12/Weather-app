// Determinate the var that I'm going in the file

var searchedCity;
var cities = [];
var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

// When the user clicks the button "Search" it will display the city information requested. If there is no input, it will display an error message
var userCity = function (event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();
  if (city) {
    getCityWeather(city);
    getFiveDays(city);
    cities.unshift({ city });
    cityInputEl.value = "";
  } else {
    alert("*ERROR* Sorry! You need to enter a City");
    return;
  }
  saveSearch();
  pastSearch(city);
};

// The previous search will be save in a variable and display in the current page
var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};

// Gets the information from openweathermap: assigned my api Key to a variable for easy access
var getCityWeather = function (city) {
  var apiKey = "304ffb52cc46f948fb53eb74d0c7bc5a";
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city);
    });
  });
};

// Bring the current weather from the city searched
var displayWeather = function (weather, searchCity) {
  weatherContainerEl.textContent = "";
  citySearchInputEl.textContent = searchCity;

  //Since I need to display date, image, temperature, humidity and wind: create a variable for each, determinate the characteristics to display and add them to a span

  var currentDate = document.createElement("span");
  currentDate.textContent =
    " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  citySearchInputEl.appendChild(currentDate);

  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  citySearchInputEl.appendChild(weatherIcon);

  var temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + Math.round(weather.main.temp) + " °C";
  temperatureEl.classList = "list-group-item";

  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "list-group-item";

  var windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " KPH";
  windSpeedEl.classList = "list-group-item";

  // Appending the info to the container
  weatherContainerEl.appendChild(temperatureEl);
  weatherContainerEl.appendChild(humidityEl);
  weatherContainerEl.appendChild(windSpeedEl);

};

// Get the information for the next 5 days
var getFiveDays = function (city) {
  var apiKey = "304ffb52cc46f948fb53eb74d0c7bc5a";
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayFiveDay(data);
    });
  });
};

  //Same as previous step but display the next information for the next 5 days
  
  var displayFiveDay = function (weather) {
  forecastContainerEl.textContent = "";
  forecastTitle.textContent = "5-Day Forecast:";

  var forecast = weather.list;
  for (var i = 5; i < forecast.length; i = i + 8) {
    var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-primary text-light m-2";

    var forecastDate = document.createElement("h5");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);

    var weatherIcon = document.createElement("img");
    weatherIcon.classList = "card-body text-center";
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );

    var forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card-body text-center";
    forecastTempEl.textContent = Math.round(dailyForecast.main.temp) + " °C";

    var forecastHumEl = document.createElement("span");
    forecastHumEl.classList = "card-body text-center";
    forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

    // Append the information to forecast 
    forecastEl.appendChild(weatherIcon);
    forecastEl.appendChild(forecastTempEl);
    forecastEl.appendChild(forecastHumEl);

    // Append the information from forecast to container 
    forecastContainerEl.appendChild(forecastEl);
  }
};

// Show last city searched 

var pastSearch = function (pastSearch) {

  pastSearchEl = document.createElement("button");
  pastSearchEl.textContent = pastSearch;
  pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
  pastSearchEl.setAttribute("data-city", pastSearch);
  pastSearchEl.setAttribute("type", "submit");

  pastSearchButtonEl.prepend(pastSearchEl);
};

// When the user click in the previous city, it will bring the information from that city
var oldCity = function (event) {
  var city = event.target.getAttribute("data-city");
  if (city) {
    getCityWeather(city);
    getFiveDays(city);
  }
};

cityFormEl.addEventListener("submit", userCity);
pastSearchButtonEl.addEventListener("click", oldCity);