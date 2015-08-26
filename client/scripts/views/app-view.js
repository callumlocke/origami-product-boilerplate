/** @jsx plainJSX */

import View from 'ampersand-view';
import ramjet from 'ramjet';


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
        this.showOverlay(figure, copy);
      });

      content.replaceChild(article, placeholder);
    }

    // construct the main app element
    let overlay, overlayContent;
    const el = (
      <section class="app">
        {content}

        {
          overlay = (
            <div class="overlay overlay--hidden">
              {overlayContent = <div class="overlay-content"/>}
            </div>
          )
        }
      </section>
    );

    overlay.addEventListener('click', event => {
      if (event.srcElement === overlay) this.hideOverlay();
    });

    // keep references to key elements
    this.el = el;
    this.overlayContent = overlayContent;
    this.overlay = overlay;
  },


  showOverlay(figure, copy) {
    // console.log('figure', figure, copy);

    const {overlay, overlayContent} = this;

    const pageWrapper = document.querySelector('.page-wrapper');
    const pageWrapper2 = pageWrapper.querySelector('.page-wrapper-2');

    // console.log('showOverlay', copy);
    overlayContent.innerHTML = copy;
    overlay.classList.remove('overlay--hidden');

    this.scrollOffset = document.body.scrollTop;
    pageWrapper2.style.top = '-' + this.scrollOffset + 'px';
    pageWrapper.classList.add('showing-overlay');

    this.figure = figure;

    ramjet.hide(figure, this.overlayContent);
    pageWrapper2.getBoundingClientRect();
    ramjet.transform(figure, this.overlayContent, {
      easing: ramjet.easeOut,
      done: () => {
        ramjet.show(this.overlayContent);
        overlay.classList.add('overlay--tinted');
      },
    });
  },


  hideOverlay() {
    const {overlay, overlayContent, figure} = this;

    const pageWrapper = document.querySelector('.page-wrapper');
    const pageWrapper2 = pageWrapper.querySelector('.page-wrapper-2');

    overlay.classList.remove('overlay--tinted');
    pageWrapper.classList.remove('showing-overlay');

    pageWrapper2.getBoundingClientRect(); // flush paint queue

    ramjet.hide(this.overlayContent);
    ramjet.transform(this.overlayContent, figure, {
      easing: ramjet.easeOut,
      done: () => {
        overlay.classList.add('overlay--hidden');
        ramjet.show(figure, this.overlayContent);
      },
    });

    document.body.scrollTop = this.scrollOffset;
    pageWrapper2.style.top = '0';
  },
});
