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

const sunnyConditions = [
	"../assets/lotties/sunny1.json",
	"../assets/lotties/partly-cloudy.json",
];
const rainyConditions = [
	"../assets/lotties/partly-shower.json",
	"../assets/lotties/rain.json",
	"../assets/lotties/thunder.json",
	"../assets/lotties/rainy-night.json",
	"../assets/lotties/windy.json",
];

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
//TODO: SETUP UNSPLASH API, to randomise picture in the left blue panel, check to see  if the lottie is correctly displaying weather values or not.

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
	title.innerText = `${weatherData.location.split("-")[0]}`;
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
	weatherConditionData.forEach((hour) => {
		const isDay = hour.timestamp >= "05:00" && hour.timestamp <= "20:00";
		const conditionSet = isDay ? lottieConditions.day : lottieConditions.night;
		if (conditionSet[hour.condition]) {
			hour.condition = conditionSet[hour.condition].src;
		}
	});
};

const modifyClothingPrefsToImg = (clothingPref) => {
	let modifiedClothingPrefs = {};
	for (const conditionType in clothingPref) {
		modifiedClothingPrefs[conditionType] = clothingPref[conditionType].map(
			(clothingItem) => {
				clothingItem = clothingItem.replace(/[\s-]/g, "");
				if (clothingImages.hasOwnProperty(clothingItem)) {
					return `<img src="${clothingImages[clothingItem]}" alt="${clothingItem}">`;
				}
				return clothingItem;
			}
		);
	}
	sessionStorage.setItem(
		"modifiedClothingPreferences",
		JSON.stringify(modifiedClothingPrefs)
	);
};

const createButtonLayout = (tempTimes) => {
	let timeContainer = document.getElementById("timeContainer");
	//  over timestamps conver and print as button
	for (let i = 0; i < tempTimes.length; i++) {
		let hourlyBtn = document.createElement("a");
		hourlyBtn.classList.add("hourlyBtn");
		hourlyBtn.classList.add("bouncy");
		hourlyBtn.style.animationDelay = `${0.07 * i}s`;
		hourlyBtn.innerText = tempTimes[i].timestamp;
		timeContainer.appendChild(hourlyBtn);
	}
};

// Main temp area
const mainTemperatureArea = (weatherData, hourlyTemps) => {
	const clothingPref = JSON.parse(
		sessionStorage.getItem("modifiedClothingPreferences")
	);
	const weatherDataDisplay = document.getElementById("weatherDataDisplay");
	const defaultHour = hourlyTemps[0];

	weatherDataDisplay.innerHTML = "";

	const lottieEl = createLottiePlayer(defaultHour.condition);
	weatherDataDisplay.appendChild(lottieEl);

	const mainTempContainer = document.createElement("div");
	mainTempContainer.className = "temperatureContainer";

	const temperatureValuesContainer = document.createElement("div");
	const temperatureHeading = document.createElement("h2");
	temperatureHeading.innerText = ` ${defaultHour.temperature}°C`;
	temperatureValuesContainer.appendChild(temperatureHeading);

	const otherValues = document.createElement("div");
	const temperatureAvgs = document.createElement("p");
	const timestamp = document.createElement("p");
	const windSpeed = document.createElement("p");
	temperatureAvgs.innerText = ` ${weatherData.temperature_max}°C / ${weatherData.temperature_min}°C `;
	timestamp.innerText = defaultHour.timestamp;
	windSpeed.innerText = ` ${defaultHour.wind_speed} ${defaultHour.wind_speed_unit}`;

	otherValues.appendChild(timestamp);
	otherValues.appendChild(temperatureAvgs);
	otherValues.appendChild(windSpeed);
	mainTempContainer.appendChild(temperatureValuesContainer);
	mainTempContainer.appendChild(otherValues);

	weatherDataDisplay.appendChild(mainTempContainer);

	const clothingPrefsContainer = document.createElement("div");
	clothingPrefsContainer.className = "clothingPrefsDiv";

	const subHead = document.createElement("h4");
	subHead.style.margin = 0;
	subHead.innerText = "Clothing Options:";
	clothingPrefsContainer.appendChild(subHead);

	const valueImg = document.createElement("span");

	if (defaultHour.temperature <= 8) {
		valueImg.innerHTML = clothingPref.cold.join(" ");
		clothingPrefsContainer.appendChild(valueImg);
	} else if (defaultHour.temperature <= 20) {
		valueImg.innerHTML = clothingPref.normal.join(" ");
		clothingPrefsContainer.appendChild(valueImg);
	} else if (defaultHour.temperature <= 40 && defaultHour.temperature > 20) {
		valueImg.innerHTML = clothingPref.hot.join(" ");
		clothingPrefsContainer.appendChild(valueImg);
	}

	if (defaultHour.wind_speed > 15) {
		const valueImg = document.createElement("span");
		valueImg.innerHTML = `Think about using a <img src="../assets/clothing-icons/Jacket.png" alt="Windbreaker"> for the wind!`;
		valueImg.style.fontStyle = "italic";
		clothingPrefsContainer.appendChild(valueImg);
	}

	if (sunnyConditions.includes(defaultHour.condition)) {
		const valueImg = document.createElement("span");
		valueImg.innerHTML = `Think about using some <img src="../assets/clothing-icons/Sunnies.png" alt="Sunnies"> and wear sunscreen!`;
		valueImg.style.fontStyle = "italic";
		clothingPrefsContainer.appendChild(valueImg);
	}

	if (rainyConditions.includes(defaultHour.condition)) {
		const valueImg = document.createElement("span");
		valueImg.innerHTML = `Probably bring an <img src="../assets/clothing-icons/Umbrella.png" alt="Umbrella"> or a <img src="../assets/clothing-icons/Raincoat.png" alt="Raincoat">`;
		valueImg.style.fontStyle = "italic";
		clothingPrefsContainer.appendChild(valueImg);
	}

	weatherDataDisplay.appendChild(clothingPrefsContainer);
};

const slideOutToggler = () => {
	const slideOut = document.querySelector("#slideOut");
	const slideOutTab = document.querySelector(".slideOutTab");

	slideOutTab.addEventListener("click", () => {
		slideOut.classList.toggle("showSlideOut");
	});
};

// make controller
const controller = (weatherData) => {
	let clothingPref = JSON.parse(sessionStorage.getItem("clothingPreferences"));
	const { hours } = weatherData;
	modifyClothingPrefsToImg(clothingPref);
	slideOutToggler();
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
			document.querySelector("#slideOut").classList.toggle("showSlideOut");
		});
	});
	const sunLogo = document.getElementById("sunLogo");
	sunLogo.addEventListener(
		"click",
		() => (document.location.href = "../pages/index.html")
	);
	sunLogo.style.cursor = "pointer";
};

const filterData = (weatherData, hours, selectedTimestamp) => {
	const filteredData = hours.filter((hour) => hour.timestamp === selectedTimestamp);
	mainTemperatureArea(weatherData, filteredData);
};

getSessionResultData();
