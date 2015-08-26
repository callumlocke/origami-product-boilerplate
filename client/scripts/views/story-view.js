import View from 'ampersand-view';

export default View.extend({
  inititalize({story}) {
    this.story = story;
  },


  render() {
    const {
      story: {date, slug, image, copy}
    } = this;

    const el = (
      <article class="story">
        <img src={image} class="scan"/>
      </article>
    );
  }
});
