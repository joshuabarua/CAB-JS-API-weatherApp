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
		thunderstorm: "⛈️🌙",
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

// Main temp area
const mainTemperatureArea = (weatherData, hourlyTemps) => {
	let clothingPref = JSON.parse(sessionStorage.getItem("clothingPreferences"));
	let weatherDataDisplay = document.getElementById("weatherDataDisplay");

	weatherDataDisplay.innerHTML = "";
	let ulHourlyWeatherData = document.createElement("ul");

	const defaultHour = hourlyTemps[0];

	const dataElements = [
		{ key: "🕰️", value: ` ${defaultHour.timestamp}` },
		{ key: "🌡️", value: ` ${defaultHour.temperature}°C` },
		{
			key: "🌬️",
			value: ` ${defaultHour.wind_speed} ${defaultHour.wind_speed_unit}`,
		},
	];

	// Update the weatherData object with the formatted condition
	let avgDiv = document.createElement("div");
	avgDiv.setAttribute("id", "avgTempDiv");
	let ulAvgWeatherData = document.createElement("ul");
	// avgTemperature.appendChild(ulAvgWeatherData);
	const liItem = document.createElement("li");
	liItem.innerText = defaultHour.condition;
	liItem.classList.add("emojis");
	const avgLi = document.createElement("li");
	avgLi.innerText = ` ${weatherData.temperature_max}°C / ${weatherData.temperature_min}°C `;
	ulAvgWeatherData.appendChild(liItem);
	ulAvgWeatherData.appendChild(avgLi);
	avgDiv.appendChild(ulAvgWeatherData);

	weatherDataDisplay.appendChild(ulHourlyWeatherData);
	weatherDataDisplay.appendChild(avgDiv);

	const subHead = document.createElement("h4");
	subHead.innerText = "Make sure to pack these items:";
	avgDiv.appendChild(subHead);

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
		ulHourlyWeatherData.appendChild(listItem);

		if (key === "🌡️" && parseInt(value) <= 8) {
			const valueSpan = document.createElement("span");
			valueSpan.innerText = clothingPref.cold.join(", ");

			avgDiv.appendChild(valueSpan);
			// valueSpan =
			// Check if cold preferences exist and display them
			console.log("cold", clothingPref.cold);
			// Use the cold preferences to determine appropriate actions
			// based on the temperature being below 8°C
		} else if (key === "🌡️" && parseInt(value) <= 18) {
			const valueSpan = document.createElement("span");
			valueSpan.innerText = clothingPref.normal.join(", ");
			avgDiv.appendChild(valueSpan);
			console.log(clothingPref.normal);
		} else if (key === "🌡️" && parseInt(value) <= 40 && parseInt(value) > 18) {
			const valueSpan = document.createElement("span");
			valueSpan.innerText = clothingPref.hot.join(", ");
			avgDiv.appendChild(valueSpan);
			console.log(clothingPref.hot);
		}
	});
};

// make controller
const controller = (weatherData) => {
	console.log(weatherData);
	const { hours } = weatherData;
	createHeaderLayout(weatherData);
	modifyTimeFormat(hours);
	modifyConditionsToImg(hours);
	mainTemperatureArea(weatherData, hours);
	createButtonLayout(hours);
	setEventListener(weatherData, hours);
};

//set Event Listener on button and change event
const setEventListener = (weatherData, hours) => {
	let buttons = document.querySelectorAll(".hourlyBtn");
	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			const selectedBtn = button.textContent;
			filterData(weatherData, hours, selectedBtn);
		});
	});
};

const filterData = (weatherData, hours, selectedTimestamp) => {
	const filteredData = hours.filter((hour) => hour.timestamp === selectedTimestamp);
	mainTemperatureArea(weatherData, filteredData);
};

getSessionResultData();
