function getWeatherInfo(city) {
    var APIKey = 'fd8f466eccd599a5426718b131296a81';
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    
    

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function(response){
            console.log(response);

            $('#city').html('<h1>' + response.name + ' Weather Details</h1>');
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            $('#temp').text('Temperature: ' + tempF.toFixed(0) + '\u00B0 Fahrenheit');
            $('#humidity').text('Humidity: ' + response.main.humidity + '%');
            // $('#uv-index').text('UV Index: ' + )
        })
};

getWeatherInfo('Portland');

// const city = $('#search-input').val();
// $('#search').on('click', getWeatherInfo(city));