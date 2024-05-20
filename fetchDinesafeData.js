const https = require('https');

exports.fetchJSONProxy = (req, res) => {
  // URL of the JSON endpoint
  const jsonUrl = 'https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/ea1d6e57-87af-4e23-b722-6c1f5aa18a8d/resource/c573c64d-69b6-4d5b-988a-f3c6aa73f0b0/download/dinesafe.json';

  // Make a GET request to the JSON endpoint URL
  https.get(jsonUrl, (response) => {
    let data = '';

    // Concatenate data chunks as they come in
    response.on('data', (chunk) => {
      data += chunk;
    });

    // When all data is received, parse it as JSON and filter it
    response.on('end', () => {
      try {
        const jsonData = JSON.parse(data);

        // Filter the data based on regular expressions
        const filteredData = jsonData.filter(item => {
          const establishmentName = item['Establishment Name'].toUpperCase();
          const establishmentAddress = item['Establishment Address'].toUpperCase();
          const establishmentStatus = item['Establishment Status'].toUpperCase();

          // Replace "establishmentName", "establishmentAddress", and "establishmentStatus" with the actual regular expressions you want to use
          return establishmentName.match(/.+/) && establishmentAddress.match(/.+/) && establishmentStatus.match(/.+/);
        });

        // Return only the "Establishment Name", "Establishment Address", and "Establishment Status" fields for all rows
        const finalData = filteredData.map(item => ({
          'Establishment Name': item['Establishment Name'].toUpperCase(),
          'Establishment Address': item['Establishment Address'].toUpperCase(),
          'Establishment Status': item['Establishment Status'].toUpperCase()
        }));

        // Set CORS headers
        res.set('Access-Control-Allow-Origin', 'https://www.google.com');
        res.set('Access-Control-Allow-Methods', 'GET, POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Allow-Credentials', 'true');

        res.status(200).send(finalData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).send('Error parsing JSON');
      }
    });
  }).on('error', (error) => {
    console.error('Error fetching JSON:', error);
    res.status(500).send('Error fetching JSON');
  });
};