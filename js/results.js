const {
	var: {getRequestHeaders, unSplashURL, timeOptions, dateOptions, sunnyConditions, rainyConditions, lottieConditions},
} = config;

const {UNSPLASHACCESSKEY} = secrets;

const date = new Date();
const today = date.toISOString().substring(0, 10);
const timeNow = date.toISOString().substring(11, 16);
const timeList = [
	new Date(0, 0, 0, 1, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 4, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 7, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 10, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 13, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 16, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 19, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 22, 0).toISOString().substring(11, 16),
];

// 1: get data
const getSessionResultData = () => {
	// let weatherData = JSON.parse(sessionStorage.getItem("data"));
	let cityData = JSON.parse(sessionStorage.getItem('cityData'));
	let openWeatherData = JSON.parse(sessionStorage.getItem('openWeatherMapData'));
	const {list} = openWeatherData;
	//filter out other dates other than today
	const weatherDataToday = list.filter((el) => {
		if (el.dt_txt.includes(today)) {
			return el;
		}
	});
	controller(weatherDataToday, cityData);
};

const createLottiePlayer = (src) => {
	let lottiePlayer = document.createElement('lottie-player');
	lottiePlayer.setAttribute('src', src);
	lottiePlayer.setAttribute('background', 'transparent');
	lottiePlayer.setAttribute('speed', '1');
	lottiePlayer.style.width = '250px';
	lottiePlayer.style.height = '250px';
	lottiePlayer.setAttribute('loop', true);
	lottiePlayer.setAttribute('autoplay', true);
	return lottiePlayer;
};

// create layout
const createHeaderLayout = (weatherData, cityData) => {
	const {city, countryName, localityInfo} = cityData;
	const {informative, administrative} = localityInfo;
	console.log(cityData);
	let title = document.getElementById('title');
	let date = document.getElementById('date');
	let currentDateTime = new Date(weatherData[0].dt * 1000).toLocaleDateString([], {
		...dateOptions,
	});
	title.innerText = `${informative[4] ? informative[4].name : informative[3] ? informative[3].name : administrative[2] ? administrative[2].name : city}, ${countryName}`;
	date.innerText = `${currentDateTime}`;

	console.log(informative[2].name, city);
};

const createCityImageLeftSidebar = async (cityData) => {
	const {city, localityInfo} = cityData;
	const {informative, administrative} = localityInfo;
	const unsplashImageRequest = `${unSplashURL}?client_id=${UNSPLASHACCESSKEY}&query=${
		informative[4] ? informative[4].name : informative[3] ? informative[3].name : administrative[2] ? administrative[2].name : city
	}
	}&orientation=portrait&count=1&content_filter=medium`;
	let unSplashImageData = [];
	const imageAttribution = document.createElement('span');
	await fetch(unsplashImageRequest, getRequestHeaders)
		.then(async (response) => {
			unSplashImageData = await response.json();
			imageAttribution.innerHTML = `<p><a href="${unSplashImageData[0].user.links.html}?utm_source=WhetherAware&utm_medium=referral"> ${unSplashImageData[0].user.name}  </a>  &nbsp;on&nbsp;  
				<a href="https://unsplash.com/?utm_source=whetherAware&utm_medium=referral"> Unsplash </a> </p>`;
		})
		.catch((err) => console.warn(`Couldn't find image for matching ${city}, defaulting to colour`, err));

	const leftSideBar = document.getElementById('leftSideBar');
	leftSideBar.appendChild(imageAttribution);

	leftSideBar.addEventListener('mouseover', (e) => {
		imageAttribution.classList.add('show');
	});

	leftSideBar.addEventListener('mouseout', (e) => {
		imageAttribution.classList.remove('show');
	});
	if (unSplashImageData[0]) leftSideBar.style.setProperty('background-image', `url(${unSplashImageData[0].urls.full})`);
	leftSideBar.style.setProperty('background-size', 'cover');
	leftSideBar.style.setProperty('background-position', 'center');
};

const modifyTimeFormat = (hourlyTimes) => {
	for (let i = 0; i < hourlyTimes.length; i++) {
		let timeStamp = hourlyTimes[i].dt_txt;
		const time_part = timeStamp.match(/\d{2}:\d{2}/)[0];
		hourlyTimes[i].time = time_part;
	}
};

