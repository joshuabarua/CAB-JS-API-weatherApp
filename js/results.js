const {
	var: {getRequestHeaders, unSplashURL, timeOptions, dateOptions, sunnyConditions, rainyConditions, lottieConditions},
} = config;

const {UNSPLASHACCESSKEY} = secrets;

const date = new Date();
const today = date.toISOString().substring(0, 10);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowString = tomorrow.toISOString().substring(0, 10);
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
		try {
			if (el.dt_txt.includes(today)) {
				return el;
			} else if (el.dt_txt.includes(tomorrowString)) {
				return el;
			}
		} catch (error) {
			console.error(`Error with finding correct date, - ${error}`);
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
	const {city, countryName} = cityData;
	let title = document.getElementById('title');
	let date = document.getElementById('date');
	let currentDateTime = new Date(weatherData[0].dt * 1000).toLocaleDateString([], {
		...dateOptions,
	});
	title.innerText = `${city}, ${countryName}`;
	date.innerText = `${currentDateTime}`;
};

const createCityImageLeftSidebar = async (cityData) => {
	const {city} = cityData;
	const unsplashImageRequest = `${unSplashURL}?client_id=${UNSPLASHACCESSKEY}&query=${city}&orientation=portrait&count=1&content_filter=low`;
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
	console.log(weather);
	if (weather[0].description.includes('rain')) {
		return lottieCondition.rain.src;
	} else if (weather[0].description.includes('clear')) {
		return lottieCondition.clear.src;
	} else if (weather[0].description.trim() === 'clouds') {
		return lottieCondition.clouds.src;
	} else if (['some clouds', 'partly clouds', 'scattered clouds', 'few clouds'].some(condition => weather[0].description.includes(condition))) {
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
			clothingItem = clothingItem.replace(/\s/g, '');
			if (clothingImages.hasOwnProperty(clothingItem)) {
				return clothingImages[clothingItem];
			} else {
				console.warn('Error, clothing images do not have property of clothingItem >>:', clothingItem);
			}
			console.log('clothing items', clothingItem);
			return clothingItem;
		});
	}

	sessionStorage.setItem('modifiedClothingPreferences', JSON.stringify(modifiedClothingPrefs));
};

const createButtonLayout = (tempTimes) => {
	let timeContainer = document.getElementById('timeContainer');
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

//Clothing Prefs
const createClothingPrefSection = (defaultHour, clothingPref) => {
	const clothingPrefsContainer = document.createElement('div');
	clothingPrefsContainer.className = 'clothingPrefsDiv';

	const subHead = document.createElement('h4');
	subHead.style.margin = 0;
	subHead.innerText = 'Clothing Options';
	clothingPrefsContainer.appendChild(subHead);

	if (defaultHour.main.feels_like < 14) {
		const coldClothingDiv = document.createElement('div');
		coldClothingDiv.classList.add('clothing-section');
		coldClothingDiv.innerHTML = clothingPref.cold.map((item) => `<img src="${item}" alt="Cold clothing" loading="lazy" class="clothing-icon" />`).join('');
		clothingPrefsContainer.appendChild(coldClothingDiv);
	}

	if (defaultHour.main.feels_like >= 14 && defaultHour.main.feels_like <= 21) {
		const normalClothingDiv = document.createElement('div');
		normalClothingDiv.classList.add('clothing-section');
		normalClothingDiv.innerHTML = clothingPref.normal.map((item) => `<img src="${item}" alt="Normal clothing" loading="lazy" class="clothing-icon" />`).join('');
		clothingPrefsContainer.appendChild(normalClothingDiv);
	}

	if (defaultHour.main.feels_like > 21) {
		const hotClothingDiv = document.createElement('div');
		hotClothingDiv.classList.add('clothing-section');
		hotClothingDiv.innerHTML = clothingPref.hot.map((item) => `<img src="${item}" alt="Hot clothing" loading="lazy" class="clothing-icon" />`).join('');
		clothingPrefsContainer.appendChild(hotClothingDiv);
	}

	if (defaultHour.wind.speed > 12) {
		const windWarning = `<p>Consider wearing a <img src="${clothingPref.cold[0]}" alt="Windbreaker" class="clothing-icon" /> due to high winds!</p>`;
		clothingPrefsContainer.innerHTML += windWarning;
	}

	return clothingPrefsContainer;
};

const createWarningSection = (defaultHour) => {
	const warningContainer = document.createElement('div');
	warningContainer.className = 'warningContainer';

	if (defaultHour.main.feels_like < 1) {
		const warningMessage = `
      <div class="warning">
        <img src="/assets/clothing-icons/warning.png" alt="Warning" width="60px" loading="lazy" />  
        <p>Beware of ice on roads. Bring a jacket to stay warm!</p>
        <div>
          <img src="/assets/clothing-icons/icicle.png" alt="Icicle" width="60px" loading="lazy" />  
          <img src="/assets/clothing-icons/Jacket.png" alt="Jacket" class="clothing-icon" />
        </div>
      </div>
    `;
		warningContainer.innerHTML = warningMessage;
	}

	if (defaultHour.weather[0].description.includes('sunny')) {
		const sunWarning = `
      <div class="warning">
        <p>Wear <img src="/assets/clothing-icons/Sunnies.png" alt="Sunnies" class="clothing-icon" /> and sunscreen!</p>
      </div>
    `;
		warningContainer.innerHTML += sunWarning;
	}

	return warningContainer;
};

// Main temp area
const mainTemperatureArea = (weatherData) => {
	const defaultHour = weatherData[0];
	const lottieAnimationSrc = getLottieAnimation(defaultHour);
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
	temperatureHeading.innerText = `Feels like: ${defaultHour.main.feels_like.toFixed(0)}°C`;
	temperatureValuesContainer.appendChild(temperatureHeading);

	const otherValues = document.createElement('div');
	const temperatureAvgsH = document.createElement('p');
	const temperatureAvgsL = document.createElement('p');

	const timestamp = document.createElement('p');
	const windSpeed = document.createElement('p');
	temperatureAvgsH.innerText = `Highest: ${defaultHour.main.temp_max.toFixed(0)}°C `;
	temperatureAvgsL.innerText = `Lowest: ${defaultHour.main.temp_min.toFixed(0)}°C `;

	timestamp.innerText = defaultHour.time;
	windSpeed.innerText = `Wind: ${Math.round(defaultHour.wind.speed)}-${Math.round(defaultHour.wind.gust)} km/h`;

	otherValues.appendChild(timestamp);
	otherValues.appendChild(temperatureAvgsH);
	otherValues.appendChild(temperatureAvgsL);
	otherValues.appendChild(windSpeed);
	mainTempContainer.appendChild(temperatureValuesContainer);
	mainTempContainer.appendChild(otherValues);

	weatherDataDisplay.appendChild(mainTempContainer);

	const clothingPrefs = JSON.parse(sessionStorage.getItem('modifiedClothingPreferences'));
	const clothingPrefsContainer = createClothingPrefSection(defaultHour, clothingPrefs);
	const warningContainer = createWarningSection(defaultHour);

	weatherDataDisplay.appendChild(clothingPrefsContainer);
	weatherDataDisplay.appendChild(warningContainer);
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
