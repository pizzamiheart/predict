// list-predictions.js
const { promises: fs } = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const filePath = path.join(__dirname, 'predictions.json');
    const fileData = await fs.readFile(filePath);
    const predictions = JSON.parse(fileData.toString());

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(predictions)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load predictions' })
    };
  }
};
