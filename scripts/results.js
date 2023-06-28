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
		cloudy: { src: "../assets/lotties/windy.json" },
		partlyCloudy: { src: "../assets/lotties/partly-cloudy.json" },

		partlyShowers: { src: "../assets/lotties/partly-cloudy.json" },

		rain: { src: "../assets/lotties/rain.json" },

		dry: { src: "../assets/lotties/sunny1.json" },

		thunderstorm: { src: "../assets/lotties/thunder.json" },

		snow: { src: "../assets/lotties/snow.json" },

		windy: { src: "../assets/lotties/mist.json" },
	},
	night: {
		cloudy: { src: "../assets/lotties/cloudy-night.json" },

		dry: { src: "../assets/lotties/night.json" },

		rain: { src: "../assets/lotties/rainy-night.json" },

		thunderstorm: { src: "../assets/lotties/thunder.json" },

		snow: { src: "../assets/lotties/snow-night.json" },
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

const createLottiePlayer = (src) => {
	let lottiePlayer = document.getElementById("lottieCondition");
	lottiePlayer.src = src;
	lottiePlayer.background = "transparent";
	lottiePlayer.speed = "1";
	lottiePlayer.style.width = "300px";
	lottiePlayer.style.height = "300px";
	lottiePlayer.loop = true;
	lottiePlayer.controls = true;
	lottiePlayer.autoplay = true;

	return lottiePlayer;
};

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
			for (let [key, value] of Object.entries(lottieConditions.day)) {
				if (key === weatherConditionData[i].condition) {
					weatherConditionData[i].condition = value.src;
				}
			}
		} else {
			for (let [key, value] of Object.entries(lottieConditions.night)) {
				if (key === weatherConditionData[i].condition) {
					weatherConditionData[i].condition = value.src;
				}
			}
		}
	}
};

const createButtonLayout = (tempTimes) => {
	let toolbar = document.getElementById("toolbar");
	//  over timestamps conver and print as button
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

	//TODO: Get setattribute and the lotties to display inside the condition logic, and average tempt and clothing option below it.
	const lottieEl = document.querySelector("lottie-player");
	lottieEl.setAttribute("src", `${defaultHour.condition}`);
	console.log(lottieEl);

	// Update the weatherData object with the formatted condition
	let avgDiv = document.createElement("div");
	avgDiv.setAttribute("id", "avgTempDiv");
	let ulAvgWeatherData = document.createElement("ul");
	// avgTemperature.appendChild(ulAvgWeatherData);
	console.log(defaultHour.condition);
	console.log(document);
	const avgLi = document.createElement("li");
	avgLi.innerText = ` ${weatherData.temperature_max}°C / ${weatherData.temperature_min}°C `;
	ulAvgWeatherData.appendChild(listItem);
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

		if (key === "🌡️") {
			const intValue = parseInt(value);
			if (intValue <= 8) {
				const valueSpan = document.createElement("span");
				valueSpan.innerText = clothingPref.cold.join(", ");
				avgDiv.appendChild(valueSpan);
				console.log("cold", clothingPref.cold);
			} else if (intValue <= 18) {
				const valueSpan = document.createElement("span");
				valueSpan.innerText = clothingPref.normal.join(", ");
				avgDiv.appendChild(valueSpan);
				console.log(clothingPref.normal);
			} else if (intValue <= 40 && intValue > 18) {
				const valueSpan = document.createElement("span");
				valueSpan.innerText = clothingPref.hot.join(", ");
				avgDiv.appendChild(valueSpan);
				console.log(clothingPref.hot);
			}
		}
	});
	// if (
	// 	defaultHour.condition.("☀️") ||
	// 	defaultHour.condition.includes("⛅")
	// ) {
	// 	const valueSpan = document.createElement("span");
	// 	valueSpan.innerText = ", Sunnies and wear sunscreen!";
	// 	avgDiv.appendChild(valueSpan);
	// }
	// if (
	// 	defaultHour.condition === "🌧️" ||
	// 	defaultHour.condition === "🌦️" ||
	// 	defaultHour.condition === "⛈️" ||
	// 	defaultHour.condition === "🌧️🌙" ||
	// 	defaultHour.condition === "⛈️🌙"
	// ) {
	// 	const valueSpan = document.createElement("span");
	// 	valueSpan.innerText = ", bring an umbrella and a raincoat!";
	// 	avgDiv.appendChild(valueSpan);
	// }
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
