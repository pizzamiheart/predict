// Import Airtable SDK
const Airtable = require('airtable');

// Initialize Airtable with your API key and base ID
const base = new Airtable({ apiKey: b5d8aca6f9654df4ce47ce5af50e97b995d3a6a0ec477e1ef2ec7767a9f91c17 }).base(appNRESV7ZVhRQZfj);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { prediction, name, location } = JSON.parse(event.body);

    if (!prediction) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    // Insert the new prediction into the Airtable base
    await base('Predictions').create({
      'Prediction': prediction,
      'Name': name || 'Anonymous',
      'Location': location || 'Unknown'
    });

    return { statusCode: 200, body: JSON.stringify({ message: 'Prediction submitted successfully!' }) };
  } catch (error) {
    console.error('Error occurred:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error', details: error.toString() }) };
  }
};
