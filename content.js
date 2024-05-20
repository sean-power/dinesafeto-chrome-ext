// Send background.js a message requesting the DineSafeTO data
chrome.runtime.sendMessage('get-data', (response) => {
  // The background.js sends an asynchronous response with the data from the background. We want to save it in the cache when that happens.
});

// Gets the latest dineSafeTO data from Chrome Storage
var data2 = chrome.storage.local.get('dineSafeTO', function() {
	console.log('Retrieved DineSafeTO data from local storage');
	console.log(data2)
});

// Modifies the local search page and inserts the DineSafeTO establishment_status
const selectors = ["div.rllt__details", // https://www.google.com/search?q=mcdonalds+toronto&oq=mcdonalds+toronto&aqs=chrome.0.69i59.1221j0j9&sourceid=chrome&ie=UTF-8
    "#rhs > div > div", // https://www.google.com/search?q=pho+phuong&oq=&aqs=chrome.1.69i59i450l8.111464j0j7&sourceid=chrome&ie=UTF-8
    "#pane > div",  // https://www.google.com/maps/place/Karachi+Bazaar/@43.7632317,-79.3016227,15z/data=!4m5!3m4!1s0x0:0xafc00ec923f5b0c3!8m2!3d43.7632346!4d-79.3016103
];

// Evaluate whether the page is a SERP with Google Places results
const isGooglePlacesSERP = selectors.some(selector => document.querySelectorAll(selector).length > 0);

// JSON host for DineSafeTO data
const jsonLoc = "https://us-central1-dinesafeto.cloudfunctions.net/fetchDinesafeData"

// Check if the extension is enabled and if the user is on a Google Places SERP
chrome.storage.sync.get('enabled', function(data) {
    const enabled = data.enabled || false;
    if (enabled && document.location.hostname == 'www.google.com' && isGooglePlacesSERP) {
        // Extension is enabled and conditions for Google Places SERP are met
        console.log("Extension is enabled, and this is a Google Places SERP");
		fetchDataFromServer(jsonLoc)
			.then(appendStatus)
			.catch(error => {
				console.error('Error fetching or processing data:', error);
			})
	}
 	else {
        console.log("Extension is either not enabled or not on www.google.com or no Google Places results found.");
    }
});

// Function to fetch data from the JSON host
function fetchDataFromServer(url) {
    return fetch(url)
        .then(response => {
            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the response as JSON
            return response.json();
        })
        .then(data => {
            // Print the rows in the JSON to the console
            //console.log(data);
            // You can iterate over the rows and log them individually if needed
            //data.forEach(row => {
            //    console.log(row);
            //});
            return data; // Return the fetched data
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to process data and append status
function appendStatus(data) {
	// Iterate through the SERP elements
	selectors.forEach(selector => {
		const details = document.querySelectorAll(selector);
		details.forEach(detail => {
		  // Split the establishment address and name
		  const node = detail.innerText.split("\xb7")[0];
		  //const node = detail.innerText.split("\267")[0];
		  const queryArray = node.split("\n");
		  const qName = queryArray[0].trim().toUpperCase();
		  const qAddress = queryArray[1].trim().toUpperCase();
		  // console.log('node: ' + node);
		  // console.log('qName: ' + qName);
		  // console.log('qAddress: ' + qAddress);
	
		  // Filter the JSON data for exact matches
		  const matchingEstablishment = data.find(
			(establishment) =>
			  establishment['Establishment Address'].toUpperCase() === qAddress &&
			  establishment['Establishment Name'].toUpperCase() === qName
		  );
	
		  // If a match is found, append the status
			if (matchingEstablishment !== undefined && matchingEstablishment) {
				const statusDiv = document.createElement("DIV");
				statusDiv.innerHTML = matchingEstablishment['Establishment Status'];	
				try {
					switch (matchingEstablishment['Establishment Status']) {
						case "PASS":
						statusDiv.className = "pass_state";
						break;
						case "CONDITIONAL PASS":
						statusDiv.className = "conditional_state";
						break;
						case "CLOSED":
						statusDiv.className = "closed_state";
						break;
					}
				} catch (err) {
					console.log(err.message);
				}
				detail.appendChild(statusDiv);
			}
			else {
				console.log(
				`No matching establishment found for ${qName} at ${qAddress}`
				);
			}
		});
	});
}