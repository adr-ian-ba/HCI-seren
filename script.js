document.addEventListener("DOMContentLoaded", function(){

    //nav
    const hamburger = document.querySelector('#open-nav');
    const closeIcon = document.querySelector('#close-nav');
    const itemWrapper = document.querySelector('.hidden');
    const overlay = document.querySelector('.middle');
    
    function toggleMenu() {
        if (itemWrapper.style.right === '0px') {
            itemWrapper.style.right = '-100%';
            overlay.style.display = 'none';
        } else {
            itemWrapper.style.right = '0';
            overlay.style.display = 'block';
        }
    }
    
    hamburger.addEventListener('click', toggleMenu);
    closeIcon.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);


    //toggle weekly
    const toggleForecast = document.getElementById('box-toggle-week-hour');
    const weeklyForecast = document.querySelector('.forecast-content-wrapper-week');
    const hourlyForecast = document.querySelector('.forecast-wrapper-hour');

    function updateForecastDisplay() {
        if (toggleForecast.checked) {
            weeklyForecast.style.display = 'flex';
            hourlyForecast.style.display = 'none';
        } else {
            weeklyForecast.style.display = 'none';
            hourlyForecast.style.display = 'block';
        }
    }

    toggleForecast.addEventListener('change', updateForecastDisplay);


    //weather logic
    updateForecastDisplay();

    function getCurrentPosition() {
        return new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          } else {
            reject(new Error("Geolocation is not supported by this browser."))
          }
        })
    }
      
    function showPositionLat(position) {
        return position.coords.latitude
    }
      
    function showPositionLon(position) {
        return position.coords.longitude
    }

    function fetchWeatherData(lat, lon) {
        const key = 'b2814d1737d86d29cc66676988cbd1a4'
        const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${key}`
        
        return fetch(apiUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json()
          })
    }

    function updateDOM(data) {
        document.getElementById('location-name').innerText = `${data.timezone}`
      
        document.getElementById('sunrise-time').innerText = new Date(data.current.sunrise * 1000).toLocaleTimeString()
        document.getElementById('sunset-time').innerText = new Date(data.current.sunset * 1000).toLocaleTimeString()
        document.getElementById('uv-index').innerText = data.current.uvi
        document.getElementById('wind-speed').innerText = `${data.current.wind_speed} m/s`
        document.getElementById('pressure').innerText = `${data.current.pressure} hPa`
        document.getElementById('humidity').innerText = `${data.current.humidity} %`
      
        const forecastWeekContainer = document.getElementById('forecast-week')
        forecastWeekContainer.innerHTML = ''
        data.daily.forEach(day => {
          const dayCard = document.createElement('div')
          dayCard.className = 'card'
          dayCard.innerHTML = `
            <h5>${new Date(day.dt * 1000).toLocaleDateString()}</h5>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
            <h5>${day.temp.day.toFixed(1)}°C</h5>
          `
          forecastWeekContainer.appendChild(dayCard);
        })
    
        const forecastHourAMContainer = document.getElementById('forecast-hour-am')
        const forecastHourPMContainer = document.getElementById('forecast-hour-pm')
        forecastHourAMContainer.innerHTML = ''
        forecastHourPMContainer.innerHTML = ''
      
        data.hourly.slice(0, 12).forEach(hour => {
          const hourCard = document.createElement('div')
          hourCard.className = 'card'
          hourCard.innerHTML = `
            <h5>${new Date(hour.dt * 1000).toLocaleTimeString()}</h5>
            <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="${hour.weather[0].description}">
            <h5>${hour.temp.toFixed(1)}°C</h5>
          `
          forecastHourAMContainer.appendChild(hourCard)
        })
      
        data.hourly.slice(12, 24).forEach(hour => {
          const hourCard = document.createElement('div')
          hourCard.className = 'card'
          hourCard.innerHTML = `
            <h5>${new Date(hour.dt * 1000).toLocaleTimeString()}</h5>
            <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="${hour.weather[0].description}">
            <h5>${hour.temp.toFixed(1)}°C</h5>
          `
          forecastHourPMContainer.appendChild(hourCard)
        })
      }
      
      let curPosition = {}
      
      getCurrentPosition()
        .then(position => {
          curPosition.lat = showPositionLat(position)
          curPosition.lon = showPositionLon(position)
          console.log(curPosition)
      
          return fetchWeatherData(curPosition.lat, curPosition.lon)
        })
        .then(apiResponse => {
          let weatherData = apiResponse
          console.log(weatherData)
      
          updateDOM(weatherData)
        })
        .catch(error => {
          console.error(error.message)
        })
    })