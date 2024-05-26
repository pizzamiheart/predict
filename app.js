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
    let playPromise = null;

    function toggleMusic() {
        console.log("Boombox clicked");

        if (isMusicPlaying) {
            console.log("Pausing music");
            if (playPromise !== null) {
                playPromise.then(() => {
                    backgroundMusic.pause();
                    isMusicPlaying = false;
                    playPromise = null;
                    console.log("Music paused");
                }).catch(error => {
                    console.error('Error pausing music:', error);
                });
            } else {
                backgroundMusic.pause();
                isMusicPlaying = false;
                console.log("Music paused immediately");
            }
        } else {
            console.log("Playing music", backgroundMusic.src);
            playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Music is playing");
                    isMusicPlaying = true;
                }).catch(error => {
                    console.error('Error playing music:', error);
                });
            } else {
                console.error('playPromise is undefined');
            }
        }
    }

    const musicPlayer = document.getElementById('music-player');
    console.log("Music Player Element:", musicPlayer);
    if (musicPlayer) {
        musicPlayer.addEventListener('click', toggleMusic);
        console.log("Event listener added to music player");
    } else {
        console.error('Music player element not found');
    }

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
        setupInfiniteScroll(); // Added call to setupInfiniteScroll
    }
});

// Added function for infinite scroll
function setupInfiniteScroll() {
    let page = 1;
    const limit = 10;
    let loading = false;
    const predictionsContainer = document.querySelector('.predictions-container');

    const loadPredictions = async () => {
        if (loading) return;
        loading = true;

        try {
            const querySnapshot = await db.collection('predictions')
                .orderBy('time_stamp', 'desc')
                .limit(limit)
                .startAfter((page - 1) * limit)
                .get();
            
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const predictionElement = document.createElement('div');
                predictionElement.className = 'prediction';
                predictionElement.innerHTML = `
                    <div class="prediction-header">
                        <span class="prediction-name">${data.name}, ${data.location}</span>
                        <span class="prediction-date">${data.time_stamp ? data.time_stamp.toDate().toLocaleString() : ''}</span>
                    </div>
                    <div class="prediction-body">${data.prediction}</div>
                `;
                predictionsContainer.appendChild(predictionElement);
            });

            if (querySnapshot.size < limit) {
                window.removeEventListener('scroll', handleScroll);
            } else {
                page++;
            }
        } catch (error) {
            console.error('Error loading predictions:', error);
        }

        loading = false;
    };

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
            loadPredictions();
        }
    };

    window.addEventListener('scroll', handleScroll);
    loadPredictions(); // Initial load
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
    const audio = new Audio('assets/success-sound.mp3');
    audio.play();
}

// Hide Modal Function
function hideModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
}

// Add the close button functionality
document.addEventListener('DOMContentLoaded', () => {
    const closeModalButton = document.querySelector('.close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', hideModal);
    }
});
