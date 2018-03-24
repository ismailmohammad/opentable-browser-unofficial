describe('Get Cities from API - getCities()', function() {
  // Simulate Async timeout
  beforeEach(function(done) {
    setTimeout(function() {
      getCities();
      done();
    }, 500);
  });
  // Test specs
  it('should set "cityJSON" to contain the cities dict for the autocomplete', function() {
    expect(Object.keys(cityJSON).length).toBeGreaterThan(10);
  });
  it('should set "cities" to contain the response and its "count" keyvalue should be greater than 10', function() {
    expect(cities.count).toBeGreaterThan(10);
  });
  it('should set "cities" to contain the response and its cities dict length should be greater than 10', function() {
    expect(cities.cities.length).toBeGreaterThan(10);
  });
});

describe('Get Countries from API - getCountries()', function() {
  // Simulate Async timeout
  beforeEach(function(done) {
    setTimeout(function() {
      getCountries();
      done();
    }, 500);
  });
  // Test specs
  it('should set "countries" to contain the dict of countries and there should be 13 as of Mar 24 2018', function() {
    expect(countries.length).toBe(13);
  });
});