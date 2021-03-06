function ClickMethod () {
  document.addEventListener('click', function(event) {
    var element, url, method, data, handler;

    // Only left click allowed. Firefox triggers click event on right click/contextmenu.
    if (event.button !== 0) {
      return;
    }

    element = event.target;

    if (element.matches('a[data-method]')) {
      url = element.getAttribute('href');
      method = element.getAttribute('data-method').toUpperCase();
      data = {};

      if (CSRF.param() && CSRF.token()) {
        data[CSRF.param()] = CSRF.token();
      }

      if (element.matches('a[data-remote]')) {
        handler = xhr;
      } else {
        handler = submit;
      }

      if (handler({ url: url, method: method, data: data, target: element })) {
        event.preventDefault();
      } else {
        return true;
      }
    }

    function submit(options) {
      var form, input, param;

      if (options.method == 'GET') {
        return false;
      }

      form = document.createElement('form');
      form.method = 'POST';
      form.action = options.url;
      form.style.display = 'none';

      for (param in options.data) {
        if (Object.prototype.hasOwnProperty.call(options.data, param)) {
          input = document.createElement('input');
          input.setAttribute('type', 'hidden');
          input.setAttribute('name', param);
          input.setAttribute('value', options.data[param]);
          form.appendChild(input);
        }
      }

      if (options.method != 'POST') {
        input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', '_method');
        input.setAttribute('value', options.method);
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      return true;
    }

    function xhr(options) {
      LiteAjax.ajax(options);
      return true;
    }
  }, false);
}

export default ClickMethod
