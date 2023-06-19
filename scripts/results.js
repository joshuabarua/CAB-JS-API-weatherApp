const manipulateResultData = () => {
	let weatherData = JSON.parse(sessionStorage.getItem("data"));
	const {
		temperature_max,
		temperature_min,
		temperature_unit,
		condition,
		location,
		hours,
	} = weatherData;

	console.log(weatherData);

	for (let i = 0; i < hours.length; i++) {
		let localTimestamp = new Date(hours[i].timestamp).toLocaleString();
		const weatherElements = document.createElement("p");
		weatherElements.innerText = Object.values(hours[i]);
		const resultsDiv = document.getElementById("sessionDataDiv");
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

manipulateResultData();
