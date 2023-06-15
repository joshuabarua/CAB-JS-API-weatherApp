const displayResultData = () => {
	let weatherData = JSON.parse(sessionStorage.getItem("data"));
	const {
		temperature_max,
		temperature_min,
		temperature_unit,
		condition,
		location,
		hours,
	} = weatherData;

	console.log(hours);

	for (let i = 0; i < hours.length; i++) {
		const {
			timestamp,
			temperature,
			condition,
			wind_speed,
			wind_direction,
			wind_speed_unit,
		} = hours;
		const weatherElements = document.createElement("p");
		weatherElements.innerText = hours[i];
		const resultsDiv = document.getElementById("sessionDataDiv");
		resultsDiv.appendChild(weatherElements);
		console.log(hours[i]);
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

displayResultData();
