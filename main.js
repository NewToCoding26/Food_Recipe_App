const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-result');
const container = document.querySelector('.container');
let searchQuery = '';

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  searchQuery = e.target.querySelector('input').value;
  fetchAPI();
});

async function fetchAPI() {
  const baseURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;
  try {
    const response = await fetch(baseURL);
    const data = await response.json();
    generateHTML(data.meals);
  } catch (error) {
    console.error("Error fetching data:", error);
    searchResultDiv.innerHTML = "<h2 style='color: whitesmoke;'>Error loading recipes. Please try again.</h2>";
  }
}

function estimateCalories(meal) {
  if (!meal || !meal.strCategory) return "N/A";
  
  const category = meal.strCategory.toLowerCase();
  let calories = 400;

  if (category.includes("beef") || category.includes("pork")) calories = 600;
  else if (category.includes("chicken") || category.includes("fish")) calories = 450;
  else if (category.includes("vegetarian") || category.includes("salad")) calories = 300;
  else if (category.includes("dessert")) calories = 500;

  return calories.toFixed(0);
}

function generateHTML(results) {
  container.classList.remove("initial");
  
  if (!results) {
    searchResultDiv.innerHTML = "<h2 style='color: whitesmoke;'>No results found!</h2>";
    return;
  }

  let generatedHTML = "";
  results.forEach((result) => {
    generatedHTML += `
      <div class="item">
        <img src="${result.strMealThumb}" alt="${result.strMeal}">
        <div class="flex-container">
          <h1 class="title">${result.strMeal}</h1>
          <a class="view-btn" target="_blank" href="${result.strSource || '#'}">View Recipe</a>
        </div>
        <p class="item-data">Category: ${result.strCategory}</p>
        <p class="item-data">Estimated Calories: ${estimateCalories(result)} kcal</p>
        <p class="item-data">Area: ${result.strArea}</p>
      </div>
    `;
  });
  searchResultDiv.innerHTML = generatedHTML;
}