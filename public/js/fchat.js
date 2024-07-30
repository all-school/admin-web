function initFreshChat() {
  window.fcWidget.init({
    token: 'd5ead66b-c490-4f5a-8a94-9011369698f9',
    host: 'https://wchat.eu.freshchat.com'
  });
}
function initialize(i, t) {
  var e;
  i.getElementById(t)
    ? initFreshChat()
    : (((e = i.createElement('script')).id = t),
      (e.async = !0),
      (e.src = 'https://wchat.eu.freshchat.com/js/widget.js'),
      (e.onload = initFreshChat),
      i.head.appendChild(e));
}
function initiateCall() {
  initialize(document, 'freshchat-js-sdk');
}
window.addEventListener
  ? window.addEventListener('load', initiateCall, !1)
  : window.attachEvent('load', initiateCall, !1);
