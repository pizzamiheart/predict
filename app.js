// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvzYf7shoyFOWyGKO9JX8F4pZDUJHjK50",
    authDomain: "predict-stuff.firebaseapp.com",
    projectId: "predict-stuff",
    storageBucket: "predict-stuff.appspot.com",
    messagingSenderId: "922197728160",
    appId: "1:922197728160:web:6875810776000b04e522c5",
    measurementId: "G-L29FL7MHCZ"
  };
  
  firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function () {
  // Event listener for prediction submission
  if (document.getElementById('submit-btn')) {
    document.getElementById('submit-btn').addEventListener('click', submitPrediction);
  }

  // Event listener for viewing all predictions
  if (document.getElementById('view-all-btn')) {
    document.getElementById('view-all-btn').addEventListener('click', viewAllPredictions);
  }

  // Event listener for going back to home
  if (document.getElementById('back-btn')) {
    document.getElementById('back-btn').addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }

  // Fetch predictions if on the predictions page
  if (window.location.pathname.includes('predictions.html')) {
    fetchPredictions();
  }
});

// Function to submit a prediction
function submitPrediction() {
  const predictionText = document.getElementById('prediction-text').value;
  const name = document.getElementById('name').value;
  const location = document.getElementById('location').value;

  if (predictionText) {
    db.collection('predictions').add({
      text: predictionText,
      name: name || 'Anonymous',
      location: location || 'Unknown',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      alert('Prediction submitted!');
      document.getElementById('prediction-text').value = '';
      document.getElementById('name').value = '';
      document.getElementById('location').value = '';
    }).catch((error) => {
      console.error('Error adding document: ', error);
    });
  } else {
    alert('Please enter a prediction!');
  }
}

// Function to navigate to the predictions page
function viewAllPredictions() {
  window.location.href = 'predictions.html';
}

// Function to fetch and display predictions
function fetchPredictions() {
  const predictionsContainer = document.getElementById('predictions-container');

  db.collection('predictions').orderBy('timestamp', 'desc').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const prediction = doc.data();
      const predictionElement = document.createElement('div');
      predictionElement.className = 'prediction';
      predictionElement.innerHTML = `
        <div class="prediction-header">
          <span class="prediction-name">${prediction.name}, ${prediction.location}</span>
          <span class="prediction-date">${prediction.timestamp ? prediction.timestamp.toDate().toLocaleString() : 'Unknown'}</span>
        </div>
        <div class="prediction-body">${prediction.text}</div>
      `;
      predictionsContainer.appendChild(predictionElement);
    });
  }).catch((error) => {
    console.error('Error fetching predictions: ', error);
  });
}