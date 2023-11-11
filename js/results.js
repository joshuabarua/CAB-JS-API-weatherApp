const {
	var: {getRequestHeaders, unSplashURL, timeOptions, dateOptions, sunnyConditions, rainyConditions, lottieConditions},
} = config;

const {UNSPLASHACCESSKEY} = secrets;

const date = new Date();
const today = date.toISOString().substring(0, 10);
const timeNow = date.toISOString().substring(11, 16);
const timeList = [
	new Date(0, 0, 0, 0, 0).toLocaleTimeString(),
	new Date(0, 0, 0, 3, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 6, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 9, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 12, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 15, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 18, 0).toISOString().substring(11, 16),
	new Date(0, 0, 0, 21, 0).toISOString().substring(11, 16),
];
console.log(timeNow);
console.log(timeList);

//TODO: check to see if the lottie is correctly displaying weather values or not.

// 1: get data
const getSessionResultData = () => {
	// let weatherData = JSON.parse(sessionStorage.getItem("data"));
	let cityData = JSON.parse(sessionStorage.getItem('cityData'));
	let openWeatherData = JSON.parse(sessionStorage.getItem('openWeatherMapData'));
	const {list} = openWeatherData;
	console.log(openWeatherData);
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
	let title = document.getElementById('title');
	let date = document.getElementById('date');
	let currentDateTime = new Date(weatherData[0].dt * 1000).toLocaleDateString([], {
		...dateOptions,
	});
	title.innerText = `${cityData.locality}, ${cityData.city} - ${cityData.countryName}`;
	date.innerText = `${currentDateTime}`;
};

const createCityImageLeftSidebar = async (city) => {
	const unsplashImageRequest = `${unSplashURL}?client_id=${UNSPLASHACCESSKEY}&query=${city}&orientation=portrait&count=1&content_filter=high`;
	if (!sessionStorage.getItem('cityImageData')) {
		await fetch(unsplashImageRequest, getRequestHeaders)
			.then(async (response) => {
				const unSplashImageData = await response.json();
				sessionStorage.setItem('cityImageData', JSON.stringify(unSplashImageData));
			})
			.catch((err) => console.error(err));
	}
	const cityImageData = JSON.parse(sessionStorage.getItem('cityImageData'));
	const leftSideBar = document.getElementById('leftSideBar');
	const imageAttribution = document.createElement('span');
	imageAttribution.innerHTML = `<p> Photo by <a href="${cityImageData[0].user.links.html}?utm_source=WhetherAware&utm_medium=referral"> ${cityImageData[0].user.name}  </a>  &nbsp; on &nbsp;  
		<a href="https://unsplash.com/?utm_source=whetherAware&utm_medium=referral"> Unsplash </a> </p>`;
	leftSideBar.appendChild(imageAttribution);

	leftSideBar.addEventListener('mouseover', (e) => {
		imageAttribution.classList.add('show');
	});

	leftSideBar.addEventListener('mouseout', (e) => {
		imageAttribution.classList.remove('show');
	});

	leftSideBar.style.setProperty('background-image', `url(${cityImageData[0].urls.full})`);
	leftSideBar.style.setProperty('background-size', 'cover');
	leftSideBar.style.setProperty('background-position', 'center');
};

const modifyTimeFormat = (hourlyTimes) => {
	for (let i = 0; i < hourlyTimes.length; i++) {
		let timeStamp = hourlyTimes[i].dt_txt;
		const time_part = timeStamp.match(/\d{2}:\d{2}/)[0];
		console.log(timeStamp.substring(10, 16), time_part);
		hourlyTimes[i].time = time_part;
	}
};

