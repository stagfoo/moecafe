function typeOut(str, startX, startY, lineHeight, padding) {
  "use strict";
  var cursorX = startX || 0;
  var cursorY = startY || 0;
  var lineHeight = lineHeight || 32;
  padding = padding || 10;
  var i = 0;
  $_inter = setInterval(function() {
      var rem = str.substr(i);
      var space = rem.indexOf(' ');
      space = (space === -1)?str.length:space;
      var wordwidth = ctx.measureText(rem.substring(0, space)).width;
      var w = ctx.measureText(str.charAt(i)).width;
      if(cursorX + wordwidth >= canvas.width - padding) {
          cursorX = startX;
          cursorY += lineHeight;
      }
      ctx.fillText(str.charAt(i), cursorX, cursorY);
      i++;
      cursorX += w;
      if(i === str.length) {
          clearInterval($_inter);
      }
  }, 75);
}

(function() {
  "use strict";
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.font = '24px sans-serif';
  var str = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.";
  typeOut(str, 25, 25, 32, 10 );
})();