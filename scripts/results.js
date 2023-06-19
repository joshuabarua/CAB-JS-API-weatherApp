// get data
const getSessionResultData = () => {
	let weatherData = JSON.parse(sessionStorage.getItem("data"));
};

/*
TODO: make layout of page ready to display:
1: avg daily temp
2: toolbar for filtering (buttons of hourly temps/filtering based on clothing preference and gender)
3: hourly temp filling view, on button select, switch/slide to next temperature
*/

// create layout
const createBaseLayout = (weatherData) => {
	const {
		temperature_max,
		temperature_min,
		temperature_unit,
		condition,
		location,
		hours,
	} = weatherData;

	let containerDiv = getElementById("weatherDataDisplay");

	console.log(weatherData);

	for (let i = 0; i < hours.length; i++) {
		let localTimestamp = new Date(hours[i].timestamp).toLocaleString();
		const weatherElements = document.createElement("p");
		weatherElements.innerText = Object.values(hours[i]);
		const resultsDiv = document.getElementById("weatherDataDisplay");
		resultsDiv.appendChild(weatherElements);
	}
	console.log(
		temperature_max,
		temperature_min,
		temperature_unit,
		condition,
		location,
		hours
	);
};

// make controller
const controller = () => {
	getSessionResultData();
	createBaseLayout();
};

controller();
