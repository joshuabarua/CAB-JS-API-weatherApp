// Variable to be used/destructured for use in code
const {
	var: {
		units,
		timesteps,
		baseTomorrowIOURL,
		baseFlexWeatherURL,
		baseOpenWeatherURL,
		tomorrowApikey,
		openWeatherMapApiKey,
		fields,
		startTime,
		endTime,
	},
} = config;

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

		makeApiRequest(latitude, longitude);
	} catch (error) {
		console.error(error);
	}
};

// 2: Make api request using user location

const makeApiRequest = async (lat, long) => {
	const userLocation = `${lat},${long}`;
	const options = { method: "GET", headers: { accept: "application/json" } };
	const flexWeatherAPI = `${baseFlexWeatherURL}/today?lat=${lat}&lon=${long}&units=${units}`;

	// const tomorrowIOUrl = `${baseTomorrowIOURL}/weather/realtime?location=${userLocation}&units=${units}&timesteps=${timesteps}&startTime=${startTime}&endTime=${endTime}&apikey=${apikey}`;

	// const openWeatherMapApi = `${baseOpenWeatherURL}weather?lat=${lat}&lon=${long}&appid=${openWeatherMapApiKey}`;

	await fetch(flexWeatherAPI, options)
		.then(async (response) => {
			const weatherData = await response.json();
			sessionStorage.setItem("data", JSON.stringify(weatherData));
			console.log(weatherData);
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
