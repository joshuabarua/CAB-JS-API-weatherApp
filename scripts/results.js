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

const modifyTimeFormat = (hourlyTemps) => {
	for (let i = 0; i < hourlyTemps.length; i++) {
		let localTimestamp = new Date(hourlyTemps[i].timestamp).toLocaleTimeString(
			[],
			timeOptions
		);
		hourlyTemps[i].timestamp = localTimestamp;
	}
};

const createButtonLayout = (tempTimes) => {
	let toolbar = document.getElementById("toolbar");
	// loop over timestamps conver and print as button
	for (let i = 0; i < tempTimes.length; i++) {
		let hourlyBtn = document.createElement("button");
		hourlyBtn.classList.add("hourlyBtn");
		hourlyBtn.innerText = tempTimes[i].timestamp;
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

// Main temp area
const mainTemperatureArea = (hourlyTemp) => {
	let weatherDataDisplay = document.getElementById("weatherDataDisplay");
	weatherDataDisplay.innerHTML = "";
	let ulCurrentWeatherData = document.createElement("ul");
	const defaultHour = hourlyTemp[0];

	const dataElements = [
		{ value: defaultHour.timestamp },
		{ value: `${defaultHour.temperature}°C` },
		{
			value: `${defaultHour.wind_speed} ${defaultHour.wind_speed_unit}`,
		},
		{ value: defaultHour.wind_direction },
		{
			value:
				defaultHour.condition.charAt(0).toUpperCase() +
				defaultHour.condition.slice(1),
		},
	];

	dataElements.forEach((element) => {
		const li = document.createElement("li");
		li.innerText = `${element.value}`;
		ulCurrentWeatherData.appendChild(li);
	});
	weatherDataDisplay.appendChild(ulCurrentWeatherData);
};

// make controller
const controller = (weatherData) => {
	const { hours } = weatherData;
	createHeaderLayout(weatherData);
	modifyTimeFormat(hours);
	mainTemperatureArea(hours);
	createButtonLayout(hours);
	createAvgWeatherLayout(weatherData);
	setEventListener(hours);
};

//set Event Listener on button and change event
const setEventListener = (weatherData) => {
	let buttons = document.querySelectorAll(".hourlyBtn");
	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			const selectedBtn = button.textContent;
			filterData(weatherData, selectedBtn);
		});
	});
};

const filterData = (hourlyTemps, selectedTimestamp) => {
	const filteredData = hourlyTemps.filter(
		(hour) => hour.timestamp === selectedTimestamp
	);
	mainTemperatureArea(filteredData);
};

getSessionResultData();
