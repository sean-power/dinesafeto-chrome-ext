// const data = fetchData();

// // When content.js sends a message to background.js to get data, background.js listens to it. If the message is get-data, then the background executes the function fetchData() and sends it back to content.js 
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message === 'get-data') {
// 	sendResponse(data);
// 	chrome.storage.sync.set({'dineSafeTO': data}, function() {
// 		console.log('dineSafeTO logged to Chrome Storage')
// 	});
//   }
// });

// Download the data from the xml file and store it in a variable named blob
// async function fetchData() {
// 	const xml = "https://secure.toronto.ca/opendata/ds/od_xml.xml";
// 	const apiRequest = new Request(xml)
// 	fetch(apiRequest)
// 	  .then((response) => {
// 		  if (!response.ok) {
// 			  throw new Error(`HTTP error! Status: ${ response.status }`);
// 		  }
// 		  return response.blob();
// 		  //console.log(response.blob());
// 	  })
// 	  .then((response) => {
// 		console.log(response.text())
// 	  });
// }
/* *************** MAT, START HERE ******************* */
// APPROACH A, OUTSIDE THE FUNCTION, DOESN'T WORK.
var value = fetchData2();
console.log('value: ' + value) // expected value is the actual string (same as line 49), not [object Promise]
//chrome.storage.sync.set({'dineSafeTO', value}, function() {
//	console.log('dineSafeTO logged to Chrome Storage')
//})

function fetchData2() {
	return fetch('https://secure.toronto.ca/opendata/ds/od_xml.xml', {
		method: 'GET',
	  })
	  .then(async function(response) {
		console.log(response.status)
		const blob = await response.blob();
		const string = await blob.text();
		const type = blob.type;
		console.log('typeof: ' + typeof blob);
		console.log('type: ' + type);
		console.log('blob: ' + blob);
		console.log('string: ' + string);
		console.log('typeof string: ' + typeof string);
		// APPROACH B, INSIDE THE FUNCTION, DOESN'T WORK. PLEASE HELP.
		//chrome.storage.sync.set({'dineSafeTO', string}, function() {
		//	console.log('dineSafeTO logged to Chrome Storage')})
		return string;
	  })
	}