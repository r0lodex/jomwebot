module.exports = function api_req(url, request, _defer) {
    return {
        callback: function(defer) {
            return function(err, res, body) {
                var a;
                if (err) {
                    defer.reject(err)
                } else {
                    // Since the response is not always JSON,
                    // we need to have some checking in the resolved callbacks.
                    try {
                        a = JSON.parse(body);
                    } catch(err) {
                        a = body;
                    }
                    defer.resolve(a)
                }
            }
        },
        token: function() {
            var q = _defer(), _this = this;
            request(url + '/jwj', _this.callback(q));
            return q.promise;
        },
        members: function(username) {
            var q = _defer(), _this = this,
                uname = (username) ? '/'+username: '',
                options = { url: url + '/api/members'+uname }
            this.token().done(function(res) {
                options.headers = { Authorization: 'Bearer '+ res.token };
                request(options, _this.callback(q));
            }, function(err) {
                console.log('user error:', err)
            });
            return q.promise;
        }
    }
}