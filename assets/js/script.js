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

// let categoryInput = $('#categoryInput').attr("value", query);
// console.log(categoryInput);

const foodish = "https://foodish-api.com/api/"

// // a GET request to the API endpoint
// fetch(foodish)
//   .then(response => response.json())
//   .then(data => {
//     // console.log(data);

//     const imgURL = data.image;
//     // console.log(imgURL);
//     query = getCategory(imgURL);
//     // console.log(query);

//     $('#img-main').attr('src', imgURL);

//     $('#categoryInput').attr("value", query);
//   })
//   .catch(error => {
//     // Handle any errors that occurred during the fetch
//     console.error('Error:', error);
//   });

// const getCategory = (str) => {
//   return str.replaceAll("/", " ").split(" ")[4]
// }

const imgMain = $('#img-main');
const categoryInput = $('#categoryInput');

 // Function to fetch a new image from the Foodish API
 const fetchNewImage = () => {
    fetch(foodish)
      .then(response => response.json())
      .then(data => {
        const imgURL = data.image;
        const category = getCategory(imgURL);

        // Update the UI
        imgMain.attr('src', imgURL);
        categoryInput.attr('value', category);
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Error:', error);
      });
  };

  // Initial image fetch
  fetchNewImage();

//   This finds the category name from within image link
  const getCategory = str => {
    return str.replaceAll("/", ' ').split(' ')[4];
  };

  // Event listener for the "Next" button
  $('#next-btn').on('click', fetchNewImage);