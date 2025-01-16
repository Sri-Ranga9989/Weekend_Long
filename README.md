# Capstone1

This project is a web application that provides weather information, holidays, and dad jokes. It uses Express.js for the server, EJS for templating, and Axios for making API requests.

## Project Structure

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd cp_githug
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```

2. Open your browser and navigate to `http://localhost:3000`.

## Development Notes

- Initially, the plan was to create a minimal viable product (MVP) with a minimal front end and a backend. However, it was decided to focus on the backend first.
- To avoid wasting API calls during development, covert pages were created to help develop APIs.
- When working with the Date object, note that the days are one day off for the weekend (Saturday and Sunday are offset by one day).
- After some development, it was found that updating a single part of the website caused other parts to auto-update. To achieve more granular updates, AJAX was suggested, which can also be achieved using Axios, EJS, and JavaScript.
- To reduce dependencies, tree shaking was considered to delete unused code. However, to keep things simple, the import modules syntax was used, and the file was named `index.mjs`. Due to cross-origin restrictions, the holidays API didn't work, but it can be tested on local systems.

## API Keys

This project uses the following API keys:
- OpenWeatherMap API key for weather information.
- Calendarific API key for holidays.
- icanhazdadjoke API for dad jokes.

Make sure to replace the placeholder API keys in [index.js](http://_vscodecontentref_/6) with your own keys.

## License

This project is licensed under the ISC License.