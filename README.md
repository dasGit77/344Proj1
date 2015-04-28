# 344 Project 1 - Deployment Version 1.0
# Nicholas Blum
# 4/27/15

This project is a basic search engine that retrieves data from the library of congress. It uses the Library of Congress API to retrieve up to ten search results at once, using indexing based on user input. User can click forward and back to update their results with a new query.

In addition to formatting and displaying the search results in a readable manner, a secondary function of this app is to store a local history of search results for the end user's searching convenience. 

The app uses an array to store the data and displays it in a fully scrollable CSS div that can be closed and opened at the user's convenience. Clicking on each <li> populates the search box with the term. One neat feature is that even though the app will remember the last search term through an array index, the position of the search term in the list does not necessarily have to change. This keeps things consistent for the user, avoiding a potential conflict in their experience.

The array is also smart enough to avoid repeating similar queries and cluttering the search box with 25 of the same input. It uses JQuery extensively in order to do so.

Future features might involve adding the use of local storage to remember search term, the ability to add items to a favorites bar, and a message board for people to share information concerning their favorite topics.

Thanks for checking it out!