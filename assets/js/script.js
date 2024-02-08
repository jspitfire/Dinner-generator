// HTML elements
const elements = {
  imgMain: $("#img-main"),
  listContainer: $("#list-container"),
  recipeContainer: $("#recipe-container"),
  formContainer: $("#form-container"),
  generateBtn: $("#generate-btn"),
  formBtn: $("#form-btn"),
  recipeOffcanvas: $("#recipe-offcanvas"),
  categoryName: $("#category-name"),
  recipeTitle: $("#recipe-title"),
  favouritesBtn: $("#favourites-btn"),
  favouritesBody: $("#favourites-body"),
  form: $("#form"),
  nextBtn: $("#next-btn"),
  backBtn: $("#back-btn"),
  closeRecipeBtn: $("#recipe-close"),
  closeFavouriteBtn: $("#favourite-close"),
  openFavouritesBtn: $("#open-favourites"),
};

// Global variables storing values to be used throughout the app
let displayedRecipeImgSrc;
let saveImgSrc;
let saveCategory;
let saveTitle;
let query;
let diet;
let intolerances;
let include;
let exclude;

// Notification popups when saving to favourites
const favouritesToast = new bootstrap.Toast(document.getElementById('liveToast'));

const showToast = () => {
  favouritesToast.show();
};

// Function to extract category name from image link
const getCategory = (str) => {
  return str.replaceAll("/", " ").split(" ")[4];
};

// Initialize the app
const initializeApp = () => {
  fetchNewImage();
  loadFavouritesFromLocalStorage();
  addEventListeners();
};

// Fetch new image from the Foodish API
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
      previousImages.push(imgURL);
      localStorage.setItem("previousImages", JSON.stringify(previousImages));

      // Update the UI
      elements.imgMain.attr("src", imgURL);
      elements.categoryName.text(`${category}`);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// Function to render previous image
const goBack = () => {
  let previousImages = JSON.parse(localStorage.getItem("previousImages")) || [];

  if (previousImages.length === 0) return;
  let previousImgSrc = previousImages[previousImages.length - 2];
  previousImages.pop();
  localStorage.setItem("previousImages", JSON.stringify(previousImages));

  const category = getCategory(previousImgSrc);

  saveImgSrc = previousImgSrc;
  saveCategory = category;

  elements.imgMain.attr("src", previousImgSrc);
};

