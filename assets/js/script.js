let query = "";
let diet = "";
let include = "";
let exclude = "";
let intolerances = "";
let addRecipe = true;
const apiKey = "08bfac6db5a24fa780d937a91262a007";
var queryURL =
  `
https://api.spoonacular.com/recipes/complexSearch?&
query=${query}
&diet=${diet}
&includeIngredients=${include}
&excludeIngredients=${exclude}
&intolerances=${intolerances}
&addRecipeInformation=${addRecipe}
&apiKey=${apiKey}
`;


fetch(queryURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  })

const foodish = "https://foodish-api.com/api/"

// a GET request to the API endpoint
fetch(foodish)
  .then(response => response.json())
  .then(data => {
    // Log the image URL from the response
    console.log('Image URL:', data.image);
    $('#image').attr('src', data.image);
  })

  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Error:', error);
  });
