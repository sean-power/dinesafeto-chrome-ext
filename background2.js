// Runs in the background when a Chrome tab is created
chrome.windows.onCreated.addListener(function() {
    chrome.windows.getAll(function(windows) {
		// If the number of tabs in Chrome is 1...
        if (1 == 1) { // (windows.length == 1)
            getData();
			sendRequest();
		}
	})
});
	
function getData() {
	// ...download the data from the xml file and store it in a variable
		var xmlLoc = "https://secure.toronto.ca/opendata/ds/od_xml.xml";
		var xhttp;
		var data;
		var parsedData;
		if (window.XMLHttpRequest) {
			xhttp = new XMLHttpRequest();
		} else {
			xhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				var data = xhttp.response;
				parser = new DOMParser();
				var parsedData = parser.parseFromString(data, "text/xml");
				console.log(parsedData);
				const apiRequest = new Request('https://secure.toronto.ca/opendata/ds/od_xml.xml');
				const options = {
					method: "GET",
					headers: new Headers({
						'Content-Type': 'text/xml'
					})
				};
				cacheName = 'cacheDineSafeTO'
				caches.open(cacheName) // opens the cache
				  .then(cache => {
					  console.log(`Cache ${cacheName} opened`);
					/*cache.match(apiRequest) // checks if the request is cached
					  .then(cachedResponse => 
						cachedResponse || // return cachedReponse if available
						fetch(apiRequest) // otherwise, make new request
						  .then(response => {
							cache.put(apiRequest, response); // cache the response
							return response;
						  })) */
					})
					.then(res => console.log(res))
					console.log(apiRequest)
			}
		}
}
function sendRequest() {
	xhttp.open("GET", xmlLoc, true);
	xhttp.send();
}