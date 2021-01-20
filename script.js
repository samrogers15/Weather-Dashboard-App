function getWeatherInfo(city) {

    // $('#forecast-container').hide();

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

const searchButton = $('#search');

searchButton.on('click', function(event){
    event.preventDefault();
    const citySearch = $('#search-input').val();
    getWeatherInfo(citySearch);
    // $('#forecast-container').show();
});

// why does it not work as running the getWeatherInfo as the click function? as in:

// searchButton.on('click', getWeatherInfo())

// where do I empty the cardbody???