// Import Airtable SDK
const Airtable = require('airtable');

// Initialize Airtable with your API key and base ID from environment variables
const base = new Airtable({ apiKey: process.env.Airtable_API_key }).base(process.env.airtable_base_id);

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
