// JOMWEBOT 0.1A August 2015
// -------------------------

var request = require('request'),
    defer = require('deferred'),
    env = (!process.env.BOT_TOKEN) ? require('./env.js') : undefined;

var jwj_group_id = process.env.JWJ_ID || "-14943090";
var _bot = require('vow-telegram-bot'),
    bot = new _bot({
        token: process.env.BOT_TOKEN || null ,
        polling: {
            timeout: 3,
            limit: 100
        }
    });

// -------------------------

var req = {
    callback: function(defer) {
        return function(err, res, body) {
            console.log(body)
            if (err) {
                defer.reject(err)
            } else {
                // Since the response is not always JSON,
                // we need to have some checking in the resolved callbacks.
                try {
                    var a = JSON.parse(body);
                } catch(err) {
                    var a = body;
                }
                defer.resolve(a)
            }
        }
    },
    token: function() {
        var q = defer(), _this = this;
        request('http://mrjunior.my/jomweb/jwj', _this.callback(q));
        return q.promise;
    },
    members: function(username) {
        var q = defer(), _this = this,
            uname = (username) ? '/'+username: '',
            options = { url: 'http://mrjunior.my/jomweb/api/members'+uname }
        this.token().done(function(res) {
            options.headers = { Authorization: 'Bearer '+ res.token };
            request(options, _this.callback(q));
        }, function(err) {
            console.log('user error:', err)
        });
        return q.promise;
    }
};

var randtext = {
    randomize: function(array) {
        var i = Math.floor((array.length-1)*Math.random());
        return i;
    },
    skills: ['dalam permainan mata', 'membuat orang ketawa', 'menjahit agaknyaAut', ''],
    position: ['yang mencari kerja', 'yang sedang berkelana', ''],
    company: ['mana-mana sahaja', 'Malaysia', 'pejabat-pejabat tanah', ''],
    location: ['dalam group telegram JomWeb Johor.', 'tempat yang belum diketahui lokasinya.', 'Malaysia, mungkin?', ''],
    filler: {
        one: [', seorang '],
        two: [' di '],
        three: [', pandai ', ', berkemahiran ', ', master dalam ', ''],
        four: [' dan sekarang tinggal di ', ' dan menetap di ', ', penunggu tetap di ', '']
    },
    notfound: ['Tak jumpa la sapa tu.', 'Wujud ke dia tu?', 'Cuba try cari dia kat Jabatan Pendaftaran Negara.', '' ]
}

// -------------------------

var botcommands = {
    siapa: function(data, txtarray) {
        var text = '';
        req.members(txtarray[1]).done(function(res) {
            if (res.status == 200) {
                var skills = (res.skills.length) ? res.skills.join(', ') : randtext.skills[randtext.randomize(randtext.skills)],
                    position = (res.position) ? res.position : randtext.position[randtext.randomize(randtext.position)],
                    company = (res.company) ? res.company : randtext.company[randtext.randomize(randtext.company)],
                    location = (res.location) ? res.location : randtext.location[randtext.randomize(randtext.location)];

                text += res.name + randtext.filler.one[randtext.randomize(randtext.filler.one)] + position + randtext.filler.two[randtext.randomize(randtext.filler.two)] + company;
                text += randtext.filler.three[randtext.randomize(randtext.filler.three)] + skills + randtext.filler.four[randtext.randomize(randtext.filler.four)] + location + '\n\n';
                if (res.social.facebook.uri) text += 'Facebook: ' + res.social.facebook.uri + '\n';
                if (res.social.twitter.uri) text += 'Twitter: ' + res.social.twitter.uri + '\n';
                if (res.social.twitter.uri) text += 'GitHub: ' + res.social.github.uri + '\n';
            } else {
                text = txtarray[1] + '? ' + randtext.notfound[randtext.randomize(randtext.notfound)]
            }
            bot.sendMessage({
                chat_id: data.chat.id,
                text: text
            })
        }, function(err) {
            console.log('async error: ', err)
        })
    },
    ahli: function(data) {
        req.members().done(function(res) {
            var text = 'Senarai ahli Jomweb berdaftar: \n\n';
            if (res.status == 200) {
                var job = '';
                try {
                    res.forEach(function(k,v) {
                        job = (v.position) ? v.position + '\n':'Unknown \n';
                        if (v.name != undefined) {
                            text += '#jwj: ' + v.name + ': ' + job;
                        }
                    })
                } catch(e) {
                    // Not a proper array
                    Object.keys(res).forEach(function(k,v) {
                        job = (res[k].position) ? res[k].position + '\n':'Unknown \n';
                        if (res[k].name != undefined) {
                            text += '#jwj: ' + res[k].name + ': ' + job;
                        }
                    })
                }
            } else {

            }
            bot.sendMessage({
                chat_id: data.chat.id,
                text: text
            })
        })
    },
    solat: function(data) {
        request('http://solatapi.herokuapp.com/api.php?place=jb', function(err, res, body) {
            var a = JSON.parse(body)
            bot.sendMessage({
                chat_id: data.chat.id,
                text: "Solat yang wajib ada 5. Subuh, Zohor, Asar, Isyak & Maghrib. Dah settle ke belum?"
            })
        })
    }
};

// -------------------------

bot.on('message', function(data) {
    console.log(data)
    if (data.new_chat_participant) {
        bot.sendMessage({
            chat_id: data.chat.id,
            text: 'Selamat datang ' + data.new_chat_participant.first_name + '!\nKalau boleh, panas-panaskan badan dengan sedikit intro. Kerja kat mana, dan bidang kepakaran. Yang lain nanti kitorang tanya2 la ye. \n\nKalau nak kenal orang2 dalam ni, klik /ahli atau taip /siapa [nama ahli].'
        })
    } else if (data.text.charAt(0) === '/') {
        var a = data.text.split(' ');
        try {
            botcommands[a[0].slice(1)](data, a);
        } catch(error) {
            // Command is not supported
        }
    }
});