//Sets weather to use day or night lotties
const modifyConditionsToImg = (weatherConditionData) => {
	weatherConditionData.forEach((weatherDataElement) => {
		if (weatherDataElement.sys.pod === 'd') {
			weatherDataElement.lottieCondition = lottieConditions.day;
		} else {
			weatherDataElement.lottieCondition = lottieConditions.night;
		}
	});
};

const getLottieAnimation = (weatherData) => {
	const {weather, lottieCondition} = weatherData;
	if (weather[0].description.includes('rain')) {
		return lottieCondition.rain.src;
	} else if (weather[0].description.includes('clear')) {
		return lottieCondition.clear.src;
	} else if (weather[0].description.includes('clouds')) {
		return lottieCondition.clouds.src;
	} else if (weather[0].description.includes('some clouds', 'partly clouds', 'scattered clouds')) {
		return lottieCondition.partlyCloudy.src;
	} else if (weather[0].description.includes('thunderstorm')) {
		return lottieCondition.thunderstorm.src;
	} else if (weather[0].description.includes('snow')) {
		return lottieCondition.snow.src;
	} else if (weather[0].description.includes('windy')) {
		return lottieCondition.mist.src;
	} else {
		console.warn('No weather match data available for lottie icon!');
	}
};

const modifyClothingPrefsToImg = (clothingPref) => {
	let modifiedClothingPrefs = {};
	for (const conditionType in clothingPref) {
		modifiedClothingPrefs[conditionType] = clothingPref[conditionType].map((clothingItem) => {
			//Takes away spaces or hyphens as object in config can't have
			clothingItem = clothingItem.replace(/[\s-]/g, '');
			if (clothingImages.hasOwnProperty(clothingItem)) {
				return `<img src="${clothingImages[clothingItem]}" alt="${clothingItem}">`;
			} else {
				console.warn('Error, clothing images do not have property of clothingItem >>:', clothingItem);
			}
			return clothingItem;
		});
	}
	sessionStorage.setItem('modifiedClothingPreferences', JSON.stringify(modifiedClothingPrefs));
};

const createButtonLayout = (tempTimes) => {
	let timeContainer = document.getElementById('timeContainer');
	//  loop over timestamps and print as buttons
	for (let i = 0; i < tempTimes.length; i++) {
		let hourlyBtn = document.createElement('a');
		hourlyBtn.classList.add('hourlyBtn');
		hourlyBtn.classList.add('bouncy');
		hourlyBtn.style.animationDelay = `${0.07 * i}s`;
		if (tempTimes[i].dt_txt.includes(today)) {
			hourlyBtn.innerText = tempTimes[i].time;
			timeContainer.appendChild(hourlyBtn);
		}
	}
};

