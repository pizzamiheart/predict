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
      const response = await fetch('https://script.google.com/macros/s/AKfycbyR7NWDQ5EXK0A_a5OCrODpf4q7IYPLjzrTTtpyh0I/dev/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        document.getElementById('prediction-form').reset();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting prediction:', error);
      alert('Error submitting prediction. Please try again.');
    }
  });
  