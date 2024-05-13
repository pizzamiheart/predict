// Ensure this require statement is at the top of your file
const Airtable = require('airtable');

exports.handler = async (event) => {
  // Airtable initialization
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

  try {
    const { prediction, name, location } = JSON.parse(event.body);
    // Attempt to create a record
    await base('Predictions').create({
      'Prediction': prediction,
      'Name': name || 'Anonymous',
      'Location': location || 'Unknown'
    });
    return { statusCode: 200, body: JSON.stringify({ message: 'Prediction submitted successfully!' }) };
  } catch (error) {
    console.error('Airtable Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error', details: error.message }) };
  }
};
