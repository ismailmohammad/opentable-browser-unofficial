// Minimal list of isoCountries, can be expanded to include more
var isoCountries = {
  'AW' : 'Aruba',
  'CA' : 'Canada',
  'CN' : 'China',
  'GP' : 'Guadeloupe',
  'HK' : 'Hong Kong',
  'KN' : 'Saint Kitts And Nevis',
  'KY' : 'Cayman Islands',
  'MO' : 'Macao',
  'MX' : 'Mexico',
  'MY' : 'Malaysia',
  'SV' : 'El Salvador',
  'US' : 'United States',
  'VI' : 'Virgin Islands, U.S.'
};
var cities = {};
var cityJSON = {};
var countries;
var restaurantsForCity = [];
var totalRestaurantsCity;
// Price Icons to be used when populating the table
var priceIcons = {1: '<i class="material-icons">attach_money</i>', 2: '<i class="material-icons">attach_money</i><i class="material-icons">attach_money</i>', 3: '<i class="material-icons">attach_money</i><i class="material-icons">attach_money</i><i class="material-icons">attach_money</i>', 4: '<i class="material-icons">attach_money</i><i class="material-icons">attach_money</i><i class="material-icons">attach_money</i><i class="material-icons">attach_money</i>'};
$(document).ready(function () {
  getCities();
  getCountries();
  // Initialize Toasts
  $('.tooltipped').tooltip();
  // Hide Table on document load
  $('#result-table-div').hide();
  // Hide outcode restriction on document load
  $('#outcode-div').hide();
  // Hide outcode restriction on document load
  $('#country-select-div').hide();
  // Initialize Materialize Select
  $('#country-select').material_select();
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
    cities = response;
    var city;
    for (var x in cities.cities) {
      city = String(cities.cities[x]);
      // The null is a placeholder for images that would normally take its place
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

function getCountries() {
  // The API endpoint involved with retreiving the entire list of cities
  var endpoint = 'https://opentable.herokuapp.com/api/countries';
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
    // Store the country list
    countries = response.countries;
    // Build the options for the countries
    for (var x in countries) {
      $('#country-select').append($('<option>', {
        value: countries[x],
        text: isoCountries[countries[x]]
      }));
    }
	}).then( function() {
    // Reinitialize with countries
    $('#country-select').material_select();
  });
}

function getRestaurants(inputId){
  var restrictOutcode = $('#restrict-outcode-chk').is(':checked');
  var restrictCountry = $('#restrict-country-chk').is(':checked');
  // Validate Fields
  if ($(inputId).val() == "") {
    Materialize.toast('Please Enter a city', 1000);
    return false;
  } else if (!($(inputId).val() in cityJSON)) {
    Materialize.toast('City not found. Please try correcting the city name', 1000);
    return false;
  } else if (restrictOutcode && ($('#outcode-input').val() == "")) {
    Materialize.toast("Please enter an outcode, or uncheck the filter", 1000);
    return false;
  } else if (restrictCountry && ($('#country-select').val() == null)) {
    Materialize.toast("Please select a country, or uncheck the filter", 1000);
    return false;
  }
  // Clear Restaurants before Fetch
  restaurantsForCity = [];
  var endpoint;
  // If country is selected, add to the endpoint link
  if (restrictCountry) {
    endpoint = 'https://opentable.herokuapp.com/api/restaurants?city=' + $(inputId).val() + "&per_page=5&country=" + $('#country-select').val();
  } else {
    endpoint = 'https://opentable.herokuapp.com/api/restaurants?city=' + $(inputId).val() + "&per_page=5"; 
  }
  // Initialize the settings to be used for the JQuery AJAX https request
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
      // Hide the results table
      $('#result-table-div').hide();
      // Let the user know that the city in question could not be found and break the procedure here by returning false
      Materialize.toast('Restaurants could not be found for the given city. Please try correcting the city name and/or country and try again', 1000);
      return false;
    }
  }).then(function() {
    // Clear pagination
    $('#table-pages > li').remove();
    // calculate how many pages/times to poll
    var callIterations = Math.ceil(totalRestaurantsCity/100);
    // Iterate through the number of pages in question
    for (pageNum = 1; pageNum < callIterations + 1; pageNum++) {
      if (restrictCountry) {
        // Concatenate the necessary endpoint for the page in question
        endpoint = 'https://opentable.herokuapp.com/api/restaurants?city=' + $(inputId).val().toString() +"&per_page=100" + "&page=" + (pageNum).toString() + "&country=" + $('#country-select').val();
      } else {
        // Concatenate the necessary endpoint for the page in question
        endpoint = 'https://opentable.herokuapp.com/api/restaurants?city=' + $(inputId).val().toString() +"&per_page=100" + "&page=" + (pageNum).toString();
      }
      // Set the endpoint of the ajax settings to the newly created endpoint string
      settings.url = endpoint;
      // Send the request and execure the following when done
      $.ajax(settings).done(function (response) {
        // Populate the restaurants array with dicts for each page
        restaurantsForCity[response.current_page - 1] = response.restaurants;
        // Load the restaurants for the initial page
        loadRestaurants(0);
      }).catch( function(error) {
        Materialize.toast('An error occurred', 1000);
      });
      $('#table-pages').append(`<li id="pg-indicator-${pageNum}" class=""><a href="javascript: loadRestaurants(${pageNum - 1})">${pageNum}</a></li>`);
    }
  });
  // Show results table after populating it
  $('#result-table-div').show();
}


