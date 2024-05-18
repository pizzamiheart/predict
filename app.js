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
  
  document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('prediction-form')) {
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
                      time_stamp: firebase.firestore.FieldValue.serverTimestamp()
                  });
                  alert('Prediction submitted successfully!');
                  event.target.reset();
              } catch (error) {
                  console.error('Error submitting prediction:', error);
                  alert('Failed to submit prediction: ' + error.message);
              }
          });
      }
  
      if (document.getElementById('view-all-btn')) {
          document.getElementById('view-all-btn').addEventListener('click', () => {
              window.location.href = 'predictions.html';
          });
      }
  
      if (document.getElementById('back-btn')) {
          document.getElementById('back-btn').addEventListener('click', () => {
              window.location.href = 'index.html';
          });
      }
  
      if (window.location.pathname.includes('predictions.html')) {
          loadPredictions();
      }
  });
  
  function loadPredictions() {
      const predictionsList = document.getElementById('predictions-list');
      if (predictionsList) {
          db.collection('predictions').orderBy('time_stamp', 'desc').get().then(querySnapshot => {
              predictionsList.innerHTML = '';
              querySnapshot.forEach(doc => {
                  const data = doc.data();
                  predictionsList.innerHTML += `
                      <div class="prediction">
                          <div class="prediction-header">
                              <span class="prediction-name">${data.name}, ${data.location}</span>
                              <span class="prediction-date">${data.time_stamp ? data.time_stamp.toDate().toLocaleString() : ''}</span>
                          </div>
                          <div class="prediction-body">${data.prediction}</div>
                      </div>
                  `;
              });
          }).catch(error => {
              console.error('Error loading predictions:', error);
          });
      }
  }