// Clothing preferences
const preferences = {
	cold: [],
	normal: [],
	hot: [],
};

const cold = ["Jacket", "Gloves", "Hoodie", "Beanie", "Thermals", "Jeans"];
const normal = ["T-Shirt", "Dress", "Jeans", "Shirt", "Cardigan", "Pullover"];
const hot = ["Shorts", "Tank Top", "T-Shirt", "Skirt", "Dress", "Hat/Cap"];

// Variable to be used/destructured for use in code
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

// 1: Get user position data

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

// 2: Make api request using user location

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

// 3: Create onClick  event that triggers the other functions
const triggerEvent = () => {
	getPositionData();
	setTimeout(() => {
		document.location.href = "../pages/result.html";
	}, 3000);
};

const createCheckboxes = (temperature, items) => {
	const formContainer = document.createElement("div");
	const heading = document.createElement("h4");
	heading.textContent = `${temperature}`;
	formContainer.appendChild(heading);

	items.forEach((item) => {
		const label = document.createElement("label");
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.name = temperature.toLowerCase();
		checkbox.value = item;
		label.appendChild(checkbox);
		label.appendChild(document.createTextNode(item));
		formContainer.appendChild(label);
	});
	return formContainer;
};

const buildModal = () => {
	const modalContent = document.getElementById("modal-content");
	const container = document.getElementById("checkbox-container");

	// Create checkboxes for each temperature array
	const coldCheckboxes = createCheckboxes("Cold", cold);
	const normalCheckboxes = createCheckboxes("Normal", normal);
	const hotCheckboxes = createCheckboxes("Hot", hot);
	container.appendChild(coldCheckboxes);
	container.appendChild(normalCheckboxes);
	container.appendChild(hotCheckboxes);

	modalContent.appendChild(container);
};

const modalOverlay = document.getElementById("modal-overlay");

const addEventListeners = () => {
	//Open preferences selection on icon cliclk
	document
		.getElementById("clothing-preferences-icon")
		.addEventListener("click", showModalWindow);

	//Get Weather data button
	document
		.getElementById("get-weather-btn")
		.addEventListener("click", triggerEvent);

	//Close button
	document
		.getElementById("close-modal")
		.addEventListener("click", () => modalOverlay.classList.remove("open"));

	const savedPreferences = sessionStorage.getItem("clothingPreferences");
	if (savedPreferences) {
		const preferences = JSON.parse(savedPreferences);

		// Iterate through each temperature bracket and set checkbox values
		for (const temperature in preferences) {
			preferences[temperature].forEach((item) => {
				const checkbox = document.querySelector(
					`input[name="${temperature}"][value="${item}"]`
				);
				if (checkbox) {
					checkbox.checked = true;
				}
			});
		}
	}

	// Save the preferences to sessionStorage when the save button is clicked
	document.getElementById("saveBtn").addEventListener("click", () => {
		// Iterate through each temperature bracket and extract selected values
		for (const temperature in preferences) {
			const checkboxes = document.querySelectorAll(
				`input[name="${temperature}"]:checked`
			);
			preferences[temperature] = Array.from(checkboxes).map(
				(checkbox) => checkbox.value
			);
		}

		// Store preferences in sessionStorage
		sessionStorage.setItem("clothingPreferences", JSON.stringify(preferences));

		// Close
		modalOverlay.classList.remove("open");
	});

	console.log(sessionStorage.getItem("clothingPreferences"));
};

const showModalWindow = () => {
	modalOverlay.classList.add("open");
};

const controller = () => {
	buildModal();
	addEventListeners();
	setTimeout(showModalWindow, 1500);
};

controller();
