const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sanitizePrediction = functions.firestore
    .document('predictions/{predictionId}')
    .onCreate((snap, context) => {
        const prediction = snap.data();
        const sanitizedPrediction = prediction.prediction.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return snap.ref.set({ prediction: sanitizedPrediction }, { merge: true });
    });