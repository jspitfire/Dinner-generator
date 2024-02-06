const imgMain = $("#img-main");
const categoryInput = $("#categoryInput");
const listContainer = $("#list-container");
const recipeContainer = $("#recipe-container");
const formContainer = $("#form-container");
const generateBtn = $("#generate-btn");
const formBtn = $("#form-btn")
const recipeOffcanvas = $("#recipe");
const recipeTitle = $("#recipe-title");
const favouritesBtn = $("#favourites-btn");
const favouritesBody = $("#favourites-body");
const form = $("#form");
const nextBtn = $("#next-btn");

let imgSrc;

const favouritesToast = new bootstrap.Toast(document.getElementById('liveToast'));

const showToast = () => {
  favouritesToast.show();
};

// Function to fetch a new image from the Foodish API
const fetchNewImage = () => {
  const foodish = "https://foodish-api.com/api/";

  fetch(foodish)
    .then((response) => response.json())
    .then((data) => {
      const imgURL = data.image;
      imgSrc = imgURL;
      const category = getCategory(imgURL);

      // Update the UI
      imgMain.attr("src", imgURL);
      categoryInput.attr("value", category);
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      console.error("Error:", error);
    });
};

// Initial image fetch
fetchNewImage();

//   This finds the category name from within image link
const getCategory = (str) => {
  return str.replaceAll("/", " ").split(" ")[4];
};

const fetchRecipe = (e) => {
  e.preventDefault();

  // const form = e.target;
  const categoryInput = $("#categoryInput").val();
  const dietInput = $("#dietInput").val();
  const intolerancesInput = $("#intoleranceInput").val();
  const includeInput = $("#includeInput").val();
  const excludeInput = $("#excludeInput").val();

  let query = categoryInput;
  let diet = dietInput;
  let intolerances = intolerancesInput;
  let include = includeInput;
  let exclude = excludeInput;
  const addRecipe = true;
  const nutrition = true;
  const number = 2;
  const API_KEY_1 = "08bfac6db5a24fa780d937a91262a007";
  const API_KEY_2 = "0da42d4e08354eeeaac861bfc5934b79";
  const queryURL = `
https://api.spoonacular.com/recipes/complexSearch?
&query=${query}
&diet=${diet}
&intolerances=${intolerances}
&includeIngredients=${include}
&excludeIngredients=${exclude}
&addRecipeInformation=${addRecipe}
&addRecipeNutrition=${nutrition}
&number=${number}
&apiKey=${API_KEY_1}
`;

  console.log(queryURL);

  fetch(queryURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      //pull out recipe from data
      const titles = data.results.map((recipe) => recipe.title);
      displayRecipeTitles(titles, data, query);
    })
    .catch((error) => {
      console.log(error);
    });
};

// Function to display recipe titles as buttons
const displayRecipeTitles = (titles, data, query) => {
  listContainer.empty();
  listContainer.removeClass("d-none");
  formContainer.addClass("d-none");
  recipeTitle.text(`Generate ${query} recipe`);

  const dataArray = data.results; // Convert data.results to an array

  titles.forEach((title) => {
    const button = $("<button>");
    button.addClass("btn btn-primary w-100 mb-2");
    button.attr("type", "button");
    button.text(title);
    listContainer.append(button);

    button.on("click", (e) => {
      e.preventDefault();
      const buttonText = e.target.innerText;
      const recipe = dataArray.find((recipe) => buttonText === recipe.title);
      const steps = recipe.analyzedInstructions;
      console.log(steps);

      displayRecipe(steps, title);
    });
  });
};

const displayRecipe = (steps, title) => {
  recipeContainer.empty();
  recipeContainer.removeClass("d-none");
  favouritesBtn.removeClass("d-none");
  formBtn.removeClass("d-none");
  listContainer.addClass("d-none");
  recipeOffcanvas.addClass("w-75");
  recipeTitle.text(title);

  const recipeOl = $("<ol>");

  steps.forEach((instruction) => {
    instruction.steps.forEach((step) => {
      const recipeStepsLi = $("<li>").text(step.step);
      recipeOl.append(recipeStepsLi);
    });
  });

  recipeContainer.append(recipeOl);
};

const showForm = () => {
  formContainer.removeClass("d-none");
  recipeOffcanvas.removeClass("w-75");
  recipeOffcanvas.addClass("w-25");
  listContainer.addClass("d-none");
  recipeContainer.addClass("d-none");
  favouritesBtn.addClass("d-none");
  formBtn.addClass("d-none");

  recipeTitle.text("Generate recipe")
};

const addToFavorites = (imgSrc) => {
  const favouriteEl =
    `
  <button id="favourite-el" class="btn btn-primary mb-2 py-2" type="button" data-bs-toggle="offcanvas"
  data-bs-target="#recipe" aria-controls="offcanvasWithBothOptions">
    <img src=${imgSrc} class="img-fave"/>
  </button>
  `

  favouritesBody.append(favouriteEl);
};

// Event listeners
nextBtn.on("click", fetchNewImage);
form.on("submit", (e) => fetchRecipe(e));
generateBtn.on("click", showForm);
formBtn.on("click", showForm);
favouritesBtn.on("click", () => {
  addToFavorites(imgSrc);
  showToast();
});