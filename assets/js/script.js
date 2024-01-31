var apiKey = "08bfac6db5a24fa780d937a91262a007";

var queryURL = "https://api.spoonacular.com/recipes/complexSearch?apiKey=08bfac6db5a24fa780d937a91262a007";


fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })