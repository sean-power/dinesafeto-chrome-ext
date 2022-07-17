const data = fetchData()
// When content.js sends a message to background.js to get data, background.js listens to it. If the message is get-data, then the background executes the function fetchData() and sends it back to content.js 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'get-data') {
	sendResponse(data);
	chrome.storage.local.set({'dineSafeTO': data}, function() {
		console.log('dineSafeTO logged to Chrome Storage')
	});
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