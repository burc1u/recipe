import * as model from "./model.js"
import recipeView from "./views/viewRecipe.js"
import searchView from "./views/searchView.js"
import resultsView from "./views/resultsView.js"
import bookmarksView from "./views/bookmarksView.js"
import addRecipeView from "./views/addRecipeView.js"
import { MODAL_CLOSE_SEC } from "./config.js"
import paginationView from "./views/paginationView.js"

//for support on older browsers
// import "core-js/stable"
// import "regenerator-runtime/runtime"
//.. parent folder

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept()
// }

const ctrlRecipes = async function () {
  try {
    //resultsView.renderSpinner()
    const id = window.location.hash.slice(1)
    if (!id) return
    recipeView.renderSpinner()

    //update results to mark selected search result
    resultsView.update(model.getSearchResultPage())

    bookmarksView.update(model.state.bookmarks)

    //loading recipe

    await model.loadRecipe(id)
    const { recipe } = model.state

    //render recipe

    recipeView.render(model.state.recipe)
  } catch (err) {
    alert(err)
    recipeView.renderError()
  }
}

const ctrlSearchResults = async function () {
  try {
    resultsView.renderSpinner()
    const query = searchView.getQuery()
    if (!query) return

    await model.loadSearchResults(query)

    //resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultPage())
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err)
  }
}

const ctrlServings = function (newServings) {
  model.updateServings(newServings)
  // recipeView.render(model.state.recipe)
  // recipeView.render(model.state.recipe)
  //console.log("!!!!", model.state.recipe)
  recipeView.update(model.state.recipe)
}

const ctrlPagination = function (goToPage) {
  //render new results
  resultsView.render(model.getSearchResultPage(goToPage))
  paginationView.render(model.state.search)
}

const ctrlAddBookmark = function () {
  //add or remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)
  //update recipe view
  recipeView.update(model.state.recipe)

  //render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const ctrlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner()

    //upload recipe
    // debugger
    await model.uploadRecipe(newRecipe)

    //render recipe
    recipeView.render(model.state.recipe)

    //success message
    addRecipeView.renderMessage()

    //render bookmark view
    bookmarksView.render(model.state.bookmarks)

    //change id in url
    window.history.pushState(null, "", `#${model.state.recipe.id}`) //state,title,url

    //close form
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error(err)
    addRecipeView.renderError(err.message)
  }
}

const ctrlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

//this method is a subscriber
const init = function () {
  bookmarksView.addHandlerRender(ctrlBookmarks)

  recipeView.addHandlerRender(ctrlRecipes)

  recipeView.addHandlerUpdateServings(ctrlServings)

  recipeView.addHandlerBookmark(ctrlAddBookmark)

  searchView.addHandlerSearch(ctrlSearchResults)

  paginationView.addHandlerClick(ctrlPagination)

  addRecipeView.addHandlerUpload(ctrlAddRecipe)
  //ctrlServings()
}
init()
//!improve search subst in st
//! more ing numbers
//!clear all bookmarks
