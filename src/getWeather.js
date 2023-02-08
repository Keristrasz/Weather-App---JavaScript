// NEEDED URL FROM OPEN API: https://open-meteo.com/

// https://api.open-meteo.com/v1/forecast?latitude=49.19&longitude=16.66&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=Europe%2FBerlin

export function getWeather(lat, lon, timezone) {
  let params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    timezone,
  });
  let url = `https://api.open-meteo.com/v1/forecast?${params.toString()}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime`;


  return fetch(url)
    .then((data) => data.json())
    .then((data) => {
      return {
        current: parseCurrentWeather(data),
        daily: parseDailyWeather(data),
        hourly: parseHourlyWeather(data),
      };
    });
}
//destructuring current_weather = Object.current_weather, daily = Object.daily

function parseCurrentWeather({ current_weather, daily }) {
  //destructuring current weather values ... const currentTemp = current_weather.tempeture, const windSpeed = cu  ...

  const {
    weathercode: currentIconCode,
    temperature: currentTemp,
    windspeed: todayWindSpeed,
  } = current_weather;  //from current weather part

  // destructuring daily values
  // temperature_2m_min[0]: todayLowTemp cant be used for some reason, so we can use destructuring array - temperature_2m_max: [todayHighTemp] //// const todayHighTemp = daily.temperature_2m_max[0]

  //  const todayHighTemp = daily.temperature_2m_max;

  const {
    weathercode: [todayIconCode],
    temperature_2m_max: [todayMaxTemp],
    temperature_2m_min: [todayMinTemp],
    precipitation_sum: [todayWater],
    apparent_temperature_max: [todayApparentTempMax],
    apparent_temperature_min: [todayApparentTempMin],
  } = daily;    //from daily weather part, its daily values of array, not one single value

  return {
    currentIconCode,
    currentTemp,
    todayIconCode,
    todayMaxTemp,
    todayMinTemp,
    todayWindSpeed,
    todayWater,
    todayApparentTempMax,
    todayApparentTempMin,
  };
}

function parseDailyWeather({ daily }) {
  const {
    weathercode: dailyIconCode,
    temperature_2m_max: dailyTemp,
    time: dailyTime,
  } = daily;

  return {
    dailyIconCode: dailyIconCode,
    dailyTemp: dailyTemp,
    dailyTime: getDailyTime(dailyTime),
  };
}

function parseHourlyWeather({ hourly, current_weather }) {
  const {
    time: hourlyTime,
    weathercode: hourlyIcon,
    temperature_2m: hourlyTemp,
    windspeed_10m: hourlyWind,
    precipitation: hourlyWater,
    relativehumidity_2m: hourlyHumidity,
  } = hourly;

  //map hourly.time so we can map and filter (and later render) dates in future, not in past, API returns hours from 0 AM

  return hourly.time
    .map((elem, index) => {
      return {
        hourlyTime: elem,
        hourlyIcon: hourlyIcon[index],
        hourlyTemp: hourlyTemp[index],
        hourlyWind: Math.round(hourlyWind[index]),
        hourlyWater: hourlyWater[index],
        hourlyHumidity: hourlyHumidity[index],
      };
    })
    .filter((elem) => current_weather.time <= elem.hourlyTime) //or .filter(({hourlyTime}) => current_weather.time <= hourlyTime)
    .map((elem) => {
      elem.hourlyHours = new Date(elem.hourlyTime * 1000).getHours(); //to get hours from UNIX timestamp
      elem.hourlyDayName = new Date(elem.hourlyTime * 1000).toLocaleDateString(
        // to get day name from unix timestamp
        "en-us",
        {
          weekday: "long",  //long day - friday, short day - fri
        }
      );
      if (elem.hourlyHours >= 21 || elem.hourlyHours <= 5) {  //to get moon icon insteaad of sun icon at night
        if (
          elem.hourlyIcon === 0 ||
          elem.hourlyIcon === 1 ||
          elem.hourlyIcon === 2
        ) {
          elem.hourlyIcon = 101;
        }
      }
      return elem;
    });
}

//imperative way to get the same done for daily values, in hourly we used map, filter

function getDailyTime(arrayOfUnixTime) {
  let hourlyDays = [];

  for (let i = 0; i < arrayOfUnixTime.length; i++) {
    const date = new Date(arrayOfUnixTime[i] * 1000);
    hourlyDays.push(date.toLocaleDateString("en-us", { weekday: "long" }));
  }
  return hourlyDays;
}
