'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <p class="favoriteButton">&#10025;</p>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug('putStoriesOnPage');

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitNewStory(){
  const $author = $('#author');
  const $title = $('#title');
  const $url = $('#url');

  const storyObj = {
    author: $author.val(),
    title: $title.val(),
    url: $url.val()
  }

  await storyList.addStory(currentUser, storyObj);
  storyList = await StoryList.getStories()
  putStoriesOnPage();
}

$('.new-story-submit').on('click', submitNewStory)

function updateFavoritesUI(){
  for(let favoriteStory of currentUser.favorites){
    let storyId = favoriteStory.storyId;
    storyList.stories.forEach((story) => {
      if(story.storyId == storyId){
        $(`#${storyId} p`).html('&#10029');
        $(`#${storyId}`).clone().appendTo($('#favorites-list'));
      }
    })
  }
}
