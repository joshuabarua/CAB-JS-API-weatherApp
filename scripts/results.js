const options = {
	hour12: false,
	hour: "2-digit",
	minute: "2-digit",
};

// get data
const getSessionResultData = () => {
	let weatherData = JSON.parse(sessionStorage.getItem("data"));
	controller(weatherData);
};

/*
TODO: make layout of page ready to display:
2: toolbar for filtering (buttons of hourly temps/filtering based on clothing preference and gender)
3: hourly temp filling view, on button select, switch/slide to next temperature
*/

// create layout
const createHeaderLayout = (weatherData) => {
	let title = document.getElementById("title");
	let date = document.getElementById("date");
	let currentDateTime = new Date(weatherData.hours[0].timestamp).toLocaleString(
		[],
		{
			...options,
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		}
	);
	title.innerText = `${weatherData.location} Weather`;
	date.innerText = `${currentDateTime}`;
};

const createButtonLayout = (weatherData) => {
	let toolbar = document.getElementById("toolbar");
	// loop over timestamps conver and print as button
	for (let i = 0; i < weatherData.hours.length; i++) {
		let localTimestamp = new Date(
			weatherData.hours[i].timestamp
		).toLocaleTimeString([], options);
		let hourlyBtn = document.createElement("button");
		hourlyBtn.classList.add("hourlyBtns");
		hourlyBtn.innerText = localTimestamp;
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
	const { hours } = weatherData;
	const currentWeather = Object.values(hours)[0];
	let weatherDataDisplay = document.getElementById("weatherDataDisplay");
	let ulCurrentWeatherData = document.createElement("ul");

	let counter = 0;
	for (const property in currentWeather) {
		// Create a list item element
		const li = document.createElement("li");
		// Create a text node with the property name and value
		const text = document.createTextNode(
			`${property}: ${currentWeather[property]}`
		);
		if (counter === 0) {
			let localTimestamp = new Date(currentWeather.timestamp).toLocaleTimeString(
				[],
				options
			);
			text.nodeValue = `${property}: ${localTimestamp}`;
			counter++;
		}
		// Append the text node to the list item
		li.appendChild(text);
		// Append the list item to the unordered list
		ulCurrentWeatherData.appendChild(li);
	}
	weatherDataDisplay.appendChild(ulCurrentWeatherData);
};

// make controller
const controller = (weatherData) => {
	mainTemperatureArea(weatherData);
	createButtonLayout(weatherData);
	createAvgWeatherLayout(weatherData);
	createHeaderLayout(weatherData);
	setEventListener(weatherData);
};

//set Event Listener on buttons
const setEventListener = (weatherData) => {
	let buttons = document.querySelectorAll(".hourlyBtns");

	buttons.forEach((button) => {
		button.addEventListener("click", (e) => {
			displayTemperatureData(weatherData);
		});
	});
};

//TODO: Get data replacing the value in the main area by resetting the data area and updating with relevant value that matches button text content value
// Display data represented by button  value
const displayTemperatureData = (weatherData) => {
	const selectedBtn = document.querySelector(".hourlyBtns");
	console.log(selectedBtn.textContent);
};

getSessionResultData();
