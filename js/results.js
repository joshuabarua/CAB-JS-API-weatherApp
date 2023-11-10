const {
	var: {getRequestHeaders, unSplashURL, timeOptions, dateOptions, sunnyConditions, rainyConditions, lottieConditions},
} = config;

const {UNSPLASHACCESSKEY} = secrets;

const date = new Date();
const today = date.toISOString().substring(0, 10);

//TODO: check to see if the lottie is correctly displaying weather values or not.

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
		hourlyTimes[i].dt = time_part;
	}
};

const modifyConditionsToImg = (weatherConditionData) => {
	//TODO: Make an else statement, find all the description values  and rename lottie conditions that match those values
	weatherConditionData.forEach((hour) => {
		console.log(hour);
		if (hour.sys.pod === 'd') {
			hour.weather[0].description = lottieConditions.day.src;
		}
	});
};

const modifyClothingPrefsToImg = (clothingPref) => {
	let modifiedClothingPrefs = {};
	for (const conditionType in clothingPref) {
		modifiedClothingPrefs[conditionType] = clothingPref[conditionType].map((clothingItem) => {
			clothingItem = clothingItem.replace(/[\s-]/g, '');
			if (clothingImages.hasOwnProperty(clothingItem)) {
				return `<img src="${clothingImages[clothingItem]}" alt="${clothingItem}">`;
			}
			return clothingItem;
		});
	}
	sessionStorage.setItem('modifiedClothingPreferences', JSON.stringify(modifiedClothingPrefs));
};

const createButtonLayout = (tempTimes) => {
	let timeContainer = document.getElementById('timeContainer');
	//  over timestamps conver and print as button
	for (let i = 0; i < tempTimes.length; i++) {
		let hourlyBtn = document.createElement('a');
		hourlyBtn.classList.add('hourlyBtn');
		hourlyBtn.classList.add('bouncy');
		hourlyBtn.style.animationDelay = `${0.07 * i}s`;
		const currentDate = new Date();
		const formattedDate = currentDate.toISOString().slice(0, 10);
		if (tempTimes[i].dt_txt.includes(formattedDate)) {
			hourlyBtn.innerText = tempTimes[i].dt;
			timeContainer.appendChild(hourlyBtn);
		}
	}
};

// Main temp area
const mainTemperatureArea = (weatherData, hourlyTemps) => {
	const clothingPref = JSON.parse(sessionStorage.getItem('modifiedClothingPreferences'));
	const weatherDataDisplay = document.getElementById('weatherDataDisplay');
	const defaultHour = weatherData[0];

	weatherDataDisplay.innerHTML = '';

	const lottieEl = createLottiePlayer(defaultHour.weather[0].main.toLowerCase());
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
	timestamp.innerText = defaultHour.dt;
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
	let hours = 'hours';

	modifyClothingPrefsToImg(clothingPref);
	slideOutToggler();
	createHeaderLayout(weatherData, cityData);
	createCityImageLeftSidebar(city);
	modifyTimeFormat(weatherData);
	modifyConditionsToImg(weatherData);
	mainTemperatureArea(weatherData, hours);
	createButtonLayout(weatherData);
	setEventListener(weatherData, hours);
};

//set Event Listener on button and change event
const setEventListener = (weatherData, hours) => {
	let buttons = document.querySelectorAll('.hourlyBtn');
	buttons.forEach((button) => {
		button.addEventListener('click', () => {
			const selectedBtn = button.textContent;
			filterData(weatherData, hours, selectedBtn);
			document.querySelector('#slideOut').classList.toggle('showSlideOut');
		});
	});
	const sunLogo = document.getElementById('sunLogo');
	sunLogo.addEventListener('click', () => (document.location.href = '../index.html'));
	sunLogo.style.cursor = 'pointer';
};

const filterData = (weatherData, hours, selectedTimestamp) => {
	const filteredData = hours.filter((hour) => hour.timestamp === selectedTimestamp);
	mainTemperatureArea(weatherData, filteredData);
};

getSessionResultData();
