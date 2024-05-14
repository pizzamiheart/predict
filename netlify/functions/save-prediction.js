document.getElementById('prediction-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const prediction = document.getElementById('prediction').value;
  const name = document.getElementById('name').value;
  const location = document.getElementById('location').value;

  const formData = {
      prediction,
      name,
      location,
  };

  try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxgYEn094CkbwdZaYRmkDt_Rp5bVNYvbsoln9koOfUxVaRbrx-rv14nctspsDqQ-iGI/exec', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
          alert('Prediction submitted successfully!');
          document.getElementById('prediction-form').reset();
      } else {
          alert(`Error: ${result.error}`);
      }
  } catch (error) {
      console.error('Error submitting prediction:', error);
      alert('Error submitting prediction. Please try again.');
  }
});

document.getElementById('view-all-btn').addEventListener('click', () => {
  window.location.href = 'predictions.html';
});

async function loadPredictions() {
  try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxgYEn094CkbwdZaYRmkDt_Rp5bVNYvbsoln9koOfUxVaRbrx-rv14nctspsDqQ-iGI/exec');
      const predictions = await response.json();

      const predictionsList = document.getElementById('predictions-list');
      predictionsList.innerHTML = '';

      predictions.forEach((prediction, index) => {
          const predictionItem = document.createElement('li');
          predictionItem.innerHTML = `
              <strong>${index + 1}. ${prediction.prediction}</strong>
              <br>by ${prediction.name || 'Anonymous'} from ${prediction.location || 'Unknown'}
          `;
          predictionsList.appendChild(predictionItem);
      });
  } catch (error) {
      console.error('Error loading predictions:', error);
  }
}

if (document.getElementById('predictions-list')) {
  loadPredictions();
}
