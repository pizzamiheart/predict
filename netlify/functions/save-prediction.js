// functions/save-prediction.js
const fs = require('fs').promises;
const path = require('path');

const PREDICTIONS_FILE = path.join(__dirname, 'predictions.json');

exports.handler = async (event) => {
  console.log('Received event:', event);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { prediction, name, location } = JSON.parse(event.body);
    console.log('Parsed input:', { prediction, name, location });

    if (!prediction) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    let predictions = [];
    try {
      const fileData = await fs.readFile(PREDICTIONS_FILE, 'utf-8');
      predictions = JSON.parse(fileData);
    } catch (error) {
      console.log('File does not exist or read error, creating new file...');
      await fs.writeFile(PREDICTIONS_FILE, JSON.stringify([]));
    }

    // Add new prediction
    predictions.push({
      prediction,
      name: name || 'Anonymous',
      location: location || 'Unknown',
      timestamp: new Date().toISOString(),
    });

    // Write back updated predictions
    await fs.writeFile(PREDICTIONS_FILE, JSON.stringify(predictions, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Prediction submitted successfully!' }),
    };
  } catch (error) {
    console.error('Error occurred:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
