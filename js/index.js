window.cities = {};
window.cityJSON = {};
window.restaurantsForCity = [];
var totalRestaurantsCity;
// Price Icons to be used when populating the table
var priceIcons = {1: null, 2: null, 3: null, 4: null};
$(document).ready(function () {
  getCities();
  // Initialize Toasts
  $('.tooltipped').tooltip();
  // Hide Table on document load
  $('#result-table-div').hide();
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
    for (pageNum = 1; pageNum < callIterations + 1; pageNum++) {
      // Concatenate the necessary endpoint for the page in question
      endpoint = 'http://opentable.herokuapp.com/api/restaurants?city=' + $(inputId).val().toString() +"&per_page=100" + "&page=" + (pageNum).toString();
      // Set the endpoint of the ajax settings to the newly created endpoint string
      settings.url = endpoint;
      // Send the request and execure the following when done
      $.ajax(settings).done(function (response) {
        // Populate the restaurants array with dicts for each page
        window.restaurantsForCity[response.current_page - 1] = response.restaurants;
        // Load the restaurants for the initial page
        loadRestaurants(response.current_page - 1);
      }).catch( function(error) {
        Materialize.toast('An error occurred', 1000);
      });
    }
    // Show results table after populating it
    $('#result-table-div').show();
  }).then( function() {
    // Load the restaurants for the initial page
    loadRestaurants(0);
  });
}


function loadRestaurants(page) {
  console.log(page);
  for (restaurant = 0; restaurant < restaurantsForCity[page].length; restaurant++) {
    console.log(restaurant)
    var name = restaurantsForCity[page][restaurant].name;
    var address = restaurantsForCity[page][restaurant].address;
    var price = restaurantsForCity[page][restaurant].price;
    $('#result-table > tbody:last-child').append(`<tr><td>${name}</td><td>${address}</td><td>${price}</td></tr>`);
  }
}

function scrollToTop() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
}