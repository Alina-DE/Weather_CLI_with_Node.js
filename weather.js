const axios = require("axios");
require("dotenv").config();

// grabbing argument from CLI - command line interface
const city = process.argv[2];
// try running in command line: node weather hamburg

const units = process.argv[3] || "metric"    // we need to give this argument in command line as:  "node weather hamburg imperial" for Fahrenheit, otherwise assigned default will be used - "metric"
const unitSign = units === "metric" ? "°C" : "°F"


// API url for Openweathermap - use your OWN key:
const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${process.env.KEY}&units=${units}`


// using axios:
function getWeather() {
    axios.get(url)
        .then((res) => {
            const data = res.data

            console.log(data.main.temp > 0 ?
                ("It is now +" + Math.ceil(data.main.temp) + unitSign + " in " + data.name + ", " + data.sys.country) :
                ("It is now " + Math.ceil(data.main.temp) + unitSign + " in " + data.name + ", " + data.sys.country));
            console.log("Current cloudiness is " + data.clouds.all + "%");

            const lon = data.coord.lon;
            const lat = data.coord.lat;

            // using another API for fetching 7-days forecast data, which takes in lat and lon:
            const urlDaily = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${process.env.KEY}&units=${units}`

            axios.get(urlDaily)
                .then((res) => {
                    // as we have 8 days in the array, starting today, we need to get only 7 days, starting tomorrow:
                    const newArr = res.data.daily.slice(1, 8);

                    console.log("\n"+newArr.length+"-Days weather forecast for", data.name + ", " + data.sys.country + " :");

                    newArr.forEach((day) => {
                        const date = new Date(day.dt * 1000);

                        const temperature = day.temp.day > 0 ?
                            ("Temperature: +" + Math.ceil(day.temp.day) + unitSign) :
                            ("Temperature: " + Math.ceil(day.temp.day) + unitSign);
                        console.log(date.toLocaleDateString(), temperature, "/", day.weather[0].main, ":", day.weather[0].description);
                    })
                })
        })
        .catch(() => {
            console.log("Error: check the name of your city and try again");
        })
}
getWeather()