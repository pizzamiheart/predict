const apiEndpoint = 'https://script.google.com/macros/s/AKfycbxgYEn094CkbwdZaYRmkDt_Rp5bVNYvbsoln9koOfUxVaRbrx-rv14nctspsDqQ-iGI/exec';

async function submitPrediction(predictionData) {
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(predictionData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error submitting prediction:', error);
        throw error;  // Rethrow to handle it in the caller
    }
}

async function loadPredictions() {
    try {
        const response = await fetch(apiEndpoint);
        return await response.json();
    } catch (error) {
        console.error('Error loading predictions:', error);
        throw error;
    }
}

export { submitPrediction, loadPredictions };
