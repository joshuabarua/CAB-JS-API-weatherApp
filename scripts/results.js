const timeOptions = {
	hour12: false,
	hour: "2-digit",
	minute: "2-digit",
};

const dateOptions = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
};

// get data
const getSessionResultData = () => {
	let weatherData = JSON.parse(sessionStorage.getItem("data"));
	controller(weatherData);
};

/*
TODO: make layout of page ready to display:
2: toolbar for filtering based on clothing preference and gender)
3: hourly temp filling view, on button select, switch/slide to next temperature
*/

// create layout
const createHeaderLayout = (weatherData) => {
	let title = document.getElementById("title");
	let date = document.getElementById("date");
	let currentDateTime = new Date(weatherData.hours[0].timestamp).toLocaleString(
		[],
		{
			...timeOptions,
			...dateOptions,
		}
	);
	title.innerText = `${weatherData.location} Weather`;
	date.innerText = `${currentDateTime}`;
};

const modifyTimeFormat = (weatherData) => {
	for (let i = 0; i < weatherData.hours.length; i++) {
		let localTimestamp = new Date(
			weatherData.hours[i].timestamp
		).toLocaleTimeString([], timeOptions);
		weatherData.hours[i].timestamp = localTimestamp;
	}
};

const createButtonLayout = (weatherData) => {
	let toolbar = document.getElementById("toolbar");
	// loop over timestamps conver and print as button
	for (let i = 0; i < weatherData.hours.length; i++) {
		let hourlyBtn = document.createElement("button");
		hourlyBtn.classList.add("hourlyBtn");
		hourlyBtn.innerText = weatherData.hours[i].timestamp;
		toolbar.appendChild(hourlyBtn);
	}
};

const createAvgWeatherLayout = (weatherData) => {
	let avgTemp = document.getElementById("avgTemp");
	// Split the condition string by commas
	let conditionsArray = weatherData.condition.split(",");

	// Capitalize the first letter of each word and add a space
	let formattedCondition = conditionsArray
		.map((condition) => {
			return condition.charAt(0).toUpperCase() + condition.slice(1);
		})
		.join(", ");

	// Update the weatherData object with the formatted condition
	weatherData.condition = formattedCondition;
	let ulAvgWeatherData = document.createElement("ul");

	const textContents = [
		`Max: ${weatherData.temperature_max}°C `,
		`Min: ${weatherData.temperature_min}°C`,
		weatherData.condition,
	];

	for (let i = 0; i < textContents.length; i++) {
		const li = document.createElement("li");
		li.innerText = textContents[i];
		ulAvgWeatherData.appendChild(li);
	}
	avgTemp.appendChild(ulAvgWeatherData);
};

const mainTemperatureArea = (weatherData) => {
	// const currentWeather = Object.values(weatherData.hours)[0];
	let weatherDataDisplay = document.getElementById("weatherDataDisplay");
	let ulCurrentWeatherData = document.createElement("ul");

	//TODO: MAKE A LI ITEM FOR EACH HOUR DATA POINT
	ulCurrentWeatherData.innerText = "";
	weatherData.hours.forEach((hour) => {
		const li = document.createElement("li");
		// Create a text node with the property name and value
		const text = document.createTextNode(`${hour}`);
		// Append the text node to the list item
		li.appendChild(text);
		// Append the list item to the unordered list
		ulCurrentWeatherData.appendChild(li);
	});

	for (const property in weatherData.hours) {
		// Create a list item element
		const li = document.createElement("li");
		// Create a text node with the property name and value
		const text = document.createTextNode(`${property}: ${weatherData[property]}`);
		// Append the text node to the list item
		li.appendChild(text);
		// Append the list item to the unordered list
		ulCurrentWeatherData.appendChild(li);
	}
	weatherDataDisplay.appendChild(ulCurrentWeatherData);
};

// make controller
const controller = (weatherData) => {
	createHeaderLayout(weatherData);
	modifyTimeFormat(weatherData);
	mainTemperatureArea(weatherData);
	createButtonLayout(weatherData);
	createAvgWeatherLayout(weatherData);
	setEventListener(weatherData);
};

//set Event Listener on button and change event
const setEventListener = (weatherData) => {
	let buttons = document.querySelectorAll(".hourlyBtn");
	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			const selectedBtn = button.textContent.trim();
			filterData(weatherData, selectedBtn);
		});
	});
};

const filterData = (weatherData, selectedTimestamp) => {
	const filteredData = weatherData.hours.filter(
		(hour) => hour.timestamp === selectedTimestamp
	);
	console.log(filteredData);
	mainTemperatureArea(filteredData);
};

//TODO: Get data replacing the value in the main area by resetting the data area and updating with relevant value that matches button text content value
// Display data represented by button  value

getSessionResultData();