// Fetch recipes from spoonacular API
const fetchRecipe = (e) => {
  e.preventDefault();

  const dietInput = $("#dietInput").val();
  const intolerancesInput = $("#intoleranceInput").val();
  const includeInput = $("#includeInput").val();
  const excludeInput = $("#excludeInput").val();

  query = saveCategory;
  diet = dietInput;
  intolerances = intolerancesInput;
  include = includeInput;
  exclude = excludeInput;
  const addRecipe = true;
  const nutrition = true;
  const number = 2;
  const API_KEY_1 = "08bfac6db5a24fa780d937a91262a007";
  const API_KEY_2 = "0da42d4e08354eeeaac861bfc5934b79";
  const API_KEY_3 = "a720e49ef1384305a7eec6386dfe23b6";
  const queryURL = `
https://api.spoonacular.com/recipes/complexSearch?
&query=${query}
&diet=${diet}
&intolerances=${intolerances}
&includeIngredients=${include}
&excludeIngredients=${exclude}
&addRecipeInformation=${addRecipe}
&addRecipeNutrition=${nutrition}
&apiKey=${API_KEY_1}
`;
  // &number=${number}

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

// Display recipe titles as buttons
const displayRecipeTitles = (titles, data) => {
  elements.listContainer.empty();
  elements.listContainer.removeClass("d-none");
  elements.formContainer.addClass("d-none");

  const dataArray = data.results; // Convert results to an array

  titles.forEach((title) => {
    const button = $("<button>");
    button.addClass("btn btn-primary w-100 mb-2");
    button.attr("type", "button");
    button.text(title);
    elements.listContainer.append(button);

    button.on("click", (e) => {
      const buttonText = e.target.innerText;
      const recipe = dataArray.find((recipe) => buttonText === recipe.title);
      const steps = recipe.analyzedInstructions;

      saveTitle = buttonText;

      displayRecipe(steps, title);
      updateFavouriteIcon(saveImgSrc);
    });
  });
};

// Display recipe when button clicked
const displayRecipe = (steps, title) => {
  elements.recipeContainer.empty();
  elements.recipeContainer.removeClass("d-none");
  elements.favouritesBtn.removeClass("d-none");
  elements.formBtn.removeClass("d-none");
  elements.formContainer.addClass("d-none");
  elements.listContainer.addClass("d-none");
  elements.recipeOffcanvas.addClass("w-75");
  elements.recipeTitle.text(title);

  const recipeOl = $("<ol>");

  steps.forEach((instruction) => {
    instruction.steps.forEach((step) => {
      const recipeStepsLi = $("<li>").text(step.step);
      recipeOl.append(recipeStepsLi);
    });
  });

  elements.recipeContainer.append(recipeOl);
  updateFavouriteIcon(saveImgSrc);
};

const showForm = (saveCategory) => {
  elements.recipeTitle.html(`Generate <span id="category-name">${saveCategory}</span> recipe`);
  elements.formContainer.removeClass("d-none");
  elements.recipeOffcanvas.removeClass("w-75");
  elements.recipeOffcanvas.addClass("w-50");
  elements.listContainer.addClass("d-none");
  elements.recipeContainer.addClass("d-none");
  elements.favouritesBtn.addClass("d-none");
  elements.formBtn.addClass("d-none");
  elements.imgMain.addClass("filter-blur");
};

const addToFavorites = () => {
  const imgSrc = saveImgSrc;
  const recipeImgSrc = displayedRecipeImgSrc;
  const favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  const exists = favourites.some(fav =>
    fav.imgSrc === imgSrc || fav.imgSrc === recipeImgSrc || fav.title === saveTitle);

  if (exists) {
    $("#liveToast .toast-body").text("Already added!");
    $("#liveToast").removeClass("text-bg-success");
    $("#liveToast").addClass("text-bg-warning");
    $("#liveToast .btn-close").removeClass("btn-close-white");
    $("#liveToast .btn-close").addClass("btn-close-black");
  } else {
    saveFavouritesToLocalStorage();
    loadFavouritesFromLocalStorage();
    updateFavouriteIcon(imgSrc);

    $("#liveToast .toast-body").text("Added to favourites!");
    $("#liveToast").removeClass("text-bg-warning");
    $("#liveToast").addClass("text-bg-success");
    $("#liveToast .btn-close").removeClass("btn-close-black");
    $("#liveToast .btn-close").addClass("btn-close-white");
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
};

const loadFavouritesFromLocalStorage = () => {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  elements.favouritesBody.empty();

  favourites.forEach((favourite) => {
    const { imgSrc, title } = favourite;
    const favouriteEl = `
      <div id="favourite-item__wrapper" class="row">
        <p class="favourites-list__title">${title}</P>
        <button class="favourite-el btn btn-success mb-3 py-2" type="button" data-bs-toggle="offcanvas"
        data-bs-target="#recipe-offcanvas" aria-controls="offcanvasWithBothOptions">
          <img src=${imgSrc} class="img-fave"/>
        </button>
        <button type="button" class="favourite-delete fa-solid fa-trash-can fs-4 text-danger"></button>
      </div>
    `;
    elements.favouritesBody.append(favouriteEl);
  });
};

const updateFavouriteIcon = (imgSrc) => {
  const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  let isFavorite = favourites.some(fav =>
    fav.imgSrc === imgSrc || fav.imgSrc === saveImgSrc || fav.title === saveTitle);

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
  const API_KEY_3 = "a720e49ef1384305a7eec6386dfe23b6";
  const queryURL = `
https://api.spoonacular.com/recipes/complexSearch?
&query=${query}
&diet=${diet}
&intolerances=${intolerances}
&includeIngredients=${include}
&excludeIngredients=${exclude}
&addRecipeInformation=${addRecipe}
&addRecipeNutrition=${nutrition}
&apiKey=${API_KEY_1}
`;
  // &number=${number}

  fetch(queryURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const recipe = data.results.find((recipe) => recipe.title === title);
      const steps = recipe.analyzedInstructions;
      displayRecipe(steps, title);
      updateFavouriteIcon(imgSrc);
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteFavourites = (e) => {
  const imgSrc = $(e.target).parent().find("img.img-fave").attr("src");
  const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  const indexToDelete = favourites.findIndex(fav => fav.imgSrc === imgSrc);

  if (indexToDelete !== -1) {
    favourites.splice(indexToDelete, 1);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    $(e.currentTarget).closest(".favourite-el").remove();
    updateFavouriteIcon(imgSrc);
    loadFavouritesFromLocalStorage();
  }
};

const addEventListeners = () => {
  elements.nextBtn.on("click", fetchNewImage);
  elements.backBtn.on("click", goBack);
  elements.form.on("submit", (e) => fetchRecipe(e));
  elements.generateBtn.on("click", () => {
    showForm(saveCategory);
  });
  elements.formBtn.on("click", () => {
    showForm(saveCategory);
  });
  elements.favouritesBtn.on("click", () => {
    addToFavorites();
    showToast();
  });
  elements.openFavouritesBtn.on("click", () => {
    elements.imgMain.addClass("filter-blur");
  });
  elements.closeRecipeBtn.on("click", () => {
    elements.imgMain.removeClass("filter-blur");
  });
  elements.closeFavouriteBtn.on("click", () => {
    elements.imgMain.removeClass("filter-blur");
  });
  $("body").on("click", ".favourite-el", (e) => {
    const imgSrc = $(e.currentTarget).find("img").attr("src");
    const favourite = JSON.parse(localStorage.getItem("favourites")).find((fav) => fav.imgSrc === imgSrc);
    displayFavoriteRecipe(favourite);
  });
  $("body").on("click", ".favourite-delete", (e) => {
    deleteFavourites(e);
  });
};

// Initialize the app
initializeApp();