var http = (function(window) {
    'use strict';

    return function(url, headers) {
        headers = headers || {};

        var ajax = function(type, params, async) {
            type = type || 'GET';
            params = params || {};
            async = async === undefined ? true : async;

            type = type.toUpperCase();

            return new Promise(function(resolve, reject) {
                var request = new XMLHttpRequest(),
                    payload = null;

                if (type == 'GET') {
                    if (createQueryString(params)) {
                        url += '?' + createQueryString(params);
                    }
                } else {
                    payload = createPayload(params);
                }

                request.open(type, url, async);

                // set custom request headers
                for (var h in headers) {
                    request.setRequestHeader(h, headers[h]);
                }

                request.onload = function() {
                    var responseHeaders = this.getAllResponseHeaders().split('\n'),
                        responseHeadersFormatted = {};

                    for (var i = 0, l = responseHeaders.length; i < l; i++) {
                        if (responseHeaders[i].length == 0) {
                            continue;
                        }

                        var header = responseHeaders[i].split(': ');
                        responseHeadersFormatted[header[0]] = header[1];
                    }

                    // for http method type HEAD return the response headers only
                    // else response as text
                    resolve({
                        headers: responseHeadersFormatted,
                        body: this.responseText,
                        httpStatus: this.status,
                        httpStatusText: this.statusText
                    });
                };

                request.onerror = function() {
                    reject('Request failed :(');
                };

                request.send(payload);
            });
        },

        createQueryString = function(params) {
            var formatted = null;

            if (params != null && typeof params == 'object') {
                var i = 1, key;
                formatted = '';

                for (key in params) {
                    formatted += (i++ == 1 ? '' : '&') + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                }
            }

            return formatted;
        },

        createPayload = function(params) {
            var payload = new FormData();

            for (var key in params) {
                if (typeof params[key] == 'object') {
                    for (var i = 0, l = params[key].length; i < l; i++) {
                        payload.append(key + '[]', params[key][i]);
                    }
                } else {
                    payload.append(key, params[key]);
                }
            }

            return payload;
        };

        return {
            get: function(params, async) {
                return ajax('GET', params, async);
            },

            post: function(params, async) {
                return ajax('POST', params, async);
            },

            put: function(params, async) {
                return ajax('PUT', params, async);
            },

            delete: function(params, async) {
                return ajax('DELETE', params, async);
            }
        }
    };
}(window));