// Main temp area
const mainTemperatureArea = (weatherData) => {
	//make main temp area select the current weather

	const defaultHour = weatherData[0]; //can be default or selected weather data form time picker
	const lottieAnimationSrc = getLottieAnimation(defaultHour);
	const clothingPref = JSON.parse(sessionStorage.getItem('modifiedClothingPreferences'));
	const weatherDataDisplay = document.getElementById('weatherDataDisplay');
	weatherDataDisplay.innerHTML = '';

	if (lottieAnimationSrc) {
		const lottieEl = createLottiePlayer(lottieAnimationSrc);
		weatherDataDisplay.appendChild(lottieEl);
	} else {
		console.warn('Error: could not attach animation src to lottie player');
	}

	const mainTempContainer = document.createElement('div');
	mainTempContainer.className = 'temperatureContainer';

	const temperatureValuesContainer = document.createElement('div');
	const temperatureHeading = document.createElement('h2');
	temperatureHeading.innerText = `Feels like: ${defaultHour.main.feels_like}°C`;
	temperatureValuesContainer.appendChild(temperatureHeading);

	const otherValues = document.createElement('div');
	const temperatureAvgs = document.createElement('p');
	const timestamp = document.createElement('p');
	const windSpeed = document.createElement('p');
	temperatureAvgs.innerText = `Highest: ${defaultHour.main.temp_max}°C / Lowest: ${defaultHour.main.temp_min}°C `;
	timestamp.innerText = defaultHour.time;
	windSpeed.innerText = `Wind: ${defaultHour.wind.speed}-${defaultHour.wind.gust} km/h`;

	otherValues.appendChild(timestamp);
	otherValues.appendChild(temperatureAvgs);
	otherValues.appendChild(windSpeed);
	mainTempContainer.appendChild(temperatureValuesContainer);
	mainTempContainer.appendChild(otherValues);

	weatherDataDisplay.appendChild(mainTempContainer);
	const clothingPrefsContainer = document.createElement('div');
	clothingPrefsContainer.className = 'clothingPrefsDiv';
	const subHead = document.createElement('h4');
	subHead.style.margin = 0;
	subHead.innerText = 'Clothing Options';
	clothingPrefsContainer.appendChild(subHead);

	const valueImg = document.createElement('span');
	if (defaultHour.main.feels_like <= 8) {
		valueImg.innerHTML = clothingPref.cold.join(' ');
		clothingPrefsContainer.appendChild(valueImg);
	}
	if (defaultHour.main.feels_like <= 17) {
		valueImg.innerHTML = clothingPref.normal.join(' ');
		clothingPrefsContainer.appendChild(valueImg);
	}
	if (defaultHour.main.feels_like <= 40 && defaultHour.feels_like > 17) {
		valueImg.innerHTML = clothingPref.hot.join(' ');
		clothingPrefsContainer.appendChild(valueImg);
	}
	if (defaultHour.wind.speed > 12) {
		const valueImg = document.createElement('span');
		valueImg.innerHTML = `Think about using a <img src="/assets/clothing-icons/Jacket.png" alt="Windbreaker" /> for the wind!`;
		valueImg.style.fontStyle = 'italic';
		clothingPrefsContainer.appendChild(valueImg);
	}
	if (defaultHour.weather[0].description.includes('sunny', 'hot', 'sunshine')) {
		const valueImg = document.createElement('span');
		valueImg.innerHTML = `Think about using some <img src="/assets/clothing-icons/Sunnies.png" alt="Sunnies" /> and wear sunscreen!`;
		valueImg.style.fontStyle = 'italic';
		clothingPrefsContainer.appendChild(valueImg);
	}
	if (defaultHour.weather[0].description.includes('rain', 'storm', 'thunderstorm', 'snow', 'showers')) {
		const valueImg = document.createElement('span');
		valueImg.innerHTML = `Probably bring an <img src="/assets/clothing-icons/Umbrella.png" alt="Umbrella" /> or a <img src="/assets/clothing-icons/Raincoat.png" alt="Raincoat" />`;
		valueImg.style.fontStyle = 'italic';
		clothingPrefsContainer.appendChild(valueImg);
	}
	weatherDataDisplay.appendChild(clothingPrefsContainer);
};

const slideOutToggler = () => {
	const slideOut = document.querySelector('#slideOut');
	const slideOutTab = document.querySelector('.slideOutTab');

	slideOutTab.addEventListener('click', () => {
		slideOut.classList.toggle('showSlideOut');
	});
};

// 2: call controller

const controller = (weatherData, cityData) => {
	let clothingPref = JSON.parse(sessionStorage.getItem('clothingPreferences'));
	// Checking:
	modifyClothingPrefsToImg(clothingPref);
	slideOutToggler();
	createHeaderLayout(weatherData, cityData);
	createCityImageLeftSidebar(cityData);
	modifyTimeFormat(weatherData);
	modifyConditionsToImg(weatherData);
	createButtonLayout(weatherData);

	let time = weatherData[0].time;
	// Need Checking
	mainTemperatureArea(weatherData, time);
	//Done
	setEventListeners(weatherData, time);
};

//set Event Listener on button and change event
const setEventListeners = (weatherData, time) => {
	let buttons = document.querySelectorAll('.hourlyBtn');
	buttons.forEach((button) => {
		button.addEventListener('click', () => {
			const selectedBtn = button.textContent;
			filterData(weatherData, time, selectedBtn);
			document.querySelector('#slideOut').classList.toggle('showSlideOut');
		});
	});
	const sunLogo = document.getElementById('sunLogo');
	sunLogo.addEventListener('click', () => (document.location.href = '../index.html'));
	sunLogo.style.cursor = 'pointer';
};

const filterData = (weatherData, time, selectedTimestamp) => {
	const filteredData = weatherData.filter((el) => el.time === selectedTimestamp);
	mainTemperatureArea(filteredData);
};

getSessionResultData();
