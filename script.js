function getWeatherInfo(city) {
    var APIKey = 'fd8f466eccd599a5426718b131296a81';
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response){
            console.log(response);

            var currentDate = moment().format('M/D/YYYY');
            $('#current-city-name').html('<h1>' + response.name + ' Weather Details for ' + currentDate +'</h1>');
            var forecastPic = response.weather[0].icon;
            $('#weather-img').attr('src', 'https://openweathermap.org/img/w/' + forecastPic + '.png');
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
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

                    for (let i = 0; i < 6; i++) {
                        var date = moment().add(i+1, 'days').format('M/D/YYYY');
                        var dailyForecastPic = response.daily[i].weather[0].icon;
                        var dailyMaxTemp = ((response.daily[i].temp.max - 273.15) * 1.80 + 32).toFixed(0);
                        var dailyMinTemp = ((response.daily[i].temp.min - 273.15) * 1.80 + 32).toFixed(0);
                        var dailyHumidity = response.daily[i].humidity;
                    };
            });
        });
    
    

};



getWeatherInfo('Portland');
