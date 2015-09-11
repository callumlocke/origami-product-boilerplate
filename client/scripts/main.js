/** @jsx plainJSX */

import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';
import AppView from './views/app-view';
import App from './models/app';


document.addEventListener('DOMContentLoaded', function () {
  // make hover effects work on touch devices
  oHoverable.init();

  // remove the 300ms tap delay on mobile browsers
  attachFastClick(document.body);

  // set headline etc.
  const main = document.querySelector('main');
  main.querySelector('.headline').textContent = spreadsheet.options.headline;
  main.querySelector('.standfirst').textContent = spreadsheet.options.standfirst;
  main.querySelector('.byline').textContent = spreadsheet.options.byline;
  main.querySelector('.publish-date').textContent = spreadsheet.options.publishDate;

  // render the app
  const app = new App();
  const appView = new AppView({app});

  main.replaceChild(appView.render().el, main.querySelector('.app'));

  // document.querySelectorAll('figure')[0].dispatchEvent(new Event('click'));
});
