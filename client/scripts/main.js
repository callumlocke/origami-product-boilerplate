/** @jsx plainJSX */

import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';

// make a quick look-up table for the stories
const storiesData = {};
spreadsheet.stories.forEach(story => {
  storiesData[story.slug] = story;
});


document.addEventListener('DOMContentLoaded', function () {
  // make hover effects work on touch devices
  oHoverable.init();

  // remove the 300ms tap delay on mobile browsers
  attachFastClick(document.body);

  // get the <section class="app"> element
  const app = document.querySelector('.app');

  const pageWrapper = document.querySelector('.page-wrapper');
  const pageWrapper2 = document.querySelector('.page-wrapper-2');


  // make a div to work in, and inject the html from the spreadsheet
  const all = document.createElement('div');
  all.classList.add('all');
  all.innerHTML = spreadsheet.content[0].content;


  // find all the 'story' placeholders in it and replace them with real story views
  const stories = all.querySelectorAll('h1');
  for (let i = 0, l = stories.length; i < l; i++) {
    const placeholder = stories[i];
    const [tag, slug] = placeholder.textContent.split(': ');
    if (tag !== 'STORY') continue;

    const {image, copy} = storiesData[slug];

    let figure;
    const article = (
      <article class="story">
        {figure = (
          <figure class="story__story-figure">
            <img src={image}/>
          </figure>
        )}
      </article>
    );

    figure.addEventListener('click', () => {
      // console.log('click');
      showOverlay(copy);
    });

    all.replaceChild(article, placeholder);
  }

  // append all the content
  app.appendChild(all);


  // also append an overlay
  let overlayContent, closeButton;
  const overlay = (
    <div class="overlay overlay--hidden">
      {overlayContent = <div class="overlay-content">CONTENT</div>}
      {closeButton = <div class="overlay-content__close-button"/>}
    </div>
  );
  closeButton.addEventListener('click', hideOverlay);
  overlay.addEventListener('click', event => {
    if (event.srcElement === overlay) hideOverlay();
  });


  app.appendChild(overlay);


  // functions to show/hide the overlay
  let scrollOffset;
  function showOverlay(copy) {
    // console.log('showOverlay', copy);
    overlayContent.innerHTML = copy;
    overlay.classList.remove('overlay--hidden');

    scrollOffset = document.body.scrollTop;
    pageWrapper2.style.top = '-' + scrollOffset + 'px';
    // pageWrapper.scrollTop = scrollOffset;
    pageWrapper.classList.add('showing-overlay');
  }

  function hideOverlay() {
    overlay.classList.add('overlay--hidden');



    pageWrapper.classList.remove('showing-overlay');

    pageWrapper2.getBoundingClientRect(); // flush paint queue

    document.body.scrollTop = scrollOffset;
    pageWrapper2.style.top = '0';
  }
});
