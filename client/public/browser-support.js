(function (window, document) {
  'use strict';
  var ua = window.navigator.userAgent || '';
  var ios = /(?:iPad|iPhone|iPod)/.test(ua) && /OS (\d+)[_\.]/.exec(ua);
  var isLegacyIOS = !!(ios && Number(ios[1]) <= 9);
  var needsLegacy = isLegacyIOS || !('noModule' in document.createElement('script'));
  function legacyUrl() {
    return '/legacy/' + window.location.search + (window.location.search ? '&' : '?') +
      'route=' + encodeURIComponent(window.location.pathname) + window.location.hash;
  }
  window.AmuletBrowserSupport = { isLegacyIOS: isLegacyIOS, needsLegacy: needsLegacy, legacyUrl: legacyUrl };
  if (needsLegacy && !/^\/legacy(?:\/|$)/.test(window.location.pathname)) {
    window.location.replace(legacyUrl());
  }
}(window, document));
