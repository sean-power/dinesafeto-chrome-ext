// Disables the extension on all tabs
chrome.action.disable();
// Register the listener when the tab is updated 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status == 'complete') {
		console.log(tab.url);
		// If the tab is Google, then the Chrome extension is enabled and the DineSafeTO GET request can retrieve the data to be stored in the cache 
		if (tab.url.indexOf('google') != -1) {
			console.log('enable');
			chrome.action.enable(tabId);
			
			fetchData() // Call a function that fetches data from DineSafeTO
		}

		// If the tab is not Google, disable the Chrome extension 
		else {
			console.log('disable');
			chrome.action.disable(tabId);
		}
	}
});

// Download the data from the xml file and store it in a variable named blob
function fetchData() {
	const xml = "https://secure.toronto.ca/opendata/ds/od_xml.xml";
	const apiRequest = new Request(xml)
	fetch(apiRequest)
	  .then((response) => {
		  if (!response.ok) {
			  throw new Error(`HTTP error! Status: ${ response.status }`);
		  }
		  return response.blob();
		  console.log(response.blob());
	  })
	  .then((response) => {
		console.log(response.text())
	  });
}

function cacheData() {
	//const data = fetchData()
	//console.log(data)
	caches.open('test')
	  .then(function(cache) {
		  return cache.addAll([
			'/sw-test/',
			'/sw-test/index.html',
			'/sw-test/style.css',
			'/sw-test/app.js',
			'/sw-test/image-list.js',
			'/sw-test/star-wars-logo.jpg',
			'/sw-test/gallery/',
			'/sw-test/gallery/bountyHunters.jpg',
			'/sw-test/gallery/myLittleVader.jpg',
			'/sw-test/gallery/snowTroopers.jpg'
      ]);
	  })
}