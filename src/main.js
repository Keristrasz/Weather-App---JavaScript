import { getWeather } from "./getWeather.js";

//Intl.DateTimeFormat().resolvedOptions().timeZone

getWeather(49.19, 16.66, Intl.DateTimeFormat().resolvedOptions().timeZone)
  .then(res => {
    console.log(res)
  })
  .catch(err => console.log(err))

