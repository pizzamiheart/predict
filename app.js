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
    const successSound = document.getElementById('success-sound');
    const backgroundMusic = document.getElementById('background-music');
    let isMusicPlaying = false;
    let isPlayingPromise = null;

    function toggleMusic() {
        if (isMusicPlaying) {
            if (isPlayingPromise !== null) {
                isPlayingPromise.then(() => {
                    backgroundMusic.pause();
                    isMusicPlaying = false;
                    isPlayingPromise = null;
                }).catch(error => {
                    console.error('Error pausing music:', error);
                });
            } else {
                backgroundMusic.pause();
                isMusicPlaying = false;
            }
        } else {
            isPlayingPromise = backgroundMusic.play().catch(error => {
                console.error('Error playing music:', error);
                isPlayingPromise = null;
            }).finally(() => {
                isMusicPlaying = true;
            });
        }
    }

    const musicPlayer = document.getElementById('music-player');
    if (musicPlayer) {
        musicPlayer.addEventListener('click', toggleMusic);
    } else {
        console.error('Music player element not found');
    }

    setupEventListeners();
});

function setupEventListeners() {
    const predictionForm = document.getElementById('prediction-form');
    if (predictionForm) {
        predictionForm.addEventListener('submit', async (event) => {
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
                playSuccessSound();
                showModal(); // Show modal instead of alert
                event.target.reset();
            } catch (error) {
                console.error('Error submitting prediction:', error);
                alert('Failed to submit prediction: ' + error.message);
            }
        });
    }

    const viewAllBtn = document.getElementById('view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            window.location.href = 'predictions.html';
        });
    }

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    const viewAllBtnModal = document.getElementById('view-all-btn-modal');
    if (viewAllBtnModal) {
        viewAllBtnModal.addEventListener('click', () => {
            hideModal();
            window.location.href = 'predictions.html';
        });
    }

    if (window.location.pathname.includes('predictions.html')) {
        loadPredictions();
    }
}

// Use MutationObserver to handle dynamic changes in the DOM
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            setupEventListeners();
        }
    });
});

// Start observing the target node for configured mutations
observer.observe(document.body, {
    childList: true,
    subtree: true,
});

setupEventListeners();

function playSuccessSound() {
    const successSound = document.getElementById('success-sound');
    if (successSound) {
        successSound.play().catch(error => {
            console.error('Error playing success sound:', error);
        });
    }
}

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
    playSuccessSound();
}

// Hide Modal Function
function hideModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
}
