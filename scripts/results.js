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

const lottieConditions = {
	day: {
		cloudy: "../assets/lotties/windy.json",
		partlyCloudy: "../assets/lotties/partly-cloudy.json",
		partlyShowers: "../assets/lotties/partly-showers.json",
		rain: "../assets/lotties/rain.json",
		dry: "../assets/lotties/sunny1.json",
		thunderstorm: "../assets/lotties/thunder.json",
		snow: "../assets/lotties/snow.json",
		windy: "../assets/lotties/mist.json",
	},
	night: {
		cloudy: "../assets/lotties/cloudy-night.json",
		dry: "../assets/lotties/night.json",
		rain: "../assets/lotties/rainy-night.json",
		snow: "../assets/lotties/snow-night.json",
	},
};

const emojiConditions = {
	day: {
		cloudy: "☁️",
		partlyCloudy: "⛅",
		partlyShowers: "🌦️",
		rain: "🌧️",
		dry: "☀️",
		thunderstorm: "⛈️",
		snow: "❄️",
		windy: "💨",
	},
	night: {
		cloudy: "☁️🌙",
		dry: "🌙",
		rain: " 🌧️🌙",
		snow: " ❄️🌙",
	},
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

const modifyConditionsToImg = (weatherConditionData) => {
	for (let i = 0; i < weatherConditionData.length; i++) {
		if (
			weatherConditionData[i].timestamp <= "18:00" &&
			weatherConditionData[i].timestamp >= "05:00"
		) {
			for (let [key, value] of Object.entries(emojiConditions.day)) {
				if (key === weatherConditionData[i].condition) {
					weatherConditionData[i].condition = value;
				}
			}
		} else {
			for (let [key, value] of Object.entries(emojiConditions.night)) {
				if (key === weatherConditionData[i].condition) {
					weatherConditionData[i].condition = value;
				}
			}
		}
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

	// Update the weatherData object with the formatted condition
	let ulAvgWeatherData = document.createElement("ul");

	const textContents = [
		`Max: ${weatherData.temperature_max}°C `,
		`Min: ${weatherData.temperature_min}°C`,
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
		{ key: "🕰️", value: ` ${defaultHour.timestamp}` },
		{ key: "🌡️", value: ` ${defaultHour.temperature}°C` },
		{
			key: "🌬️",
			value: ` ${defaultHour.wind_speed} ${defaultHour.wind_speed_unit}`,
		},
	];

	dataElements.forEach(({ key, value }) => {
		const listItem = document.createElement("li");
		const keySpan = document.createElement("span");
		keySpan.classList.add("emojis");

		keySpan.innerText = key;
		const valueSpan = document.createElement("span");
		valueSpan.classList.add("mainTempAreaVals");
		valueSpan.innerText = value;
		listItem.appendChild(keySpan);
		listItem.appendChild(valueSpan);
		ulCurrentWeatherData.appendChild(listItem);
	});

	const liItem = document.createElement("span");
	liItem.innerText = defaultHour.condition;
	liItem.classList.add("emojis");

	weatherDataDisplay.appendChild(ulCurrentWeatherData);
	weatherDataDisplay.appendChild(liItem);
};

// make controller
const controller = (weatherData) => {
	const { hours } = weatherData;
	createHeaderLayout(weatherData);
	modifyTimeFormat(hours);
	modifyConditionsToImg(hours);
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
