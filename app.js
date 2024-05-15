document.getElementById('prediction-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
  
    console.log('Submitting to:', 'https://script.google.com/macros/s/10oC-5pZxvz4rYwPZT3DY7fF-wk3FMve2L5py18eF-2CPXk1Kqwn8koml/exec');
    console.log('Data:', data);
  
    try {
      const response = await fetch('https://script.google.com/macros/s/10oC-5pZxvz4rYwPZT3DY7fF-wk3FMve2L5py18eF-2CPXk1Kqwn8koml/exec', {
        method: 'POST',
        mode: 'cors', // Changed from 'no-cors' to 'cors'
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
  
      const result = await response.json();
      console.log('Submission successful:', result);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting prediction:', error);
      alert('Error submitting prediction: ' + error.message);
    }
  });
  