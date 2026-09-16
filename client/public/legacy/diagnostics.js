(function () {
  'use strict';
  if (!/(?:\?|&)legacyDebug=1(?:&|$)/.test(window.location.search)) return;
  function show(message, source, line, column) {
    var box = document.getElementById('legacy-diagnostics');
    if (!document.body) {
      window.setTimeout(function () { show(message, source, line, column); }, 50);
      return;
    }
    if (!box) {
      box = document.createElement('pre');
      box.id = 'legacy-diagnostics';
      document.body.appendChild(box);
    }
    box.textContent = String(message) + '\n' + String(source || '') + '\nLine: ' + (line || 0) + ' Column: ' + (column || 0);
  }
  window.onerror = function (message, source, line, column) { show(message, source, line, column); };
  if (window.addEventListener) window.addEventListener('unhandledrejection', function (event) {
    show(event.reason && event.reason.message || event.reason, '', 0, 0);
  });
}());
