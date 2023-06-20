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

	console.log(hours);

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
};
//TODO: Fix this function to get the relevant data for the now time frame.
const mainTemperatureArea = (weatherData) => {
	const { hours } = weatherData;
	let weatherDataDisplay = document.getElementById("weatherDataDisplay");
	let ulCurrentWeatherData = document.createElement("ul");
	for (const key in hours[0]) {
		// Create a list item element
		const li = document.createElement("li");
		console.log(hours[key]);
		// Create a text node with the property name and value
		const text = document.createTextNode(`${key}: ${hours[key]}`);

		// Append the text node to the list item
		li.appendChild(text);

		// Append the list item to the unordered list
		ulCurrentWeatherData.appendChild(li);
	}
	weatherDataDisplay.appendChild(ulCurrentWeatherData);
};

// make controller
const controller = (weatherData) => {
	mainTemperatureArea(weatherData);
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

//TODO: Get data replacing the value in the main area by resetting the data area and updating with relevant value that matches button text content value
// Display data represented by button  value
const displayTemperatureData = (weatherData) => {
	const selectedBtn = document.querySelector(".hourlyBtns");
	console.log(selectedBtn.textContent);
};

getSessionResultData();
