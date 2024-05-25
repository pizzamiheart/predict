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

const successSound = document.getElementById('success-sound');
const backgroundMusic = document.getElementById('background-music');
let isMusicPlaying = false;

function toggleMusic() {
    if (isMusicPlaying) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play().catch(error => {
            console.error('Error playing music:', error);
        });
    }
    isMusicPlaying = !isMusicPlaying;
}

const musicPlayer = document.getElementById('music-player');
if (musicPlayer) {
    musicPlayer.addEventListener('click', toggleMusic);
} else {
    console.error('Music player element not found');
}

function setupEventListeners() {
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
                successSound.play();
                showModal(); // Show modal instead of alert
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

    if (document.getElementById('view-all-btn-modal')) {
        document.getElementById('view-all-btn-modal').addEventListener('click', () => {
            hideModal();
            window.location.href = 'predictions.html';
        });
    }

    if (window.location.pathname.includes('predictions.html')) {
        loadPredictions();
    }
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            setupEventListeners();
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});

setupEventListeners();

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

// Show Modal Function
function showModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'block';

    // Play sound
    const audio = new Audio('assets/success-sound.mp3');
    audio.play();
}

// Hide Modal Function
function hideModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
}
