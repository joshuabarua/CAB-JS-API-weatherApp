const config = require("../config");

const {
	var: { units, timesteps, baseUrl, apikey },
} = config;

const request = new XMLHttpRequest();

// Create a request variable and assign a new XMLHttpRequest object to it.
const getCurrentPosition = () => {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
};

const getPositionData = async () => {
	try {
		const position = await getCurrentPosition();
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;
		const userLocation = `${latitude},${longitude}`;

		makeApiRequest(userLocation);
	} catch (error) {
		console.error(error);
	}
};

const makeApiRequest = async (userLocation) => {
	const apiUrl = `${baseUrl}/weather/forecast?location=${userLocation}&units=${units}&timesteps=${timesteps}&apikey=${apikey}`;
	try {
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error(`API request failed with status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("API request failed:", error);
	}
};

const processApiData = (data) => {
	// Process the received data as needed
	console.log(data);

	// Further processing or logic using the API response data
	// Example: Accessing specific data properties
	const temperature = data.data.timelines[0].intervals[0].values.temperature;
	console.log("Temperature:", temperature);
};

getPositionData();
