function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  options || (options = {});
  var later = function() {
    previous = options.leading === false ? 0 : new Date();
    timeout = null;
    result = func.apply(context, args);
  };
  return function() {
    var now = new Date();
    if (!previous && options.leading === false) {
      previous = now;
    }
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

function debounce(func, wait, immediate) {
  var result;
  var timeout = null;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
    }
    return result;
  };
}

var indicator = document.createElement('div');
indicator.style.position = 'fixed';
indicator.style.left = '0';
indicator.style.bottom = '0';
indicator.style.zIndex = '99999999';
indicator.style.padding = '3px';
indicator.style.fontSize = '9px';
indicator.style.lineHeight = '1.2';
indicator.style.background = '#eee';
indicator.style.border = '1px solid #aaa';
indicator.style.borderRadius = '0 3px 0 0';
indicator.style.opacity = '0';
document.body.appendChild(indicator);

function show() {
  indicator.style.opacity = '1';
}

function hide() {
  indicator.style.opacity = '0';
}

var debouncedHide = debounce(hide, 300);

function scrollHandler() {
  var progress = document.body.scrollTop / (document.body.scrollHeight - window.innerHeight) * 100;
  progress = Math.round(Math.max(Math.min(progress, 100), 0));
  indicator.innerHTML = progress + ' %';
  show();
  debouncedHide();
}

document.addEventListener('scroll', throttle(scrollHandler, 100));