function loadPaginationNums() {
  for (pageNum = 1; pageNum <= restaurantsForCity.length; pageNum++) {
    $('#table-pages').append(`<li id="pg-indicator-${pageNum}" class=""><a href="javascript: loadRestaurants(${pageNum - 1})">${pageNum}</a></li>`);
  }
}

function loadRestaurants(page) {
  // Clear the table for repolutation
  $('#result-table tbody > tr').remove();
  var restrictOutcode = $('#restrict-outcode-chk').is(':checked');
  var inputOutcode = $('#outcode-input').val();
  try{
    var numRestaurants = restaurantsForCity[page].length;
  } catch (error) {
    errorString = error;
  }
  if (restrictOutcode) {
  for (restaurant = 0; restaurant < numRestaurants; restaurant++) {
    var entry = restaurantsForCity[page][restaurant]
    if (entry.postal_code.indexOf(inputOutcode) == 0) {
      var name = entry.name;
      var address = entry.address + ", " + entry.city + ", " + entry.state + ", " + entry.postal_code + ", " + entry.country;
      var price = priceIcons[parseInt(entry.price)];
      var link = entry.reserve_url;
      $('#result-table > tbody:last-child').append(`<tr><td><a href="${link}">${name}</a></td><td><a href="https://www.google.com/maps/search/?api=1&query=${address}">${address}</a></td><td style="color: green;">${price}</td></tr>`);
    }
    // create the id for the pagination
    var pageId = '#pg-indicator-'+(page+1);
    // Remove active class
    $("#table-pages > li").removeClass("active");
    // Set the pagination number to active
    $(pageId).addClass('active');
    }
  } else {
  for (restaurant = 0; restaurant < numRestaurants; restaurant++) {
    var entry = restaurantsForCity[page][restaurant] 
    var name = entry.name;
    var address = entry.address + ", " + entry.city + ", " + entry.state + ", " + entry.postal_code + ", " + entry.country;
    var price = priceIcons[parseInt(entry.price)];
    var link = entry.reserve_url;
    $('#result-table > tbody:last-child').append(`<tr><td><a href="${link}">${name}</a></td><td><a href="https://www.google.com/maps/search/?api=1&query=${address}">${address}</a></td><td style="color: green;">${price}</td></tr>`);
  }
  // create the id for the pagination
  var pageId = '#pg-indicator-'+(page+1);
  // Remove active class
  $("#table-pages > li").removeClass("active");
  // Set the pagination number to active
  $(pageId).addClass('active');
  }
}

function scrollToTop() {
  // Scroll to the top while animating slowly
  $("html, body").animate({ scrollTop: 0 }, "slow");
}

function restrictPostcode(checkboxID) {
  // Set the function for the checkbox click
	$(checkboxID).click(function() {
		var restrict = $(checkboxID).is(':checked');
		if (restrict){
      // Show the field again
      $('#outcode-div').show();
		} else {
      // Hide the cities input field
			$('#outcode-div').hide();
			// Clear the quantity field
			$('#outcode-input').val('');
		}
	});
}

function restrictCountry(checkboxID) {
  // Set the function for the checkbox click
	$(checkboxID).click(function() {
		var restrict = $(checkboxID).is(':checked');
		if (restrict){
      // Show the field again
      $('#country-select-div').show();
		} else {
      // Hide the cities input field
			$('#country-select-div').hide();
			// Clear the quantity field
			$('#country-select').val('');
		}
	});
}

function scrollTo(id) {
  $('html, body').animate({
    scrollTop: $(id).offset().top
  }, 1000);
}

function toUpperCase(input){
  setTimeout(function(){
      input.value = input.value.toUpperCase();
  }, 1);
}