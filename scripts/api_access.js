import config from "../config.js";

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

const btnOnClickEvent = () => {
	getPositionData();
	setTimeout(() => {
		document.location.href = "../pages/result.html";
	}, 10000);
};

document
	.getElementById("get-weather-btn")
	.addEventListener("click", btnOnClickEvent);
