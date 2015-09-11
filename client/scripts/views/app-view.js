/** @jsx plainJSX */

import View from 'ampersand-view';
import ramjet from 'ramjet';


const ENABLE_ANIMATION = screen.width > 400 && !(
  navigator.userAgent.indexOf('iPad') > -1 ||
  navigator.userAgent.indexOf('iPhone') > -1 ||
  navigator.userAgent.indexOf('iPod') > -1 ||
  navigator.userAgent.indexOf('Android') > -1
);

if (!ENABLE_ANIMATION) {
  document.documentElement.classList.add('.no-transitions');
}

// make a quick look-up table for the stories
const storiesData = {};
spreadsheet.stories.forEach(story => {
  storiesData[story.slug] = story;
});


export default View.extend({
  render() {
    const content = <div class="content"/>;
    content.innerHTML = spreadsheet.content[0].content;

    // find all the 'story' placeholders in it and replace them with real story views
    const stories = content.querySelectorAll('h1');
    for (let i = 0, l = stories.length; i < l; i++) {
      const placeholder = stories[i];
      const [tag, slug] = placeholder.textContent.split(': ');
      if (tag !== 'STORY') continue;

      const {image, copy, date} = storiesData[slug];

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
        this.showOverlay(figure, copy, new Date(date));
      });

      content.replaceChild(article, placeholder);
    }

    // construct the main app element
    let overlay, overlayContent/*, overlayCloseButton*/;
    const el = (
      <section class="app">
        {content}

        {
          overlay = (
            <div class="overlay overlay--hidden">
              <div class="overlay-content-wrap">
                <div class="overlay-close-button">×</div>
                {overlayContent = <div class="overlay-content"/>}
              </div>
            </div>
          )
        }
      </section>
    );

    overlay.addEventListener('click', event => {
      if (event.srcElement === overlay || event.srcElement.classList.contains('overlay-close-button')) this.hideOverlay();
    });

    // escape to close overlay
    document.addEventListener('keydown', event => {
      if (event.keyCode === 27) this.hideOverlay();
    });

    // keep references to key elements
    this.el = el;
    this.overlayContent = overlayContent;
    this.overlay = overlay;
    // this.overlayCloseButton = overlayCloseButton;
  },


  showOverlay(figure, copy, articleDate) {
    if (this.showingOverlay) return;
    this.showingOverlay = true;
    // console.log('figure', figure, copy);

    const {overlay, overlayContent} = this;

    const pageWrapper = document.querySelector('.page-wrapper');
    const pageWrapper2 = pageWrapper.querySelector('.page-wrapper-2');


    overlayContent.innerHTML = (
      `<p class="archive-article-date">${formatDate(articleDate)}</p>` +
      copy
    );
    overlay.classList.remove('overlay--hidden');
    overlay.classList.add('overlay--tinted');
    overlayContent.scrollTop = 0;

    this.scrollOffset = document.body.scrollTop;
    pageWrapper2.style.top = '-' + this.scrollOffset + 'px';
    pageWrapper.classList.add('showing-overlay');

    this.figure = figure;

    if (ENABLE_ANIMATION) {
      pageWrapper2.getBoundingClientRect();
      ramjet.hide(figure, this.overlayContent);
    }

    // setTimeout(() => {
    //   ramjet.show(this.overlayContent);
    // }, 300);

    if (ENABLE_ANIMATION) {
      ramjet.transform(figure, this.overlayContent, {
        easing: ramjet.easeOut,
        // duration: 400,
        done: () => {
          ramjet.show(this.overlayContent);
        },
      });
    }
  },



  hideOverlay() {
    if (!this.showingOverlay) return;
    this.showingOverlay = false;

    const {overlay, overlayContent, figure} = this;

    const pageWrapper = document.querySelector('.page-wrapper');
    const pageWrapper2 = pageWrapper.querySelector('.page-wrapper-2');

    overlay.classList.remove('overlay--tinted');
    overlay.classList.add('overlay--hiding');
    pageWrapper.classList.remove('showing-overlay');

    pageWrapper2.getBoundingClientRect(); // flush paint queue

    if (ENABLE_ANIMATION) {
      ramjet.hide(overlayContent);
      ramjet.transform(overlayContent, figure, {
        easing: ramjet.easeOut,
        done: () => {
          overlay.classList.add('overlay--hidden');
          overlay.classList.remove('overlay--hiding');
          ramjet.show(figure, overlayContent);
        },
      });
    }
    else {
      overlay.classList.add('overlay--hidden');
      overlay.classList.remove('overlay--hiding');
    }

    document.body.scrollTop = this.scrollOffset;
    pageWrapper2.style.top = '0';
  },
});


var monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'
];

function formatDate(date) {
  return (
    monthNames[date.getUTCMonth()] + ' ' +
    date.getUTCDate() + ', ' +
    date.getUTCFullYear()
  );
}
