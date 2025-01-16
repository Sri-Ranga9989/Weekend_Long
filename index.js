import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import * as holidays from "./holidays.js";

const app = express();
const port = 3000;

//middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); // For handling form data
app.use(bodyParser.json()); // For handling JSON data sent from client side

// API keys (replace with your own keys)
const weatherKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Your OpenWeatherMap API key goes here
const holidayApiKey = "YOUR_CALENDARIFIC_API_KEY"; // Your Calendarific API key goes here


//api details
// // weather api
const lati = 17.4;
const long = 78.47; // got the values from the same open weather geocoder api
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&appid=${weatherkey}&units=metric`;
//holidy api
const date = new Date();
let newyear = String(date.getFullYear());//getting the current year
const holidayUrl = `https://calendarific.com/api/v2/holidays?api_key=K3rzCOhaz87OKnnnq9TphEh9IaK6qU3j&country=IN&year=${newyear}&type=national`;
let dic = {};//to store the data from the api

app.get("/", async (req, res) => {
  try {
    // Fetch weather data
    const Wresponse = await axios.get(weatherUrl);
    const Wresult = Wresponse.data;

    // Extracting values to display on the website
    let location = Wresult.name;
    let description = Wresult.weather[0].description;
    let temperature = Math.floor(Wresult.main.temp);
    let iconCode = Wresult.weather[0].icon;
    let iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    let wind = Wresult.wind.speed;
    let windInkm = Math.floor(wind * 3.6);
    let humidity = Math.round(Wresult.main.humidity);

    let Wdata = [
      iconUrl,
      temperature,
      location,
      description,
      windInkm,
      humidity,
    ];
    console.log(Wdata);

    // Fetch holiday data
    const response = await axios.get(holidayUrl);
    const result = response.data;
    dic = result;

    let noDays = Object.keys(result.response.holidays).length;
    let defaultMonth = new Date().getMonth() + 1;
    const data = {
      dates: holidays.getDatesFromAPI([result], defaultMonth, currentYear),
      days: holidays.combineDates(
        holidays.getDatesFromAPI([result], defaultMonth, currentYear)
      ),
    };

    let activity = "Not available right now!!!";

    // Fetch dad joke
    const joke = await axios.get("https://icanhazdadjoke.com/slack");
    let dadJoke = joke.data.attachments[0].fallback;
    if (joke.status === 429) {
      dadJoke = "Not available right now";
    }

    // Sending the data to the website
    res.render("index.ejs", {
      weather: Wdata,
      holidays: data,
      dayPlan: activity,
      joke: dadJoke,
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);
  }
});
// Holidays API
// For the custom month of the user
// Called when the user submits the date
// Updated dynamically
app.post("/submit-date", async (req, res) => {
  try {
    // Fetch holiday data
    const response = await axios.get(holidayUrl);
    const result = response.data;
    dic = result;

    let noDays = Object.keys(result.response.holidays).length;

    // Check if the date is valid
    if (req.body.date && !isNaN(new Date(req.body.date).getTime())) {
      let customMon = new Date(req.body.date).getMonth() + 1;
      let customYear = String(new Date(req.body.date).getFullYear());

      const data = {
        dates: holidays.getDatesFromAPI([result], customMon, customYear),
        days: holidays.combineDates(holidays.getDatesFromAPI([result], customMon, customYear)),
      };

      // Send the data as JSON response
      res.json({ data });
    } else if (req.body.date) {
      console.log(req.body.date ? "Invalid Date" : "Date not provided");
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
  }
});

app.get("/back", (req, res) => {
  res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
