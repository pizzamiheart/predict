console.log("Script started");

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

try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

let db, analytics;
try {
    db = firebase.firestore();
    analytics = firebase.analytics();
    console.log("Firebase initialized:", db, analytics);
} catch (error) {
    console.error("Error initializing Firebase services:", error);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired");

    // **b. Modal Close Event Listener**
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideModal);
        console.log("Close modal event listener added");
    } else {
        console.error('Close modal button not found');
    }

    // **c. Consolidated DOMContentLoaded Listener**

    // Music Player Initialization
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

    // Form Submission Handling
    const predictionForm = document.getElementById('prediction-form');
    if (predictionForm) {
        predictionForm.addEventListener('submit', async (event) => {
            console.log("Form submitted");
            event.preventDefault();
            const predictionText = document.getElementById('prediction').value;
            const userName = document.getElementById('name').value || "Anonymous";
            const userLocation = document.getElementById('location').value || "Unknown";

            if (analytics) {
                analytics.logEvent('submit_prediction', {
                    prediction: predictionText,
                    name: userName,
                    location: userLocation
                });
            }

            try {
                const sanitizedPrediction = sanitizeInput(predictionText);
                await db.collection('predictions').add({
                    name: userName,
                    location: userLocation,
                    prediction: sanitizedPrediction,
                    time_stamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                successSound.play();
                if (analytics) {
                    analytics.logEvent('prediction_submitted', { prediction_text: sanitizedPrediction });
                }
                showModal(); // Show modal instead of alert
                event.target.reset();
            } catch (error) {
                console.error('Error submitting prediction:', error);
                alert('Failed to submit prediction: ' + error.message);
            }
        });
        console.log("Submit event listener added");
    } else {
        console.error('Prediction form not found');
    }

    // View All Predictions Button
    const viewAllBtn = document.getElementById('view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            window.location.href = 'predictions.html';
        });
    }

    // Back Button Handling
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Tooltip Functionality
    const backgroundImages = document.querySelectorAll('.background-image');
    const facts = {
        'earth': "New York City only exists on the planet Earth.",
        'hockey-stick': "The first organized indoor hockey game was played in Montreal in 1875. Also, hockey stick is a term used by tech bros to describe failure at the beginning and luck down the road.",
        'basketball': "Basketball was invented by James Naismith in 1891.",
        'bell-pepper': "Bell peppers are fruits, not vegetables!",
        'cowboy': "The term 'cowboy' originated in Ireland.",
        'drake': "Drake started his career as an actor on Degrassi: The Next Generation.",
        'flip-phone': "The first flip phone was introduced by Motorola in 1996.",
        'internet': "The first message sent over the internet was 'LO' - it was supposed to be 'LOGIN' but the system crashed.",
        'ipod': "The iPod was introduced by Apple in 2001.",
        'jeans': "The word 'jeans' comes from the French phrase 'bleu de Gênes', meaning 'blue of Genoa'.",
        'lion': "A group of lions is called a pride."
    };

    backgroundImages.forEach(img => {
        const imgName = img.alt.replace(' ', '-').toLowerCase();
        if (facts[imgName]) {
            img.classList.add('tooltip');
            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltiptext');
            tooltip.textContent = facts[imgName];
            img.appendChild(tooltip);
        }
    });

    // Flip Phone Link Handling
    const flipPhoneLink = document.querySelector('.flip-phone-link');
    if (flipPhoneLink) {
        flipPhoneLink.addEventListener('click', (e) => {
            if (e.target.classList.contains('flip-phone')) {
                window.open(flipPhoneLink.href, '_blank');
            } else {
                e.preventDefault();
            }
        });
    }

    // Typewriter Effect
    const title = document.querySelector('header h1');
    if (title) {
        typeWriter(title, "What will happen in the future?");
    }

    // Placeholder Rotation
    rotatePlaceholder();

    // Modal View All Button
    const viewAllBtnModal = document.getElementById('view-all-btn-modal');
    if (viewAllBtnModal) {
        viewAllBtnModal.addEventListener('click', () => {
            hideModal();
            window.location.href = 'predictions.html';
        });
    }

    // Load Predictions if on predictions.html
    if (window.location.pathname.includes('predictions.html')) {
        loadPredictions();
    }

    console.log("DOMContentLoaded code executed successfully");
});

let lastVisible = null;

async function loadPredictions() {
    const predictionsList = document.getElementById('predictions-list');
    if (predictionsList) {
        let query = db.collection('predictions').orderBy('time_stamp', 'desc').limit(10);

        if (lastVisible) {
            query = query.startAfter(lastVisible);
        }

        try {
            const querySnapshot = await query.get();
            lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

            querySnapshot.forEach(doc => {
                const data = doc.data();
                const locationDisplay = data.location && data.location !== "Unknown" ? `, ${data.location}` : '';
                predictionsList.innerHTML += `
                    <div class="prediction" data-id="${doc.id}">
                        <div class="prediction-header">
                            <span class="prediction-name">${data.name}${locationDisplay}</span>
                            <span class="prediction-date">${data.time_stamp ? data.time_stamp.toDate().toLocaleString() : ''}</span>
                        </div>
                        <div class="prediction-body">${data.prediction}</div>
                    </div>
                `;
            });

            if (!querySnapshot.empty) {
                observer.observe(document.querySelector('.prediction:last-child'));
            }
        } catch (error) {
            console.error('Error loading predictions:', error);
        }
    }
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            loadPredictions();
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
});

// Show Modal Function
function showModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'block';

        // Play sound
        const audio = new Audio('assets/success-sound.mp3');
        audio.play();
    } else {
        console.error('Success modal not found');
    }
}

// Hide Modal Function
function hideModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error('Success modal not found');
    }
}

function typeWriter(element, text, speed = 50) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    element.innerHTML = '';
    type();
}

const placeholders = [
    "By 2031, cows will make their own butter...",
    "We will soon learn that the dress was, in fact, blue...",
    "By 2027, we will be able to communicate with whales...",
    "In 2035, we'll have cities on Mars..."
];

function rotatePlaceholder() {
    const predictionInput = document.getElementById('prediction');
    if (predictionInput) {
        let currentIndex = 0;
        setInterval(() => {
            predictionInput.placeholder = placeholders[currentIndex];
            currentIndex = (currentIndex + 1) % placeholders.length;
        }, 5000); // Change every 5 seconds
    } else {
        console.error('Prediction input not found for placeholder rotation');
    }
}

console.log("End of script reached");

window.onerror = function(message, source, lineno, colno, error) {
   console.error("Global error:", message, "at", source, ":", lineno, ":", colno, "Error:", error);
   return false;
};

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
