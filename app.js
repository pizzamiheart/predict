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

// Function to animate the cowboy
function animateCowboy() {
    const lasso = document.getElementById('lasso');
    lasso.style.animation = 'throwLasso 2s forwards';
}

// Function to display success message
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    const successSound = document.getElementById('success-sound');
    modal.style.display = 'block';
    successSound.play();
    animateCowboy();

    // Add blur effect to the background
    document.body.classList.add('blur');

    // Event listener for the View All Predictions button
    document.getElementById('view-all-predictions-btn').addEventListener('click', () => {
        window.location.href = 'predictions.html';
    });
}

// Event listener for form submission
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
            showSuccessModal();
            event.target.reset(); // Clear form after submission
        } catch (error) {
            console.error('Error submitting prediction:', error);
            alert('Failed to submit prediction: ' + error.message);
        }
    });
}

// Event listener for the "View All Predictions" button
if (document.getElementById('view-all-btn')) {
    document.getElementById('view-all-btn').addEventListener('click', () => {
        window.location.href = 'predictions.html';
    });
}

// Event listener for the back button on predictions page
if (document.getElementById('back-btn')) {
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Function to load and display predictions
function loadPredictions() {
    const predictionsContainer = document.getElementById('predictions-container');
    if (predictionsContainer) {
        db.collection('predictions').orderBy('time_stamp', 'desc').get().then(querySnapshot => {
            predictionsContainer.innerHTML = '';
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const date = data.time_stamp ? data.time_stamp.toDate() : new Date();
                const dateString = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

                const predictionDiv = document.createElement('div');
                predictionDiv.className = 'prediction';

                predictionDiv.innerHTML = `
                    <div class="prediction-header">
                        <div class="prediction-name">${data.name || 'Anonymous'}, ${data.location || 'Unknown'}</div>
                        <div class="prediction-date">${dateString}</div>
                    </div>
                    <div class="prediction-body">${data.prediction}</div>
                `;

                predictionsContainer.appendChild(predictionDiv);
            });
        }).catch(error => {
            console.error('Error loading predictions:', error);
        });
    }
}

// Call the function to load predictions when the predictions page is loaded
document.addEventListener('DOMContentLoaded', loadPredictions);
