// Modifies the local search page and inserts the DineSafeTO establishment_status
const selectors = ["div.rllt__details", // https://www.google.com/search?q=mcdonalds+toronto&oq=mcdonalds+toronto&aqs=chrome.0.69i59.1221j0j9&sourceid=chrome&ie=UTF-8
			 "#rhs > div > div", // https://www.google.com/search?q=pho+phuong&oq=&aqs=chrome.1.69i59i450l8.111464j0j7&sourceid=chrome&ie=UTF-8
			 "#pane > div",  // https://www.google.com/maps/place/Karachi+Bazaar/@43.7632317,-79.3016227,15z/data=!4m5!3m4!1s0x0:0xafc00ec923f5b0c3!8m2!3d43.7632346!4d-79.3016103
			];
// Checks to see if the page is a Google Local Search Engine Results Page. If it is...
if (document.location.hostname == 'www.google.com' && document.querySelectorAll("div.rllt__details").length > 0) {
			
	// ...download the data from the xml file and store it in a variable
	var xmlLoc = "https://secure.toronto.ca/opendata/ds/od_xml.xml";
	var xhttp;
	var data;
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
							
			// (The CSS selector used by the SERP to list locations results)
			var details = document.querySelectorAll("div.rllt__details"); // enhancement: expand to include more selectors 
							
			// ...then iterate through the results and... 
			for (let i = 0; i < details.length; i++) {
				// ...split the establishment address and name to be used in the DineSafeTO query 
				var node = details.item(i).innerText.split("\267")[0]; // splits on the interpunct to separate name/address from the rest of the string
				var queryArray = node.split("\n"); // splits on \n to separate name from address 
				var qName = queryArray[0];
				var qAddress = queryArray[1];					
				// ...filter the xml file for exact matches on the query address 
				var list = parsedData.getElementsByTagName('ESTABLISHMENT');
				for (let j = 0; j < list.length; j++) {
					if (qAddress.toUpperCase().trim() === list[j].getElementsByTagName('ADDRESS')[0].textContent.toUpperCase()) {
						if (qName.toUpperCase().trim() === list[j].getElementsByTagName('NAME')[0].textContent.toUpperCase()) {
							// ...then look up the DineSafeTO status 
							var estStatus = list[j].getElementsByTagName('STATUS')[0].textContent.toUpperCase();
							// ...and append the DineSafeTO status to the SERP item 
							var statusDiv = document.createElement("DIV");
							var insertLocation = details.item(i);
			
							statusDiv.innerHTML = estStatus;
							try {
									switch (estStatus) {
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
							insertLocation.appendChild(statusDiv);
						}
					}
				}
			}
		}
	}
	xhttp.open("GET", xmlLoc, true);
	xhttp.send();
}