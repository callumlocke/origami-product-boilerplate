import oHoverable from 'o-hoverable';
import attachFastClick from 'fastclick';

document.addEventListener('DOMContentLoaded', function () {
  // make hover effects work on touch devices
  oHoverable.init();

  // remove the 300ms tap delay on mobile browsers
  attachFastClick(document.body);

  // get the <section class="app"> element
  const app = document.querySelector('.app');

  // REPLACE THIS WITH YOUR APP CODE!
  app.innerHTML = (
    `<div class="o-grid-row">` +
      `<p>This is some dynamic content injected by JavaScript.</p>` +
    `</div>`
  );

});
