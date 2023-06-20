const options = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
	hour12: false,
	hour: "2-digit",
	minute: "2-digit",
};

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

	let title = document.getElementById("title");
	let date = document.getElementById("date");
	let avgTemp = document.getElementById("avgTemp");
	let toolbar = document.getElementById("toolbar");
	let currentDateTime = new Date(hours[0].timestamp).toLocaleString([], options);
	title.innerText = `${weatherData.location} Weather`;
	date.innerText = `${currentDateTime}`;

	for (let i = 0; i < hours.length; i++) {
		let localTimestamp = new Date(hours[i].timestamp).toLocaleTimeString([], {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
		});

		let hourlyBtn = document.createElement("button");
		hourlyBtn.classList.add("hourlyBtns");
		hourlyBtn.innerText = localTimestamp;
		toolbar.appendChild(hourlyBtn);
	}

	// Split the condition string by commas
	let conditionsArray = weatherData.condition.split(",");

	// Capitalize the first letter of each word and add a space
	let formattedCondition = conditionsArray
		.map((condition) => {
			return condition.charAt(0).toUpperCase() + condition.slice(1);
		})
		.join(", ");

	// Update the weatherData object with the formatted condition
	weatherData.condition = formattedCondition;
	avgTemp.innerHTML = `
	<ul>
	
	<li>
	Max: ${weatherData.temperature_max}°C 
	</li>
	<li>
	Min: ${weatherData.temperature_min}°C	</li>
	<li>
		${weatherData.condition}
	</li>
	</ul>
`;

	console.log(hours);
};

// make controller
const controller = (weatherData) => {
	createBaseToolbarLayout(weatherData);
	setEventListener(weatherData);
};

//set Event Listener on buttons
const setEventListener = (weatherData) => {
	let buttons = document.querySelectorAll(".hourlyBtns");

	buttons.forEach((button) => {
		button.addEventListener("click", (e) => {
			displayTemperatureData(weatherData);
		});
	});
};

getSessionResultData();
