let query = "";
let diet = "";
let intolerances = "";
let include = "";
let exclude = "";
const addRecipe = true;
const nutrition = true;
const API_KEY = "08bfac6db5a24fa780d937a91262a007";
const queryURL =
`
https://api.spoonacular.com/recipes/complexSearch?
&query=${query}
&diet=${diet}
&intolerances=${intolerances}
&includeIngredients=${include}
&excludeIngredients=${exclude}
&addRecipeInformation=${addRecipe}
&addRecipeNutrition=${nutrition}
&apiKey=${API_KEY}
`;

// fetch(queryURL)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data);
//   })

const foodish = "https://foodish-api.com/api/"

// a GET request to the API endpoint
fetch(foodish)
  .then(response => response.json())
  .then(data => {
    // Log the image URL from the response

    console.log(data);
    // console.log('Image URL:', data.image);

    const image = data.image

    $('#img-main').attr('src', image);
  })

  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Error:', error);
  });
