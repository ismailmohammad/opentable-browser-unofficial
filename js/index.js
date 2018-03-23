window.cities = {};
window.cityJSON = {};
window.restaurantsForCity = [];
var totalRestaurantsCity;
$(document).ready(function () {
           getCities();
          // Initialize Toasts
          $('.tooltipped').tooltip();
        });

function getCities() {
  // The API endpoint involved with retreiving the entire list of cities
  var endpoint = 'https://opentable.herokuapp.com/api/cities';
  var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": endpoint,
	  "method": "GET",
	  "headers": {
	    "Content-Type": "application/x-www-form-urlencoded"
	  }
	}
	$.ajax(settings).done(function (response) {
    window.cities = response;
    var city;
    for (var x in window.cities.cities) {
      city = String(window.cities.cities[x]);
      cityJSON[city] = null;
    }
	}).then( function() {
    $('input.autocomplete').autocomplete({
      data: cityJSON,
      limit: 20,
      minLength: 2
    });
  });
}

function getRestaurants(inputId){
  if ($(inputId).val() == "") {
    Materialize.toast('Please Enter a city', 1000);
    return false;
  } else if (!($(inputId).val() in cityJSON)) {
    Materialize.toast('City not found. Please try correcting the city name', 1000);
    return false;
  }
  // Clear Restaurants before Fetch
  window.restaurantsForCity = [];
  var endpoint = 'http://opentable.herokuapp.com/api/restaurants?city=' + $(inputId).val() + "&per_page=5";
  // Initialize the settings to be used for the JQuery AJAX http request
  var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": endpoint,
	  "method": "GET",
	  "headers": {
	    "Content-Type": "application/x-www-form-urlencoded"
	  }
  };
  // Initially get how many restaurants there are for that city, start with 5 responses since that's the minimum specified by the API
  $.ajax(settings).done(function (response) {
    if (response.total_entries > 0){
      // Save the number of entries while requesting the least amount of actual entries to increase performance
      totalRestaurantsCity = parseInt(response.total_entries);
    } else {
      // Let the user know that the city in question could not be found and break the procedure here by returning false
      Materialize.toast('Restaurants could not be found for the given city. Please try correcting the city name and try again');
      return false;
    }
  }).then(function() {
    // calculate how many pages/times to poll
    var callIterations = Math.ceil(totalRestaurantsCity/100);
    // Iterate through the number of pages in question
    for (i = 1; i < callIterations + 1; i++) {
      // Concatenate the necessary endpoint for the page in question
      endpoint = 'http://opentable.herokuapp.com/api/restaurants?city=' + $(inputId).val().toString() +"&per_page=100" + "&page=" + (i).toString();
      // Set the endpoint of the ajax settings to the newly created endpoint string
      settings.url = endpoint;
      // Send the request and execure the following when done
      $.ajax(settings).done(function (response) {
        // Populate the restaurants array with dicts for each page
        window.restaurantsForCity[response.current_page - 1] = response.restaurants;
      });
    }
  });
}

