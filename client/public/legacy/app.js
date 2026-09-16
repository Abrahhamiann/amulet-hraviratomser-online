(function () {
  'use strict';
  var config = window.AmuletLegacyConfig;
  var content = document.getElementById('content');
  var timer;
  function node(tag, text, parent) {
    var element = document.createElement(tag);
    if (text !== undefined && text !== null) element.textContent = String(text);
    if (parent) parent.appendChild(element);
    return element;
  }
  function parameter(name) {
    var parts = window.location.search.substring(1).split('&');
    var result = '';
    for (var i = 0; i < parts.length; i += 1) {
      var pair = parts[i].split('=');
      try {
        if (decodeURIComponent(pair[0]) === name) result = decodeURIComponent((pair.slice(1).join('=') || '').replace(/\+/g, ' '));
      } catch (ignore) { /* Ignore malformed query parameters. */ }
    }
    return result;
  }
  function routeLink(route) { return '/legacy/?route=' + encodeURIComponent(route); }
  function link(parent, text, href) {
    var a = node('a', text, parent);
    a.href = href;
    return a;
  }
  function webUrl(value) {
    var input = String(value || '').replace(/^\s+|\s+$/g, '');
    var markdown = /^\[[^\]]*\]\(\s*(https?:\/\/[^\s)]+)\s*\)$/i.exec(input);
    input = (markdown ? markdown[1] : input).replace(/^<|>$/g, '');
    return /^https?:\/\/[^\s]+$/i.test(input) ? input : '';
  }
  function request(method, path, data, callback) {
    var xhr = new XMLHttpRequest();
    var finished = false;
    function finish(error, payload) {
      if (finished) return;
      finished = true;
      callback(error, payload);
    }
    xhr.open(method, config.api + path, true);
    xhr.timeout = 20000;
    xhr.setRequestHeader('Accept', 'application/json');
    if (data) xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300) return finish(new Error(xhr.status === 404 || xhr.status === 410 ? 'Հրավիրատոմսը հասանելի չէ։' : 'Չհաջողվեց բեռնել տվյալները։ Փորձեք կրկին։'));
      try { var payload = JSON.parse(xhr.responseText); } catch (error) { return finish(error); }
      finish(null, payload);
    };
    xhr.onerror = xhr.ontimeout = function () { finish(new Error('Կապի խնդիր։ Ստուգեք ինտերնետ կապը և փորձեք կրկին։')); };
    xhr.send(data ? JSON.stringify(data) : null);
  }
  function clear(title) {
    window.clearInterval(timer);
    content.textContent = '';
    document.title = title + ' | Amulet';
    node('h1', title, content);
  }
  function failure(error, retry) {
    clear('Amulet');
    node('p', error.message || 'Չհաջողվեց բեռնել էջը։', content).className = 'error';
    var button = node('button', 'Փորձել կրկին', content);
    button.onclick = retry;
    contact(content);
  }
  function contact(parent) {
    var section = node('section', null, parent);
    node('h2', 'Կապ մեզ հետ', section);
    link(node('p', null, section), config.phoneDisplay, 'tel:' + config.phone.replace(/[^+0-9]/g, ''));
    link(node('p', null, section), config.email, 'mailto:' + config.email);
  }
  function picture(parent, value, alt, converted) {
    var src = String(value || '');
    // Never request a WebP/AVIF, data URI or multi-megabyte original automatically.
    if (!converted && (!/\.(?:jpe?g|png)(?:\?|$)/i.test(src) || !(webUrl(src) || /^\/(?!\/)/.test(src)))) src = '/legacy/poster.jpg';
    if (/^\/media\//.test(src)) src = '/legacy-api' + src;
    var image = node('img', null, parent);
    image.className = 'poster';
    image.alt = src === '/legacy/poster.jpg' ? 'Amulet' : alt;
    image.onerror = function () {
      if (image.getAttribute('src') !== '/legacy/poster.jpg') image.src = '/legacy/poster.jpg';
      else image.parentNode.removeChild(image);
    };
    image.src = src;
    return image;
  }
  function home() {
    clear('Amulet');
    node('p', 'Ձեր կարևոր օրվա հրավիրատոմսը', content);
    link(content, 'Տեսնել հրավիրատոմսերը', routeLink('/templates'));
    picture(content, '', 'Amulet');
    contact(content);
  }
  function catalog() {
    clear('Հրավիրատոմսեր');
    var list = node('div', null, content);
    var status = node('p', 'Բեռնվում է...', content);
    status.setAttribute('role', 'status');
    var more = node('button', 'Տեսնել ավելին', content);
    var cursor = '';
    function load() {
      more.disabled = true;
      status.textContent = 'Բեռնվում է...';
      var category = parameter('category');
      request('GET', '/templates?limit=12' + (category ? '&category=' + encodeURIComponent(category) : '') + (cursor ? '&cursor=' + encodeURIComponent(cursor) : ''), null, function (error, data) {
        more.disabled = false;
        if (error) { status.textContent = error.message; return; }
        var items = data.items || [];
        status.textContent = items.length || cursor ? '' : 'Հրավիրատոմսեր չեն գտնվել։';
        for (var i = 0; i < items.length; i += 1) {
          var item = node('article', null, list);
          item.className = 'item';
          link(node('h2', null, item), items[i].title, routeLink('/templates/' + encodeURIComponent(items[i]._id)));
          node('p', items[i].description || '', item);
          if (items[i].price !== undefined) node('p', items[i].price + ' AMD', item);
        }
        cursor = data.nextCursor || '';
        more.style.display = data.hasMore && cursor ? 'inline-block' : 'none';
      });
    }
    more.onclick = load;
    load();
  }
  function template(id) {
    request('GET', '/templates/' + encodeURIComponent(id), null, function (error, data) {
      if (error) return failure(error, function () { template(id); });
      clear(data.title || 'Հրավիրատոմս');
      node('p', data.description || '', content);
      if (data.price !== undefined) node('p', data.price + ' AMD', content);
      picture(content, config.api + '/templates/' + encodeURIComponent(id) + '/legacy-image', data.title, true);
      node('p', 'Պատվիրելու և ձևավորելու համար կապվեք մեզ հետ կամ բացեք այս էջը նոր սարքով։', content);
      contact(content);
    });
  }
  function field(form, label, name, type) {
    var id = 'rsvp-' + name;
    var caption = node('label', label, form);
    caption.htmlFor = id;
    var input = node(type === 'select' ? 'select' : type === 'textarea' ? 'textarea' : 'input', null, form);
    if (input.tagName === 'INPUT') input.type = type;
    input.id = id;
    input.name = name;
    return input;
  }
  function rsvp(invitation) {
    var settings = (invitation.customization || {}).rsvpSettings || {};
    var section = node('section', null, content);
    node('h2', settings.title || 'Հաստատեք Ձեր մասնակցությունը', section);
    if (settings.description) node('p', settings.description, section);
    var form = node('form', null, section);
    var name = field(form, 'Անուն Ազգանուն', 'guestName', 'text');
    name.required = true; name.maxLength = 120;
    var phone = field(form, 'Հեռախոս', 'phone', 'tel'); phone.maxLength = 40;
    var status = field(form, 'Մասնակցություն', 'status', 'select');
    var options = [['', 'Ընտրեք'], ['attending', settings.attendingLabel || 'Մասնակցելու եմ'], ['declined', settings.notAttendingLabel || 'Չեմ մասնակցելու'], ['unsure', 'Դեռ չգիտեմ']];
    for (var i = 0; i < options.length; i += 1) node('option', options[i][1], status).value = options[i][0];
    status.required = true;
    var count = field(form, 'Հյուրերի քանակ', 'guestCount', 'number');
    count.value = '1'; count.min = '1'; count.step = '1'; count.required = true;
    var side = field(form, 'Հյուրի կողմը', 'guestSide', 'select');
    var sides = [['other', 'Այլ'], ['bride', 'Հարսի կողմ'], ['groom', 'Փեսայի կողմ']];
    for (var j = 0; j < sides.length; j += 1) node('option', sides[j][1], side).value = sides[j][0];
    var message = field(form, 'Հաղորդագրություն', 'message', 'textarea'); message.maxLength = 1000;
    var submit = node('button', settings.submitLabel || 'Ուղարկել', form); submit.type = 'submit';
    var feedback = node('p', '', form); feedback.setAttribute('role', 'status');
    var busy = false;
    form.onsubmit = function (event) {
      event.preventDefault();
      if (busy) return;
      var guests = Number(count.value);
      if (!name.value.replace(/\s/g, '') || !status.value || !isFinite(guests) || guests < 1 || Math.floor(guests) !== guests) {
        feedback.textContent = 'Լրացրեք անունը, մասնակցությունը և հյուրերի քանակը։';
        feedback.className = 'error'; return;
      }
      busy = true; submit.disabled = true;
      feedback.textContent = 'Ուղարկվում է...';
      request('POST', '/rsvp/' + encodeURIComponent(invitation._id), { guestName: name.value, phone: phone.value, status: status.value, guestCount: guests, guestSide: side.value, message: message.value }, function (error) {
        busy = false;
        if (error) {
          submit.disabled = false; feedback.className = 'error';
          feedback.textContent = error.message + ' Եթե կապն ընդհատվել է, հաստատեք ստացումը կազմակերպչի հետ՝ կրկնակի ուղարկումից խուսափելու համար։';
          return;
        }
        feedback.className = 'status'; feedback.textContent = 'Շնորհակալություն։ Ձեր պատասխանը գրանցված է։';
        form.onsubmit = function (e) { e.preventDefault(); };
      });
    };
  }
  function invitation(slug) {
    request('GET', '/invitations/' + encodeURIComponent(slug), null, function (error, data) {
      if (error) return failure(error, function () { invitation(slug); });
      clear(data.names || 'Հրավիրատոմս');
      var custom = data.customization || {};
      node('p', data.templateId && data.templateId.title || 'Հրավիրատոմս', content);
      node('p', data.message || '', content);
      // Date-only parsing avoids Safari's implementation-dependent date parser.
      var date = /^(\d{4})-(\d{2})-(\d{2})/.exec(data.date || '');
      node('p', (date ? date[3] + '.' + date[2] + '.' + date[1] : '') + ' ' + (data.time || ''), content);
      node('p', data.location || '', content);
      if (date) {
        var clock = /^(\d{1,2}):(\d{2})/.exec(data.time || '');
        var target = new Date(Number(date[1]), Number(date[2]) - 1, Number(date[3]), clock ? Number(clock[1]) : 0, clock ? Number(clock[2]) : 0);
        var countdown = node('p', '', content);
        function update() { countdown.textContent = Math.max(0, Math.ceil((target.getTime() - new Date().getTime()) / 86400000)) + ' օր է մնացել'; }
        update(); timer = window.setInterval(update, 60000);
      }
      picture(content, config.api + '/invitations/' + encodeURIComponent(slug) + '/legacy-image/0', data.names, true);
      var maps = Array.isArray(data.mapLinks) ? data.mapLinks.slice(0) : [];
      var primary = webUrl(data.mapLink);
      var found = false;
      for (var m = 0; m < maps.length; m += 1) if (webUrl(maps[m].url) === primary) found = true;
      if (primary && !found) maps.unshift({ label: data.location || 'Քարտեզ', url: primary });
      for (var i = 0; i < maps.length; i += 1) {
        if (maps[i].visible === false) continue;
        var place = node('section', null, content);
        node('h2', maps[i].label || 'Վայր', place);
        node('p', (maps[i].time || '') + '\n' + (maps[i].address || ''), place);
        var url = webUrl(maps[i].url);
        if (url) link(place, 'Բացել քարտեզը', url);
      }
      if (custom.dressCodeVisible && custom.dressCode) node('p', custom.dressCode, content);
      if (custom.finalMessageVisible !== false && custom.closingMessage) node('p', custom.closingMessage, content);
      var gallery = Array.isArray(data.gallery) ? data.gallery : [];
      var images = gallery.slice(1, 6);
      if (images.length) {
        var show = node('button', 'Դիտել լուսանկարները', content);
        show.onclick = function () {
          show.disabled = true;
          var k = 0;
          function next() {
            if (k >= images.length) return;
            k += 1;
            var image = picture(content, config.api + '/invitations/' + encodeURIComponent(slug) + '/legacy-image/' + k, data.names, true);
            image.addEventListener('load', next);
            image.addEventListener('error', function () {
              image.removeEventListener('load', next);
              next();
            });
          }
          next();
        };
      }
      rsvp(data);
      contact(content);
    });
  }
  if (!config) {
    clear('Amulet');
    node('p', 'Չհաջողվեց բեռնել էջը։ Թարմացրեք էջը և փորձեք կրկին։', content);
    return;
  }
  var route = parameter('route') || window.location.pathname.replace(/^\/legacy/, '') || '/';
  var match;
  if ((match = /^\/invite\/([^/]+)\/?$/.exec(route))) {
    try { invitation(decodeURIComponent(match[1])); } catch (error) { failure(error, home); }
  } else if ((match = /^\/templates\/([^/]+)(?:\/live)?\/?$/.exec(route))) {
    template(match[1]);
  } else if (/^\/templates\/?$/.test(route)) catalog();
  else if (route === '/' || route === '/index.html') home();
  else if (/^\/(?:contact|about)\/?$/.test(route)) { clear('Amulet'); contact(content); }
  else {
    clear('Amulet');
    node('p', 'Այս բաժինը հասանելի է նոր սարքով։ Հրավիրատոմսերը կարող եք դիտել այստեղ, իսկ այլ հարցերով՝ կապվել մեզ հետ։', content);
    contact(content);
  }
}());
