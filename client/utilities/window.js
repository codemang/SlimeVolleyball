window.requestAnimFrame = (function(){
  return window.requestAnimationFrame  || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function(callback, element){
      window.setTimeout(callback, 1000 / 60);

    };
})();

window.cancelAnimFrame = (function() {
  return window.cancelAnimationFrame  ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame    ||
    window.oCancelAnimationFrame      ||
    window.msCancelAnimationFrame     ||
    function(callback, element) {
      clearTimeout(id);
    }
})();
