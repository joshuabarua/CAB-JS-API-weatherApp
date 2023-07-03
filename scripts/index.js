
// Variable to be used/destructured for use in code
const {
	var: {
		units,
		timesteps,
		baseTomorrowIOURL,
		baseFlexWeatherURL,
		baseOpenWeatherURL,
		reverseGeocodeURL,
		tomorrowApikey,
		openWeatherMapApiKey,
		fields,
		startTime,
		endTime,
		getRequestHeaders,
	},
} = config;

//Default Variables

// 1: Get user position data

const getCurrentPosition = () => {
	return new Promise((resolve, reject) => {
		0;
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
};

const getPositionData = async () => {
	try {
		const position = await getCurrentPosition();
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;

		weatherApiRequest(latitude, longitude);
		cityNameFromGeoLocation(latitude, longitude);
	} catch (error) {
		console.error(error);
	}
};

const cityNameFromGeoLocation = async (lat, long) => {
	const userLocationRequest = `${reverseGeocodeURL}?latitude=${lat}&longitude=${long}&localityLanguage=en`;

	await fetch(userLocationRequest, getRequestHeaders)
		.then(async (response) => {
			const cityData = await response.json();
			sessionStorage.setItem("cityData", JSON.stringify(cityData));
		})
		.catch((err) => console.error(err));
};

// 2: Make api request using user location

const weatherApiRequest = async (lat, long) => {
	// const userLocation = `${lat},${long}`;
	// const tomorrowIOUrl = `${baseTomorrowIOURL}/weather/realtime?location=${userLocation}&units=${units}&timesteps=${timesteps}&startTime=${startTime}&endTime=${endTime}&apikey=${apikey}`;
	// const openWeatherMapApi = `${baseOpenWeatherURL}weather?lat=${lat}&lon=${long}&appid=${openWeatherMapApiKey}`;
	const flexWeatherAPI = `${baseFlexWeatherURL}/today?lat=${lat}&lon=${long}&units=${units}`;
	await fetch(flexWeatherAPI, getRequestHeaders)
		.then(async (response) => {
			const weatherData = await response.json();
			sessionStorage.setItem("data", JSON.stringify(weatherData));
		})
		.catch((err) => console.error(err));
};

// 3: Create onClick  event that triggers the other functions
const triggerEvent = () => {
	getPositionData();
	setTimeout(() => {
		document.location.href = "../pages/result.html";
	}, 3500);
};

document.getElementById("get-weather-btn").addEventListener("click", triggerEvent);

// const addEventListeners = () => {};
// //Get Weather data button

const controller = () => {
	setTimeout(showModalWindow, 1000);
};

controller();
