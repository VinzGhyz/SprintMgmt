# SprintMgmt - a working scrum board application

## Features

* Drag and drop stories between the different lists to reflect their current stage. Multi selection possible by clicking on several items within the same list
* Add new stories to the lists (by default items can only be added to the To Do list, but that can be easily changed in the scrumBoard.html template). Escaping edit mode is accomplished either by removing the focus on the element, or by pressing Enter
* Double click on the Sprint title to edit it, press Enter to save changes
* All changes are saved locally using localStorage
* Lists names and styles are dynamic, allowing for easy implementation of additional states for the stories
* The application is responsive and the layout adapts to the viewport

## Limitations
As the timeframe to develop this prototype was limited (8-10 hours), decisions had to be taken to meet the basic requirements in time. As such, the following items have not been tended to, although they could/should have been in a real-life environment:

* Input validation
* Actual back-end implementation via $resource in the ScrumBoardModel factory (simulated for now by loading data from data.json then saving changes locally)
* Proper testing of the different components

## Future Improvements

This project could be more relevant to an actual internal use if the following items were implemented (list obviously non exhaustive):

* Better features for story management (assign to a user, add tags/categories, filter by importance/time-to-market)
* Sprint Planning view (create and manage backlog of stories, plan upcoming sprints, manage concurrent active sprints, assign those to a team, see at a glance their completion level [stories To Do vs In Progress vs Complete])
* Authentication via Google Apps and OAuth2
* Routing at the sprint-level (currenty the only route is /#/scrum-board, that would become /#/scrum-board/:sprint)


## Live Demo

A live demo of the application is available at http://vinzghyz.github.io/SprintMgmt
This project is based off the angular-seed skeleton, and makes use of the following third-party libraries :

* angular-drag-and-drop-lists (https://github.com/marceljuenemann/angular-drag-and-drop-lists)
* angular-local-storage (https://github.com/grevory/angular-local-storage)

## Run the Application locally

The simplest way to start the server is:

```
npm start
```

Then browse to the app at `http://localhost:8000/app/index.html`.

## Contact

You can reach me at the following links below

[Email](mailto:vincent.ghyssens@gmail.com)
[Twitter](https://twitter.com/VincentGhyssens)
[LinkedIn](https://be.linkedin.com/in/vincentghyssens)
