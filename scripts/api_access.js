import config from "../config.js";

const {
	var: {
		units,
		timesteps,
		baseTomorrowIOURL,
		baseFlexWeatherURL,
		apikey,
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

	fetch(flexWeatherAPI, options)
		.then((response) => response.json())
		.catch((err) => console.error(err));
	try {
		const response = await fetch(flexWeatherAPI);
		if (!response.ok) {
			throw new Error(`API request failed with status: ${response.status}`);
		}
		const data = await response.json();
		sessionStorage.setItem("data", JSON.stringify(data));
	} catch (error) {
		console.error("API request failed:", error);
	}
};

const btnOnClickEvent = () => {
	getPositionData();
	console.log("CLICKED", JSON.parse(sessionStorage.getItem("data")));
	setTimeout(() => {
		document.location.href = "../pages/result.html";
	}, 4000);
};

document
	.getElementById("get-weather-btn")
	.addEventListener("click", btnOnClickEvent);
