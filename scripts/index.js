// Variable to be used/destructured for use in code
const {
	var: {
		units,
		timesteps,
		baseTomorrowIOURL,
		baseFlexWeatherURL,
		baseOpenWeatherURL,
		reverseGeocodeURL,
		fields,
		startTime,
		endTime,
		getRequestHeaders,
	},
} = config;

const {OPENWEATHERMAPAPIKEY} = secrets;

//Default Variables

// 1: Get user position data

const showError = (errorMessage) => {
	document.body.innerHTML = "";
	const errorContainer = document.body;
	errorContainer.style.display = "flex";
	errorContainer.style.justifyContent = "center";
	errorContainer.style.alignItems = "center";
	errorContainer.style.paddingTop = "50vh";
	errorContainer.innerText = errorMessage;
};

const getCurrentPosition = () => {
	return new Promise((resolve, reject) => {
		const options = {
			timeout: 3000,
			maximumAge: Infinity,
		};
		navigator.geolocation.getCurrentPosition(resolve, reject, options);
	});
};

const getPositionData = async () => {
	try {
		const position = await getCurrentPosition();
		console.log(position);
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;

		weatherApiRequest(latitude, longitude);
		cityNameFromGeoLocation(latitude, longitude);
	} catch (error) {
		console.error(error);
		const {code, message} = error;
		showError(
			`Code: ${code} - Access Denied: ${message}, could not complete request. Redirecting...  `
		);
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
	const openWeatherMapApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${OPENWEATHERMAPAPIKEY}&cnt=24`;
	// const flexWeatherAPI = `${baseFlexWeatherURL}/today?lat=${lat}&lon=${long}&units=${units}`;
	// await fetch(flexWeatherAPI, getRequestHeaders)
	// 	.then(async (response) => {
	// 		const weatherData = await response.json();
	// 		sessionStorage.setItem("data", JSON.stringify(weatherData));
	// 	})
	// 	.catch((err) => console.error(err));
	await fetch(openWeatherMapApi, getRequestHeaders)
		.then(async (response) => {
			const openWeatherMapData = await response.json();
			sessionStorage.setItem(
				"openWeatherMapData",
				JSON.stringify(openWeatherMapData)
			);
			setTimeout(() => {
				document.location.href = "../pages/result.html";
			}, 2000);
		})
		.catch((err) => console.error(err));
};

// 3: Create onClick  event that triggers the other functions
const triggerEvent = () => {
	getPositionData();
};

document.getElementById("get-weather-btn").addEventListener("click", triggerEvent);

// const addEventListeners = () => {};
// //Get Weather data button

const controller = () => {
	setTimeout(showModalWindow, 1000);
};

controller();
