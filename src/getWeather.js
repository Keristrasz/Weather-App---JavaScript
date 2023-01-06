// AXIOS WAY:

// import axios from "axios"

// export function getWeather(lat, lon, timezone) {
//   return axios.get("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime", 
// {
//     params: {
//       latitude: lat,
//       longitude: lon,
//       timezone,
//     },
//   })
// }

// NEEDED URL FROM OPEN API: https://open-meteo.com/

 // https://api.open-meteo.com/v1/forecast?latitude=49.19&longitude=16.66&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=Europe%2FBerlin

export function getWeather(lat, lon, timezone) {

  let params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      timezone,
  })
  let url = `https://api.open-meteo.com/v1/forecast?${ params.toString() }&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime`
  console.log(url)

  //return fetch(url).then(data => data.json())
  
  return fetch(url)
    .then(data => data.json())
    .then(data => { return {
    current: parseCurrentWeather(data),
    daily: parseDailyWeather(data),
    hourly: parseHourlyWeather(data),
  }})
}

//destructuring current_weather = Object.current_weather, daily = Object.daily

function parseCurrentWeather({ current_weather, daily }) {

  //destructuring current weather values ... const currentTemp = current_weather.tempeture, const windSpeed = cu  ...
  
  const {
    weathercode: currentIconCode,
    temperature: currentTemp, 
    windspeed: todayWindSpeed, 
        } = current_weather;

  //destructuring daily values
  // temperature_2m_min[0]: todayLowTemp cant be used for some reason, so we can use destructuring array - temperature_2m_max: [todayHighTemp] //// const todayHighTemp = daily.temperature_2m_max[0]

//  const todayHighTemp = daily.temperature_2m_max;
  
  const {
    weathercode: [todayIconCode],
    temperature_2m_max: [todayMaxTemp],
    temperature_2m_min: [todayMinTemp],
    precipitation_sum: [todayWater],
    apparent_temperature_max: [todayApparentTempMax],
    apparent_temperature_min: [todayApparentTempMin],
    
  } = daily;

  return {
    currentIconCode: Math.round(currentIconCode),
    currentTemp: Math.round(currentTemp),
    todayIconCode: Math.round(todayIconCode),
    todayMaxTemp: Math.round(todayMaxTemp),
    todayMinTemp: Math.round(todayMinTemp),
    todayWindSpeed: Math.round(todayWindSpeed),
    todayWater: Math.round(todayWater),
    todayApparentTempMax: Math.round(todayApparentTempMax),
    todayApparentTempMin: Math.round(todayApparentTempMin),
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

  return hourly.time.map((elem, index) => {
      return {
            hourlyTime: elem,
            hourlyIcon: hourlyIcon[index],
            hourlyTemp: hourlyTemp[index],
            hourlyWind: hourlyWind[index],
            hourlyWater: hourlyWater[index],
            hourlyHumidity: hourlyHumidity[index],
      }}).filter((elem) => current_weather.time <= elem.hourlyTime)

  //or .filter(({hourlyTime}) => current_weather.time <= hourlyTime)
  
}

// function getHourlyTime(arrayOfUnixTime, currentUnixTime) {
// {hourlyDays: new Date(elem * 1000).toLocaleDateString("en-us", { weekday: 'long' }), hourlyHours: new Date(elem * 1000).getHours()}
//     const date = new Date(arrayOfUnixTime[i] * 1000);
//     hourlyHours.push(date.getHours());
//     hourlyDays.push(date.toLocaleDateString("en-us", { weekday: 'long' }));
//     }
//   }
//   return {
//     hourlyHours: hourlyHours,
//     hourlyDays: hourlyDays,
//   }
// }

function getDailyTime(arrayOfUnixTime) {

  let hourlyDays = [];

  for (let i = 0; i < arrayOfUnixTime.length; i++) {
    const date = new Date(arrayOfUnixTime[i] * 1000);
    hourlyDays.push(date.toLocaleDateString("en-us", { weekday: 'long' })); 
  }
  return hourlyDays;
}