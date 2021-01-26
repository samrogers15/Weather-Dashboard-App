// Calling the render local storage function to display previous searches stored in local storage.
renderLocalStorage();

// Calling the load page weather function to display the weather info for the most recent searched city (if there is any)
loadPageWeather();

// This function houses the ajax calls to the open weather API to retrieve all of the weather information and appends all of that weather information to the html page in the correct areas.
function getWeatherInfo(city) {

    console.log('Load Page Weather function is working', city);

    $('.forecast-container').show();

    $('#previous-city-list').show();
    
    $('#future-weather2').empty();

    var APIKey = 'fd8f466eccd599a5426718b131296a81';

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response){
        console.log(response);

        var currentDate = moment().format('M/D/YYYY'); 
        var forecastPic = response.weather[0].icon;
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;

        $('#current-city-name').empty();
        $('#weather-img').empty();
        $('#temp').empty();
        $('#humidity').empty();
        $('#speed').empty();

        $('#current-city-name').html('<h1>' + response.name + ' Weather Details for ' + currentDate +'</h1>');
        $('#weather-img').attr('src', 'https://openweathermap.org/img/w/' + forecastPic + '.png');
        $('#temp').text('Temperature: ' + tempF.toFixed(0) + '\u00B0 Fahrenheit');
        $('#humidity').text('Humidity: ' + response.main.humidity + '%');
        $('#speed').text('Wind Speed ' + response.wind.speed + ' mph');
        
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        var UVIndexQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=" + APIKey;

        $.ajax({
            url: UVIndexQueryURL,
            method: "GET"
        })
        .then(function(response){
            console.log(response);

            var UVI = response.current.uvi;
            $('#uv-index').text('UV Index: ' + UVI);
            
            for (let i = 1; i < 6; i++) {
                const card = $('<div>').attr('class', 'card');
                const cardBody = $('<div>').attr('class', 'card-body');
                const date = $('<span>').attr('class', 'card-title').html(moment().add(i, 'days').format('M/D/YYYY') + '<br>');
                const dailyForecastPic = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + response.daily[i].weather[0].icon + '.png');
                const dailyMaxTemp = $('<div>').attr('class', 'card-text').html('High: ' + ((response.daily[i].temp.max - 273.15) * 1.80 + 32).toFixed(0) + '\u00B0 F');
                const dailyMinTemp = $('<div>').attr('class', 'card-text').html('Low: ' + ((response.daily[i].temp.min - 273.15) * 1.80 + 32).toFixed(0) + '\u00B0 F');
                const dailyHumidity = $('<div>').attr('class', 'card-text').html('Humidity: ' + response.daily[i].humidity);

                $('#future-weather2').append(card);
                card.append(cardBody);
                cardBody.append(date);
                cardBody.append(dailyForecastPic)
                cardBody.append(dailyMaxTemp);
                cardBody.append(dailyMinTemp);
                cardBody.append(dailyHumidity);
            };
        });
    });
};

// This function sets the local storage array and concatenates additional search terms into that array.
function setLocalStorage(name, data) {
    var oldSearch = localStorage.getItem(name);
    if (oldSearch === null) {
        oldSearch = [];
    } else {
        oldSearch = JSON.parse(oldSearch);
    }
    localStorage.setItem(name, JSON.stringify(oldSearch.concat(data)));    
};

// This function renders the previously searched terms from local storage onto the page and makes a button that enables the previously searched city to show weather information for it again.
function renderLocalStorage() {
    var storedSearches = JSON.parse(localStorage.getItem('previousSearches'));
    $('#searched-cities').empty()
    if (storedSearches === null) {
        return;
    } else {
        storedSearches.reverse().forEach((city) => {
            var searchList = $('<button>').attr('class', 'cityButton btn btn-outline-secondary').click(function() {getWeatherInfo(city)}).text(city);
            $('#searched-cities').append(searchList);
        })
    };
};

// This function clears the local storage for the 'previousSearches' key
function clearLocalStorage() {
    localStorage.removeItem('previousSearches');
};

// This function loads the weather information for the last searched city if there is a record of previously searched cities in the users local storage
function loadPageWeather() {
    var storedSearches = JSON.parse(localStorage.getItem('previousSearches'));
    if (storedSearches === null) {
        $('.forecast-container').hide();
        $('#previous-city-list').hide();
        return;
    } else {
        var storedSearchesReverse = storedSearches.reverse();
        var lastSearchedCity = storedSearchesReverse[0];
        getWeatherInfo(lastSearchedCity);
    }
};

// This onclick function calls the getWeatherInfo, setLocalStorage, and renderLocalStorage functions when the search button is clicked.
$('#search').on('click', function searchWeather(event){
    event.preventDefault();
    const citySearch = $('#search-input').val();
    if (citySearch === '') {
        alert('Please enter a search value');
    } else {
    getWeatherInfo(citySearch);
    setLocalStorage('previousSearches', citySearch);
    renderLocalStorage();
    };
});

// This onclick function calls the clearLocalStorage and renderLocalStorage functions when the clear search button is clicked.
$('#clear').on('click', function clearSearchItems(event){
    event.preventDefault();
    clearLocalStorage();
    renderLocalStorage();
});