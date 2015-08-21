// global addScript function
function addScript(src, async, defer) {
  if (!async && !defer) {
    document.write('<script src="' + src + '">\x3c/script>');
  }
  else {
    var script = document.createElement('script');
    script.src = src;
    script.async = !!async;
    if (defer) script.defer = !!defer;
    var oldScript = document.getElementsByTagName('script')[0];
    oldScript.parentNode.appendChild(script);
    return script;
  }
}

// CTM based on https://github.com/Financial-Times/next-js-setup/blob/master/templates/ctm.html
var cutsTheMustard = (
  'getComputedStyle' in window &&
  !(window.navigator.userAgent.indexOf('IEMobile') > -1 && !CustomEvent)
);


// set the root element to .core or .enhanced as appropriate
if (cutsTheMustard) {
  document.documentElement.className = (
    document.documentElement.className.replace(/\bcore\b/g, 'enhanced')
  );

  // add polyfill bundle (see polyfill.io for how to add non-default polyfills to this)
  addScript('https://cdn.polyfill.io/v1/polyfill.min.js');
}
else {
  // browser is too old - just enable the HTML5 shiv (so basic HTML5 styling works)
  addScript('https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv.min.js');
}