//Sets weather to use day or night lotties
const modifyConditionsToImg = (weatherConditionData) => {
	//TODO:find all the description values and rename lottie conditions that match those values
	weatherConditionData.forEach((time) => {
		if (time.sys.pod === 'd') {
			time.lottieCondition = lottieConditions.day;
		} else {
			time.lottieCondition = lottieConditions.night;
		}
	});
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
				console.log('Error, clothing images do not have property of clothingItem >>:', clothingItem);
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
	// console.log('today', date.getHours() * 60 + date.getMinutes());
	// for (let i = 0; i < weatherData.length; i++) {
	// 	const element = weatherData[i];
	// 	console.log('mainTemp area for loop >>: ', element);
	// }

	//TODO: Fix lotties to display based on weather condition matching description text
	const defaultHour = weatherData[0];
	const clothingPref = JSON.parse(sessionStorage.getItem('modifiedClothingPreferences'));
	const weatherDataDisplay = document.getElementById('weatherDataDisplay');
	weatherDataDisplay.innerHTML = '';
	console.log('DEFAULTHOUR:', defaultHour.lottieCondition);
	const lottieEl = createLottiePlayer(defaultHour.lottieCondition.clouds.src);
	weatherDataDisplay.appendChild(lottieEl);

	const mainTempContainer = document.createElement('div');
	mainTempContainer.className = 'temperatureContainer';

	const temperatureValuesContainer = document.createElement('div');
	const temperatureHeading = document.createElement('h2');
	temperatureHeading.innerText = ` ${defaultHour.main.feels_like}°C`;
	temperatureValuesContainer.appendChild(temperatureHeading);

	const otherValues = document.createElement('div');
	const temperatureAvgs = document.createElement('p');
	const timestamp = document.createElement('p');
	const windSpeed = document.createElement('p');
	temperatureAvgs.innerText = ` ${defaultHour.main.temp_max}°C / ${defaultHour.main.temp_min}°C `;
	timestamp.innerText = defaultHour.time;
	windSpeed.innerText = ` ${defaultHour.wind.speed}-${defaultHour.wind.gust} km/h`;

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
	if (defaultHour.temperature <= 8) {
		valueImg.innerHTML = clothingPref.cold.join(' ');
		clothingPrefsContainer.appendChild(valueImg);
	} else if (defaultHour.temperature <= 20) {
		valueImg.innerHTML = clothingPref.normal.join(' ');
		clothingPrefsContainer.appendChild(valueImg);
	} else if (defaultHour.temperature <= 40 && defaultHour.temperature > 20) {
		valueImg.innerHTML = clothingPref.hot.join(' ');
		clothingPrefsContainer.appendChild(valueImg);
	}
	if (defaultHour.wind_speed > 15) {
		const valueImg = document.createElement('span');
		valueImg.innerHTML = `Think about using a <img src="../assets/clothing-icons/Jacket.png" alt="Windbreaker"> for the wind!`;
		valueImg.style.fontStyle = 'italic';
		clothingPrefsContainer.appendChild(valueImg);
	}
	if (sunnyConditions.includes(defaultHour.condition)) {
		const valueImg = document.createElement('span');
		valueImg.innerHTML = `Think about using some <img src="../assets/clothing-icons/Sunnies.png" alt="Sunnies"> and wear sunscreen!`;
		valueImg.style.fontStyle = 'italic';
		clothingPrefsContainer.appendChild(valueImg);
	}
	if (rainyConditions.includes(defaultHour.condition)) {
		const valueImg = document.createElement('span');
		valueImg.innerHTML = `Probably bring an <img src="../assets/clothing-icons/Umbrella.png" alt="Umbrella"> or a <img src="../assets/clothing-icons/Raincoat.png" alt="Raincoat">`;
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
	const {city} = cityData;
	// Checking:
	modifyClothingPrefsToImg(clothingPref);
	slideOutToggler();
	createHeaderLayout(weatherData, cityData);
	createCityImageLeftSidebar(city);
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
	console.log('filterData func runs>>:', weatherData, time, selectedTimestamp);
	const filteredData = weatherData.filter((el) => el.time === selectedTimestamp);
	mainTemperatureArea(filteredData);
};

getSessionResultData();
