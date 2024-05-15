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
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Event listener for form submission
document.getElementById('prediction-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const predictionText = document.getElementById('prediction').value;
  const userName = document.getElementById('name').value || "Anonymous";
  const userLocation = document.getElementById('location').value || "Unknown";

  try {
    await db.collection('predictions').add({
      name: userName,
      location: userLocation,
      prediction: predictionText,
      time_stamp: firebase.firestore.FieldValue.serverTimestamp() // Ensures that the timestamp is set by the server
    });
    alert('Prediction submitted successfully!');
    event.target.reset(); // Clear form after submission
  } catch (error) {
    console.error('Error submitting prediction:', error);
    alert('Failed to submit prediction: ' + error.message);
  }
});

// Function to load and display predictions
function loadPredictions() {
  const predictionsList = document.getElementById('predictions-list');
  db.collection('predictions').orderBy('time_stamp', 'desc').get().then(querySnapshot => {
    predictionsList.innerHTML = '';
    querySnapshot.forEach(doc => {
      const data = doc.data();
      predictionsList.innerHTML += `<li>${data.prediction} - ${data.name}, ${data.location}</li>`;
    });
  }).catch(error => {
    console.error('Error loading predictions:', error);
  });
}

// Call the function to load predictions when the predictions page is loaded
document.addEventListener('DOMContentLoaded', loadPredictions);

// Event listener for the back button on predictions page
document.getElementById('back-btn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Event listener for the 'View All Predictions' button
document.getElementById('view-all-btn').addEventListener('click', () => {
  window.location.href = 'predictions.html'; // Ensure this is the correct path to your predictions page
});
