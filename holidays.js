import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Function to get all weekends (Saturdays and Sundays) of a given year.
 * @param {number} year - The year for which to get the weekends.
 * @returns {Array} - An array containing two arrays: one with string representations of the weekends and one with Date objects.
 */
function newListWeekendDays(year) {
  const weekends = [];
  const stringWeekends = [];
  
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      // Check if the day is Sunday (0) or Saturday (6)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        stringWeekends.push(`${date.toLocaleDateString()}`);
        weekends.push(date);
      }
    }
  }
  
  return [stringWeekends, weekends];
}



/**
 * Function that combines consecutive dates.
 * @param {Array} sortTargetMonth - Array of date strings in the format 'DD/MM/YYYY'.
 * @returns {Array} - An array of arrays, each containing consecutive dates.
 */
export const combineDates = (sortTargetMonth) => {
  let daySortDates = [];
  
  // Extract the day part from each date string and convert it to an integer
  sortTargetMonth.forEach(element => {
    daySortDates.push(parseInt(element.split('/')[0]));
  });

  let batches = [];
  let currentBatch = [];

  // Iterate through the sorted dates and group consecutive dates together
  for (let i = 0; i < daySortDates.length; i++) {
    if (currentBatch.length === 0 || daySortDates[i] - 1 === currentBatch[currentBatch.length - 1]) {
      currentBatch.push(daySortDates[i]);
    } else {
      batches.push(currentBatch);
      currentBatch = [daySortDates[i]];
    }
  }

  // Add the last batch if it contains any dates
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
};

/**
 * Extract and combine holiday dates from API with dynamic defaults.
 * @param {Array} APIresponse - The response from the API containing holiday data.
 * @param {Function} defaultMonth - Function to get the default month (current month).
 * @param {Function} defaultYear - Function to get the default year (current year).
 * @returns {Array} - An array of holiday dates.
 */
export const getDatesFromAPI = (APIresponse, defaultMonth = () => `${new Date().getUTCMonth() + 1}`, defaultYear = () => `${new Date().getFullYear()}`) => {
  // Getting the public holidays from the API (data cleaning)
  let apiHolidays = APIresponse[0].response.holidays;
  let apiDates = [];
  let SunSat = newListWeekendDays(defaultYear());

  // The default month will be the current month; however, if the user likes to check another day, write logic for that, like giving the default argument
  // Converting the date to string for making no duplicate values
  let stringApiDates = [];
  let a = SunSat[0];

  apiHolidays.forEach(element => {
    apiDates.push(new Date(element.date.iso));
    // Data cleaning: the dates from the API are not in a compatible string format, so changing them to a workable format
    // This version uses the nullish coalescing operator (??) to check if element.date is null or undefined.
    // If it is, the string "Invalid Date" is used instead of trying to create a Date object that might throw an error.
    stringApiDates.push(`${new Date(element.date?.iso).toLocaleDateString() ?? 'Invalid Date'}`);
  });

 // Combine arrays, convert dates to ISO strings for unique comparison, and remove duplicates
 const combinedArray = new Set([...a, ...stringApiDates]);
 const combined = [...combinedArray];

 // Getting holidays of a specific month
 const targetMonth = combined.filter(element => {
   const [day, month, year] = element.split('/').map(Number);
   return (month == defaultMonth());
 });

 // Batching dates together
 let sortTargetMonth = targetMonth;

 // Sorting them together
 sortTargetMonth.sort((a, b) => {
   const dateA = new Date(a.split('/').reverse().join('-'));
   const dateB = new Date(b.split('/').reverse().join('-'));
   return dateA - dateB;
 });

 return sortTargetMonth;
};



