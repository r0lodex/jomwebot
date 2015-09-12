var assert = require("assert");
var rewire = require("rewire");
var sinon = require("sinon");
var nock = require("nock");

var request = require('request'),
    defer = require('deferred'),
    env = (!process.env.BOT_TOKEN) ? require('../env.js') : undefined,
    Botcommands = require('../lib/bot_command.js'),
    Api = require('../lib/api_req.js');

var jwj_group_id = process.env.JWJ_ID || "-14943090",
    jwj_api_url = process.env.JWJ_API_URL || 'http://localhost:8000/jomweb';

var _bot = require('vow-telegram-bot'),
    bot = new _bot({
        token: process.env.BOT_TOKEN || null ,
        polling: {
            timeout: 3,
            limit: 100
        }
    });

var req = new Api(jwj_api_url, request, defer);


//server.__set__('bot', bot);

describe('Command test', function () {
    it('should show username', function (done) {
        var q = defer();
        var test_result;
        q.resolve({
            status: 200,
            name: 'kamal',
            skills: [
                'php',
                'python',
            ],
            social: {
                facebook: '',
                twitter: ''
            }
        });
        // much better if we can mock the http response instead
        var mocked_req = sinon.stub(req, 'members').returns(q.promise);

        sinon.stub(bot, 'sendMessage', function(data) {
            console.log(data);
            test_result = data.text;
        });

        var botcommands = new Botcommands(req, bot);
        bot_data = {
            chat: {
                id: 1
            }
        }
        botcommands.siapa(bot_data, 'kamal');
        done();
        assert.ok(test_result.search('kamal') > -1);
    })
})
