// JOMWEBOT 0.1A August 2015
// -------------------------

var request = require('request'),
    defer = require('deferred'),
    env = (!process.env.BOT_TOKEN) ? require('./env.js') : undefined,
    Botcommands = require('./lib/bot_command.js'),
    Api = require('./lib/api_req.js');

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

var req = new Api(jwj_api_url, request, defer),
    botcommands = new Botcommands(req, bot);

bot.on('message', function(data) {
    console.log(data)
    console.info('===========')
    console.log(data.from.id, data.chat.id)
    if(data.from.id == data.chat.id) {
        bot.sendMessage({
            chat_id: data.from.id,
            text: 'Maaf ye. Saya belum sedia nak jadi PM. Eh maksud saya nak balas PM.'
        })
    } else {
        if (data.new_chat_participant) {
            bot.sendMessage({
                chat_id: data.chat.id,
                text: 'Selamat datang ' + data.new_chat_participant.first_name + '!\nKalau boleh, panas-panaskan badan dengan sedikit intro. Kerja kat mana, dan bidang kepakaran. Yang lain nanti kitorang tanya2 la ye. \n\nKalau nak kenal orang2 dalam ni, klik /ahli atau taip /siapa [nama ahli].'
            })
        } else if (data.text.charAt(0) === '/') {
            var a = data.text.split(' ');
            try {
                botcommands[a[0].slice(1)](data, a, request);
            } catch(error) {
                console.log(error);
                bot.sendMessage({
                    chat_id: data.chat.id,
                    text: 'Belum reti la macam mana nak ' + a
                })
            }
        }
    }
});








