// Import Airtable SDK
const Airtable = require('airtable');

// Initialize Airtable with your API key and base ID
const base = new Airtable({ apiKey: patQnOwlngvrCERYo.b5d8aca6f9654df4ce47ce5af50e97b995d3a6a0ec477e1ef2ec7767a9f91c17 }).base(appNRESV7ZVhRQZfj);

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const records = await base('Predictions').select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 3,
      view: "Grid view"
    }).firstPage();

    const predictions = records.map(record => ({
      id: record.id,
      prediction: record.get('Prediction'),
      name: record.get('Name'),
      location: record.get('Location')
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(predictions)
    };
  } catch (error) {
    console.error('Error occurred:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to load predictions', details: error.toString() }) };
  }
};
