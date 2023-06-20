// get data
const getSessionResultData = () => {
	let weatherData = JSON.parse(sessionStorage.getItem("data"));
	controller(weatherData);
};

/*
TODO: make layout of page ready to display:
1: avg daily temp
2: toolbar for filtering (buttons of hourly temps/filtering based on clothing preference and gender)
3: hourly temp filling view, on button select, switch/slide to next temperature
*/

// create layout
const createBaseToolbarLayout = (weatherData) => {
	const { hours } = weatherData;

	let containerDiv = document.getElementById("weatherDataDisplay");
	let avgTemp = document.getElementById("avgTemp");
	let toolbar = document.getElementById("toolbar");

	for (let i = 0; i < hours.length; i++) {
		let localTimestamp = new Date(hours[i].timestamp).toLocaleTimeString([], {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
		});

		let hourlyBtns = document.createElement("button");
		hourlyBtns.innerText = localTimestamp;
		toolbar.appendChild(hourlyBtns);
	}

	// Split the condition string by commas
	let conditionsArray = weatherData.condition.split(",");

	// Capitalize the first letter of each word and add a space
	let formattedCondition = conditionsArray
		.map(function (condition) {
			return condition.charAt(0).toUpperCase() + condition.slice(1);
		})
		.join(", ");

	// Update the weatherData object with the formatted condition
	weatherData.condition = formattedCondition;

	avgTemp.innerHTML = `<h4>Daily Avg. </h4>
  	<p>Max: ${weatherData.temperature_max}°C</p>
  	<p>Min: ${weatherData.temperature_min}°C</p>
  	<p>${weatherData.condition}</p>
  	<p>${weatherData.location}</p>
`;

	console.log(hours);
};

// make controller
const controller = (weatherData) => {
	createBaseToolbarLayout(weatherData);
};

getSessionResultData();
