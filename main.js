/* CSCI 344 Project 1
 * Nicholas Blum
 * 3/23/15
 *
 * This document contains the javascript functions used for this project.
 */

var     prevSearchTerms = [];   // Stores all previous search terms
var     pstPos = 0;             // Stores the position in prevSearchTerms to grab a search term
var     firstSearch = false;    // Has at least one search been done
var     tempSearchTerm;         // Stores the most recent search term to use in next10() and prev10()
var     numHits;                // Number of hits
var     dispMult = 1;           // Display multiplier for use when changing the display position
var     limitReached = false;   // Have we reached the maximum number of hits yet or not

// createPageFromJSONP(data) is called through JSONP by the Library of Congress returned object. The function's job is to
// display the returned data in a way that is easily accessible by the user. It accesses two HTML objects in index.html:
//  <div id="hits">, which lets the user know if something was found, and if so how many hits;
//  <div id="results">, which displays the results if they exist.
function createPageFromJSONP(data) {
    "use strict";
    
    // The goal is to display 10 hits at a time, based on the multiplier which lets you know how far into the search you are. However if this is greater than the remaining hits, make the right bound j equal to the remaining hits.
    numHits = data.search.hits;
    
    var leftBound = (10 * dispMult - 9);
    var i = leftBound;
    var rightBound = leftBound + 9;
    var j = rightBound;
    if (rightBound > numHits) {
        j = numHits;
        limitReached = true;
    } else {
        limitReached = false;
    }
    
    var placeFirstHere = document.getElementById("hits"); // Details if something was found, and if so how many
    var placeItHere = document.getElementById("results"); // Contains the results if appropriate
    
    
    // If at least one hit was found, display the hit(s). Otherwise display that nothing was found.
    if (numHits > 0) {
        placeFirstHere.innerHTML = "<b>" + data.search.query + "</b> found with " + numHits + " hits. Displaying hits " + leftBound + " through " + j + ".<br>";
        placeItHere.innerHTML = "";
        for (i = leftBound; i <= j; i += 1) {
            // Text results
            placeItHere.innerHTML += "<p><h3>" + i + ".</h3> " + data.results[i].title + "</p>";
            // Image (if it exists)
            placeItHere.innerHTML += "<img src='" + data.results[i].image.full + "'></img>";
        }
    } else {
        placeFirstHere.innerHTML = "<b>" + data.search.query + "</b> returned no hits.";
        placeItHere.innerHTML = "";
    }
}

// getJSONP(stuff) grabs a query from the server using 'stuff' as the search term.
// Importantly, it will dynamically grab only the objects defined by the current left and right bounds. This means that
// the user can scroll through using previous and next without having to grab the entire object.
function getJSONP(stuff) {
    "use strict";
    
    // Figure out which section of data to return
    var leftBound = (10 * dispMult - 9);
    console.log("Left bound is " + leftBound);
    var rightBound = leftBound + 10;
    console.log("Right bound is " + rightBound);
    if (rightBound > numHits) {
        rightBound = numHits;
    }
    
    
    // Create a script object, then use its source as the API's specified search address using the most recent search term from the array of search terms. The callback function will run automatically.
    var incomingScript = document.createElement('script');
    console.log("http://loc.gov/pictures/search/?q=" + stuff + "&si=" + leftBound + "&c=" + rightBound +"&fo=json&callback=createPageFromJSONP");
    incomingScript.src = "http://loc.gov/pictures/search/?q=" + stuff + "&si=" + leftBound + "&c=" + rightBound +"&fo=json&callback=createPageFromJSONP";
    
    // Append the script to page
    document.getElementsByTagName('head')[0].appendChild(incomingScript);
}

// searchLib() grabs the value of the text box and clears it for another search
function searchLib() {
    "use strict";
    
    // We always want to get the first 10 elements back in a new search, so set dispMult to one.
    dispMult = 1;
    
    var s = document.getElementsByName("sTerm")[0]; // Get the first instance of the element named sTerm in my document
    // If the search term contains characters that are not whitespace or "undefined"
    if (!!s.value && s.value.trim() && s.value !== "undefined") {
        console.log("Does array contain? " + $.inArray(s.value, prevSearchTerms));
        firstSearch = true; // At least one search has been accomplished, so now you can use next and previous
        
        // If array does not already contain the value, add it
        if ($.inArray(s.value, prevSearchTerms) === -1) {
            prevSearchTerms[prevSearchTerms.length] = s.value; // Add this search term value to the array
            tempSearchTerm = s.value; // Save it
            // Add it to the list of previous search terms
            var showBox = document.getElementById("showBoxList");
            $(showBox).append("<li class='clickableTerm' onclick='fillWithTerm(this.innerHTML)'>" + tempSearchTerm + "</li>");
        }
        // If it contains the value, simply move it to the end of the array (so it's the "previous search term")
        else {
            prevSearchTerms.splice(prevSearchTerms.indexOf(s.value), 1);
            prevSearchTerms[prevSearchTerms.length] = s.value;
        }
        getJSONP(s.value); // Search for it
        tempSearchTerm = s.value; // Save it
    }

    // Cleanup and move pstPos to the latest search term (which will always be the last in the array)
    s.value = '';
    console.log(prevSearchTerms);
    pstPos = prevSearchTerms.length - 1;
    // console.log("pstPos is " + pstPos);
}

// fillWithPrev() goes through the array of your previous search terms and fills the search text box with that term
// It loops through the array, returning to the top each time pstPos goes below 0
function fillWithPrev() {
    "use strict";
    var s = document.getElementsByName("sTerm")[0]; // Get the first instance of the element named sTerm in my document
    if (pstPos < 0) {
        pstPos = prevSearchTerms.length - 1;
    }
    // console.log(prevSearchTerms[pstPos]);
    s.value = prevSearchTerms[pstPos];
    pstPos--;
}

function fillWithTerm(term) {
    "use strict";
    var s = document.getElementsByName("sTerm")[0]; // Get the first instance of the element named sTerm in my document
    s.value = term;
}

// prev10() will display the previous ten results from a search.
function prev10() {
    if (firstSearch === true) {
        if (dispMult > 1) {
            dispMult -= 1;
            getJSONP(tempSearchTerm);
        }
    } else {
        console.log("Can't click that yet");
    }
}

// next10() will display the next ten results from a search.
function next10() {
    if (firstSearch === true) {
        // If we haven't reached the end yet
        if (limitReached === false) {
            dispMult += 1;
            getJSONP(tempSearchTerm);
        }
    } else {
        console.log("Can't click that yet");
    }
}

// showAllPrev() will create a CSS box that dynamically fills with content, scrollable, closable
function showAllPrev() {
    var showBox = document.getElementById("showBox");
    if (showBox.style.visibility === "hidden") {
        showBox.style.visibility = "visible";
    } else if (showBox.style.visibility === "visible") {
        showBox.style.visibility = "hidden";
    }
}

function hideAllPrev() {
    var showBox = document.getElementById("showBox");
    showBox.style.visibility = "hidden";
}

$("#sTextBox").on("keypress", function () {
    console.log("Trying something!");
    fillWithPrev();
    searchLib();
});

$("#sTextBox").on("focus", function() {
    console.log("has focus");
});

// Init function
window.onload = function () {
    "use strict";
    document.getElementById("showBox").style.visibility = "hidden";
};