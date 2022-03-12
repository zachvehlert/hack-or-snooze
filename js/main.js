'use strict';

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $('body');

const $storiesLoadingMsg = $('#stories-loading-msg');
const $allStoriesList = $('#all-stories-list');
const $favoritesContainer = $('#favorites-container');

const $loginForm = $('#login-form');
const $signupForm = $('#signup-form');
const $submitStoryContainer = $('#submit-story-container');

const $navLogin = $('#nav-login');
const $navUserProfile = $('#nav-user-profile');
const $navLogOut = $('#nav-logout');
const $navSubmitStory = $('#nav-submit-story');
const $navFavorites = $('#nav-favorites');

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [$allStoriesList, $loginForm, $signupForm];
  components.forEach((c) => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug('start');

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

$(start);

$body.on('click', '.favoriteButton', function (evt) {
  const id = $(evt.target).parent().attr('id');

  function idMatch(story) {
    return story.storyId == id;
  }

  if (!currentUser.favorites.some(idMatch)) {
    $(evt.target).html('&#10029');
    $(evt.target).parent().clone().appendTo($('#favorites-list'));
    currentUser.favorite(currentUser, id);
  } 
  
  else {
    $(evt.target).html('&#10025');
    currentUser.favorites.forEach((story) => {
      if (story.storyId == id) {
        $(`#favorites-list #${id}`).remove();
      }
    });
    $(`#all-stories-list #${id} p`).html('&#10025');
    currentUser.unfavorite(currentUser, id);
  }
});
