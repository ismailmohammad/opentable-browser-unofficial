window.cities = {};
window.restaurantsForCity = {};
$(document).ready(function () {
           getCities();
           $('input.autocomplete').autocomplete({
            data: window.cities,
            limit: 20,
            minLength: 2
          });
          // Initialize Toasts
          $('.tooltipped').tooltip();
        });

function getCities() {
  // The api endpoint
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
	});
}

function getRestaurants(inputId){
  if ($(inputId).val() == ""){
    Materialize.toast('Please Enter a city', 4000);
    return false;
  }
  var total_entries;
  var endpoint = 'http://opentable.herokuapp.com/api/restaurants?city=' + $(inputId).val() + "&per_page=5";
  var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": endpoint,
	  "method": "GET",
	  "headers": {
	    "Content-Type": "application/x-www-form-urlencoded"
	  }
  }
  // Initially get how many restaurants there are for that city
  $.ajax(settings).done(function (response) {
    if (response.total_entries > 0){
      total_entries = response.total_entries;
    } else {
      Materialize.toast('Restaurants could not be found for the given city. Please try correcting the city name and try again');
    }
  })
  // calculate how many pages to poll
  
  endpoint = 'http://opentable.herokuapp.com/api/restaurants?city=' + $(inputId).val() +"&per_page=100";
  settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": endpoint,
	  "method": "GET",
	  "headers": {
	    "Content-Type": "application/x-www-form-urlencoded"
	  }
  }
  $.ajax(settings).done(function (response) {
    if (response.total_entries > 0){
      window.restaurantsForCity = response;
    } else {
      Materialize.toast('Restaurants could not be found for the given city. Please try correcting the city name and try again');
    }
	})
}