import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temp error handling
    console.error(`${err} 🧨🧨🧨`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 🧨🧨🧨`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //  oldQt * newServings / oldServings = newQt //  2 * 8 /4 = 4
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);
    // console.log(Object.entries(newRecipe));
    // const ingredients = Object.entries(newRecipe)
    //   .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    //   .map(ing => {
    //     // const ingArr = ing[1].replaceAll(' ', '').split(',');
    //     const ingArr = ing[1].split(',').map(el => el.trim());
    //     // if (ingArr.length !== 3)
    //     //   throw new Error(
    //     //     'Wrong ingredient format! Please use the correct format :)'
    //     //   );

    //     const [quantity, unit, description] = ingArr;

    //     return { quantity: quantity ? +quantity : null, unit, description };
    //   });

    const ingredients = [
      {
        quantity: newRecipe.quantity1,
        unit: newRecipe.unit1,
        description: newRecipe.ingredient1,
      },
      {
        quantity: newRecipe.quantity2,
        unit: newRecipe.unit2,
        description: newRecipe.ingredient2,
      },
      {
        quantity: newRecipe.quantity3,
        unit: newRecipe.unit3,
        description: newRecipe.ingredient3,
      },
      {
        quantity: newRecipe.quantity4,
        unit: newRecipe.unit4,
        description: newRecipe.ingredient4,
      },
      {
        quantity: newRecipe.quantity5,
        unit: newRecipe.unit5,
        description: newRecipe.ingredient5,
      },
    ];
    console.log(ingredients);
    // Ingredients format in normal recipe is Ingredients array, positon 0 {quantity: 1, unit: '2',description: '3'}
    // newRecipe is an object that contains properties quantity 1, unit1, description1. Can take these properties and make a new object with the key name changed. Then make an array to ingredients
    // const ingredients = newRecipe.map;

    // In Object.entries array positions: quantity 1 = 6, unit 1 = 7, description = 8

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
      // ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
