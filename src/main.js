import { getWeather } from "./getWeather.js";
import { ICON_MAP } from "./iconMap.js";

navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

// sets corrent long and lat coords, and calls getWeather, for rendering all values

function positionSuccess(GeoLocationCoordinates) {
  // or just ({coords}) instead
  getWeather(
    GeoLocationCoordinates.coords.latitude,
    GeoLocationCoordinates.coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
    .then((res) => {
      //   console.log(res); // (res) log with changed API data
      renderWeather(res);
    })
    .catch((err) => console.log(err));
}

function positionError() {
  alert(
    "There was an error getting your location. Please allow to use your location and refresh the page"
  );
}

//Intl.DateTimeFormat().resolvedOptions().timeZone to get current timezone

//func for rendering all changing values, in goes object from API from ./getWeather.js

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove("blurred");
}

//function from iconMap.js to get proper class name from weather code from API

function getIcon(iconCode) {
  return ICON_MAP.get(iconCode);
}

//current.currentTemp are all values from API from ./getWeather.js
// Rendering CUrrent Section - Header

function renderCurrentWeather(current) {
  document.querySelector("[data-current-temp]").textContent =
    current.currentTemp;
  document.querySelector("[data-current-max-temp]").textContent =
    current.todayMaxTemp;
  document.querySelector("[data-current-min-temp]").textContent =
    current.todayMinTemp;
  document.querySelector("[data-current-water]").textContent =
    current.todayWater;
  document.querySelector("[data-current-max-feel-temp]").textContent =
    current.todayApparentTempMax;
  document.querySelector("[data-current-min-feel-temp]").textContent =
    current.todayApparentTempMin;
  document.querySelector("[data-current-wind]").textContent =
    current.todayWindSpeed;
  document
    .querySelector("[data-current-today-icon]")
    .classList.remove("fa-sun");
  document
    .querySelector("[data-current-today-icon]")
    .classList.add(getIcon(current.todayIconCode));
  document.querySelector("[data-current-icon]").classList.remove("fa-sun");
  document
    .querySelector("[data-current-icon]")
    .classList.add(getIcon(current.currentIconCode));
}

//We have to remove set daily section, and render map of new with template we set in back of html

const dailySection = document.querySelector("[data-section-days]");
const dayCardTemplate = document.getElementById("day-card-template");

//Rendering Day Section

function renderDailyWeather(daily) {
  dailySection.innerHTML = ""; //removes daily section
  daily.dailyIconCode.forEach((day, index) => {
    const DAY_TEMPLATE = dayCardTemplate.content.cloneNode(true);
    //to clone template, we dont select document, but each element - temp
    DAY_TEMPLATE.querySelector("[data-day-value]").textContent =
      daily.dailyTemp[index];
    DAY_TEMPLATE.querySelector("[data-day-date]").textContent =
      daily.dailyTime[index];
    DAY_TEMPLATE.querySelector("[data-day-icon]").classList.add(
      getIcon(daily.dailyIconCode[index])
    );
    dailySection.append(DAY_TEMPLATE); //to append each template to dailySection
  });
}

const hourlySection = document.querySelector("[data-section-hours]");
const hourRowTemplate = document.getElementById("hour-row-template");

//Rendering Hour Section

function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";

  hourly.forEach((hour) => {
    const HOUR_TEMPLATE = hourRowTemplate.content.cloneNode(true);
    HOUR_TEMPLATE.querySelector("[data-hour-day]").textContent =
      hour.hourlyDayName;
    HOUR_TEMPLATE.querySelector("[data-hour-hour]").textContent =
      hour.hourlyHours;
    HOUR_TEMPLATE.querySelector("[data-hour-icon]").classList.add(
      getIcon(hour.hourlyIcon)
    );
    HOUR_TEMPLATE.querySelector("[data-hour-temp]").textContent =
      hour.hourlyTemp;
    HOUR_TEMPLATE.querySelector("[data-hour-wind]").textContent =
      hour.hourlyWind;
    HOUR_TEMPLATE.querySelector("[data-hour-water]").textContent =
      hour.hourlyWater;
    HOUR_TEMPLATE.querySelector("[data-hour-humidity]").textContent =
      hour.hourlyHumidity;

    hourlySection.append(HOUR_TEMPLATE);
  });
}
