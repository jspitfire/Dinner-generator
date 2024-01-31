// a GET request to the API endpoint
fetch('https://foodish-api.com/api/')
  .then(response => response.json())
  .then(data => {
    // Log the image URL from the response
    console.log('Image URL:', data.image);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Error:', error);
  });