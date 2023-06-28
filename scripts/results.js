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
		partlyShowers: { src: "../assets/lotties/partly-shower.json" },
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

// get data
const getSessionResultData = () => {
	let weatherData = JSON.parse(sessionStorage.getItem("data"));
	controller(weatherData);
};

const createLottiePlayer = (src) => {
	let lottiePlayer = document.createElement("lottie-player");
	lottiePlayer.setAttribute("src", src);
	lottiePlayer.setAttribute("background", "transparent");
	lottiePlayer.setAttribute("speed", "1");
	lottiePlayer.style.width = "250px";
	lottiePlayer.style.height = "250px";
	lottiePlayer.setAttribute("loop", true);
	lottiePlayer.setAttribute("autoplay", true);
	return lottiePlayer;
};

// create layout
const createHeaderLayout = (weatherData) => {
	let title = document.getElementById("title");
	let date = document.getElementById("date");
	let currentDateTime = new Date(weatherData.hours[0].timestamp).toLocaleDateString(
		[],
		{
			...dateOptions,
		}
	);
	title.innerText = `${weatherData.location}`;
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
	const defaultHour = hourlyTemps[0];

	weatherDataDisplay.innerHTML = "";

	let lottieEl = createLottiePlayer(defaultHour.condition);
	weatherDataDisplay.appendChild(lottieEl);

	let mainTempContainer = document.createElement("div");
	mainTempContainer.setAttribute("class", "flexContainer");

	//Create temp numbers container
	let temperatureValuesContainer = document.createElement("div");
	let temperatureHeading = document.createElement("h2");
	temperatureHeading.innerText = ` ${defaultHour.temperature}°C`;
	temperatureValuesContainer.appendChild(temperatureHeading);

	//OtherValues Container
	let otherValues = document.createElement("div");
	let temperatureAvgs = document.createElement("p");
	let timestamp = document.createElement("p");
	let windSpeed = document.createElement("p");
	temperatureAvgs.innerText = ` ${weatherData.temperature_max}°C / ${weatherData.temperature_min}°C `;
	timestamp.innerText = defaultHour.timestamp;
	windSpeed.innerText = ` ${defaultHour.wind_speed} ${defaultHour.wind_speed_unit}`;

	otherValues.appendChild(timestamp);
	otherValues.appendChild(temperatureAvgs);
	otherValues.appendChild(windSpeed);
	mainTempContainer.appendChild(temperatureValuesContainer);
	mainTempContainer.appendChild(otherValues);

	weatherDataDisplay.appendChild(mainTempContainer);

	let clothingPrefsContainer = document.createElement("div");

	const subHead = document.createElement("h4");
	subHead.innerText = "Clothing Options:";
	clothingPrefsContainer.appendChild(subHead);
	clothingPrefsContainer.setAttribute("class", "clothingPrefsDiv");

	const valueSpan = document.createElement("span");

	if (defaultHour.temperature <= 8) {
		valueSpan.innerText = clothingPref.cold.join(", ");
		clothingPrefsContainer.appendChild(valueSpan);
		console.log("cold", clothingPref.cold);
	} else if (defaultHour.temperature <= 18) {
		valueSpan.innerText = clothingPref.normal.join(", ");
		clothingPrefsContainer.appendChild(valueSpan);
		console.log(clothingPref.normal);
	} else if (defaultHour.temperature <= 40 && defaultHour.temperature > 18) {
		valueSpan.innerText = clothingPref.hot.join(", ");
		clothingPrefsContainer.appendChild(valueSpan);
		console.log(clothingPref.hot);
	}

	if (
		defaultHour.condition.includes("../assets/lotties/sunny.json") ||
		defaultHour.condition.includes("../assets/lotties/partly-cloudy.json")
	) {
		const valueSpan = document.createElement("span");
		valueSpan.innerText = ", Sunnies and wear sunscreen!";
		clothingPrefsContainer.appendChild(valueSpan);
	}
	if (
		defaultHour.condition.includes("../assets/lotties/partly-shower.json") ||
		defaultHour.condition.includes("../assets/lotties/rain.json") ||
		defaultHour.condition.includes("../assets/lotties/thunder.json") ||
		defaultHour.condition.includes("../assets/lotties/rainy-night.json") ||
		defaultHour.condition.includes("../assets/lotties/thunder.json")
	) {
		const valueSpan = document.createElement("span");
		valueSpan.innerText = ", bring an umbrella and a raincoat!";
		clothingPrefsContainer.appendChild(valueSpan);
	}
	weatherDataDisplay.appendChild(clothingPrefsContainer);
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
