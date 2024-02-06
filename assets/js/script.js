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
const backBtn = $("#back-btn");

let displayedRecipeImgSrc;
let saveImgSrc;
let saveCategory;
let saveTitle;
let query;
let diet;
let intolerances;
let include;
let exclude;

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
      const category = getCategory(imgURL);

      saveImgSrc = imgURL;
      saveCategory = category;

      // Add history to local storage
      let previousImages = JSON.parse(localStorage.getItem("previousImages")) || [];

      // console.log(previousImages);
      previousImages.push(imgURL);

      localStorage.setItem("previousImages", JSON.stringify(previousImages));

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

// Function to go back to the previous image
const goBack = () => {
  let previousImages = JSON.parse(localStorage.getItem("previousImages")) || [];

  if (previousImages.length === 0) return;

  let previousImgSrc = previousImages.pop();

  localStorage.setItem("previousImages", JSON.stringify(previousImages));

  imgMain.attr("src", previousImgSrc);
};

// This finds the category name from within image link
const getCategory = (str) => {
  return str.replaceAll("/", " ").split(" ")[4];
};

const fetchRecipe = (e) => {
  e.preventDefault();

  const categoryInput = $("#categoryInput").val();
  const dietInput = $("#dietInput").val();
  const intolerancesInput = $("#intoleranceInput").val();
  const includeInput = $("#includeInput").val();
  const excludeInput = $("#excludeInput").val();

  query = categoryInput;
  diet = dietInput;
  intolerances = intolerancesInput;
  include = includeInput;
  exclude = excludeInput;
  const addRecipe = true;
  const nutrition = true;
  const number = 2;
  const API_KEY_1 = "08bfac6db5a24fa780d937a91262a007";
  const API_KEY_2 = "0da42d4e08354eeeaac861bfc5934b79";
  const API_KEY_3 = "a68959599cae4bb19949800689922be7";
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
&apiKey=${API_KEY_3}
`;

  fetch(queryURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
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

      saveTitle = buttonText;

      displayRecipe(steps, title);
    });
  });
};

const displayRecipe = (steps, title) => {
  recipeContainer.empty();
  recipeContainer.removeClass("d-none");
  favouritesBtn.removeClass("d-none");
  formBtn.removeClass("d-none");
  formContainer.addClass("d-none");
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
  updateFavouriteIcon(saveImgSrc);
};

const showForm = () => {
  formContainer.removeClass("d-none");
  recipeOffcanvas.removeClass("w-75");
  recipeOffcanvas.addClass("w-50");
  listContainer.addClass("d-none");
  recipeContainer.addClass("d-none");
  favouritesBtn.addClass("d-none");
  formBtn.addClass("d-none");

  recipeTitle.text("Generate recipe")
};

const addToFavorites = () => {
  const imgSrc = saveImgSrc;
  const recipeImgSrc = displayedRecipeImgSrc;
  const favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  const exists = favourites.some(fav => fav.imgSrc === imgSrc || fav.imgSrc === recipeImgSrc);

  if (exists) {
    $("#liveToast .toast-body").text("Already added!");
  } else {
    const favouriteEl = `
      <button class="favourite-el btn btn-primary mb-2 py-2 position-relative" type="button" data-bs-toggle="offcanvas"
      data-bs-target="#recipe" aria-controls="offcanvasWithBothOptions">
        <img src=${imgSrc} class="img-fave"/>
        <button type="button" class="favourite-delete btn-close position-absolute top-25"></button>
      </button>
    `;

    favouritesBody.prepend(favouriteEl);

    saveFavouritesToLocalStorage();
    updateFavouriteIcon(imgSrc);

    $("#liveToast .toast-body").text("Added to favourites!");
  }

  showToast();
};


const saveFavouritesToLocalStorage = () => {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  favourites.unshift({
    imgSrc: saveImgSrc,
    category: saveCategory,
    title: saveTitle,
    query: query,
    diet: diet,
    intolerances: intolerances,
    include: include,
    exclude: exclude
  });

  localStorage.setItem("favourites", JSON.stringify(favourites));
}

const loadFavouritesFromLocalStorage = () => {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  favourites.forEach(favourite => {
    const favouriteEl = `
        <button class="favourite-el btn btn-primary mb-2 py-2" type="button" data-bs-toggle="offcanvas"
        data-bs-target="#recipe" aria-controls="offcanvasWithBothOptions">
          <img src=${favourite.imgSrc} class="img-fave"/>
        </button>
      `;
    favouritesBody.append(favouriteEl);
  });
};

loadFavouritesFromLocalStorage();

const updateFavouriteIcon = (imgSrc) => {
  const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  let isFavorite = favourites.some(fav => fav.imgSrc === imgSrc);

  if (isFavorite) {
    $("#favourite-icon").addClass("text-danger");
  } else {
    $("#favourite-icon").removeClass("text-danger");
  }
};

const displayFavoriteRecipe = (favourite) => {
  const { title, query, diet, intolerances, include, exclude, imgSrc } = favourite;

  displayedRecipeImgSrc = imgSrc;

  const addRecipe = true;
  const nutrition = true;
  const number = 2;
  const API_KEY_1 = "08bfac6db5a24fa780d937a91262a007";
  const API_KEY_2 = "0da42d4e08354eeeaac861bfc5934b79";
  const API_KEY_3 = "a68959599cae4bb19949800689922be7";
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
&apiKey=${API_KEY_3}
  `;

  fetch(queryURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const recipe = data.results.find((recipe) => recipe.title === title);
      const steps = recipe.analyzedInstructions;
      console.log(steps);
      displayRecipe(steps, title);
      updateFavouriteIcon(imgSrc);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Event listeners
nextBtn.on("click", fetchNewImage);
backBtn.on("click", goBack);
form.on("submit", (e) => fetchRecipe(e));
generateBtn.on("click", showForm);
formBtn.on("click", showForm);
favouritesBtn.on("click", () => {
  addToFavorites();
  showToast();
});
$(".favourite-el").on("click", (e) => {
  const imgSrc = $(e.currentTarget).find("img").attr("src");
  const favourite = JSON.parse(localStorage.getItem("favourites")).find((fav) => fav.imgSrc === imgSrc);
  displayFavoriteRecipe(favourite);
});
