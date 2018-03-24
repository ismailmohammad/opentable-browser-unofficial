# Answers to Technical Questions
 1. **How long did you spend on the coding test? What would you add to your solution if you had more time? If you didn't spend much time on the coding test then use this as an opportunity to explain what you would add.**
 I spent roughly 8 hours on the coding test, on and off throughout the day within my normal schedule, usually to refresh my mind while writing code and testing. Especially when it came to debugging, taking time apart was really useful stay on track. Much of this test was really a learning process, especially with the tests and learning how to use the Jasmine testing suite. Going forward, the experience gained from this test will be helpful and I feel would speed up and guide development working with tests first then implementing to ensure the expectations pass.
With more time, I would add more features on top of the ones currently implemented, to make the user experience more seamless and enjoyable. A few features that I can think of now upon completion would be to implement an optional authentication system with a user login to help users track their viewing/search history and even perhaps add onto it so that it would use the the view/search history to recommend restaurants that fit in with the trends of the user history.
 2. **What was the most useful feature that was added to the latest version of your chosen language? Please include a snippet of code that shows how you've used it.**
I chose to stick to the Native JavaScript Platform and mostly used the JQuery library for DOM manipulation. The latest version of JQuery is 3.3.1 however the code is identical to 3.3.0 minus the dependencies. As per the documentation, the developers recently added the ability to arrays of CSS classes through the .addClass() and .removeClass() methods. This was quite useful when adding and removing multiple classes on result page load as shown below, versus .addClass() on multiple lines or a continous string "red darken-4 active". Although I did not use this extensively, I can definitely see the further ease of use that accompanies this including the ability to use array methods on the list of strings
```javascript
  // Remove the active along with the imposed colour classes
  $("#table-pages > li").removeClass(['active', 'red', 'darken-4']);
  // Set the pagination number to active, and add the classes red and darken-4 to it
  $(pageId).addClass(['active', 'red', 'darken-4']);
```
 3. **How would you track down a performance issue in production? Have you ever had to do this?**
 After the testing and application phases where you would ensure unit test coverage of important/relevant lines of code, in production, the biggest help would be data/statistics. By first gathering and analyzing data on the times it's slow and whether it is consistent or fluctuates based on client usage load or maintenance tasks and also look into the resource management statistics for servers. With this data in hand, it may be easier to narrow down possible reasons for slowdowns and to address any bottlenecks if present. I personally have not had to do this on a professional level. However, it's something that's becoming more prominent especially in my role as a web developer for a side venture that a group of peers and I are pursuing. The "slowdowns" have not yet been significant as it's still in its initial stages (Alpha right now) but I anticipate learning more about addressing these concerns prior to them becoming an issue as the platform starts to scale.
 4. **How would you improve the API that you just used?**
 From reading and following the documentation <https://opentable.herokuapp.com/>, I realized a feature that is currently not available through the GET requests would be searching by name of the restaurant. Sending a http GET request to ```http://opentable.herokuapp.com/api/restaurants?city=toronto&name='Cafe Bar Pasta Inc.'``` would not work due to the way whitespaces are encoded. API users can however search by id. More realistically speaking however, I feel implementing this API with a graphQL endpoint may be potentially an improvement as queries could be more customized to what the client needs are and as such an option could be to just poll id and name for example and go from there to search for restaurants to avoid fetching a lot of resources prior to the restaurant search.
``` 
{
  restaurant {
    id
    name
  }
}
```
 5. **Please describe yourself using JSON.**
``` json
{
  "firstName": "Mohammad",
  "lastName": "Ismail",
  "education": {
    "University of Toronto - Scarborough": "Intended Double Major Computer Science and Economics"
  },
  "passions": [
    "Coding",
    "Hackathons",
    "Learning",
    "Food and Cooking (attempting to at least, for the latter)"
  ],
  "languages": [
    "python",
    "JavaScript",
    "HTML",
    "CSS",
    "Java"
  ],
  "traits": [
    "adaptive learner",
    "determined",
    "inquisitive"
  ],
  "favouriteTextEditors": [
    "Visual Studio Code",
    "Sublime"
  ],
  "tabsOrSpaces": "spaces",
  "tvShows": [
    "Silicon Valley",
    "The Office",
    "Black Mirror"
  ],
  "favouriteFoods": [
    "sushi",
    "pizza",
    "ice cream",
    "mangoes"
  ]
}
```

###### Notes: I was initially confused regarding the outcode user story, authorization, and the acceptance criteria. This test seems to an adapted version of the Just Eat recruitment test (<https://github.com/justeat/JustEat.International.ApiRecruitmentTest>), based in the UK so SE19 makes sense for that and the API that they used since UK is not one of the countries for the API within the initial email. I did hear back regarding authorization credentials from OpenTable from the link provided in the email (<https://platform.opentable.com/documentation/#authorization>) and my sign-up was rejected so I continued based on my assumptions with regards to dealing with Canadian (M5H, M1E, etc.) "outcodes". Other countries/states were also considered, ie. New York and isolating for "100", "101". Additionally, the acceptance criteria listed some fields that were exclusive to the Just Eat API, ie. Cuisine and Rating. I have tried to accommodate to the best of my abilities. The webapp is also deployed at <https://ismail-opentable-browser.firebaseapp.com/>.