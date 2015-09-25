// Response Text Builder
// -------------------------

var randtext = {
    randomize: function(array) {
        var i = Math.floor((array.length)*Math.random());
        return i;
    },
    skills: ['dalam permainan mata', 'membuat orang ketawa', 'menjahit agaknyaAut'],
    position: ['yang mencari kerja', 'yang sedang berkelana'],
    company: ['mana-mana sahaja', 'Malaysia', 'pejabat-pejabat tanah'],
    location: ['dalam group telegram JomWeb Johor.', 'tempat yang belum diketahui lokasinya.', 'Malaysia, mungkin?'],
    filler: {
        one: [', seorang '],
        two: [' di '],
        three: [', pandai ', ', berkemahiran ', ', master dalam '],
        four: [' dan sekarang tinggal di ', ' dan menetap di ', ', penunggu tetap di ']
    },
    notfound: ['Tak jumpa la sapa tu.', 'Wujud ke dia tu?', 'Cuba try cari dia kat Jabatan Pendaftaran Negara.' ],
    noargs: ['Kena tulis la nama baru boleh cari sapa.', 'Nak cari sapa?', 'Cuba bagi nama, senang la sikit nak cari.'],
    daftar: {
        init: ['Nak daftar? Kasi nama penuh/glamor dulu.', 'Hello. Dengar cerita nak daftar? Nama penuh apa? Nama glamor pun boleh.', 'Saya memang suka daftarkan orang ni. Cer bagi nama penuh.'],
        sorry: ['Pendaftaran melalui Telegram masih belum tersedia. Harap maaf.', 'Sorry. Borang pendaftaran belum fotostat.', 'Kalau nak daftar, PM saya.']
    }
};

// Include moment
var moment = require('moment');

// Bot Command Modules
// -------------------------
module.exports = function BotCommands(req, bot) {
    return {
        daftar: function(data) {
            // 1 - Check existence.
            // 2 - Figure out the interactivity (saved chat_id or session? that is the question!)
            bot.sendMessage({
                chat_id: data.chat.id,
                text: randtext.daftar.sorry[randtext.randomize(randtext.daftar.sorry)]
            })
        },
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
                    if (txtarray[1]) {
                        text = txtarray[1] + '? ' + randtext.notfound[randtext.randomize(randtext.notfound)]
                    } else {
                        text = randtext.noargs[randtext.randomize(randtext.noargs)]
                    }
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
                var job = '';
                try {
                    res.forEach(function(v) {
                        job = (v.position) ? v.position + '\n':'Unknown \n';
                        if (v.name != undefined) {
                            text += '#jwj: ' + v.name + ': ' + job;
                        }
                    })
                } catch(e) {
                    console.log('Invalid JSON Array')
                }
                bot.sendMessage({
                    chat_id: data.chat.id,
                    text: text
                })
            })
        },
        solat: function(data, txtarray, request) {
            var url = 'http://mpt.i906.my/mpt.json?code=jhr-2&filter=1';
            request(url, function(err, res, body) {
                
                var w = {
                    'subuh': {
                        'index': 0
                    },
                    'zuhur': {
                        'index': 2
                    },
                    'asar': {
                        'index': 3
                    },
                    'maghrib': {
                        'index': 4
                    },
                    'isyak': {
                        'index': 5
                    }
                };

                var t = JSON.parse(body).response.times, 
                    s = txtarray[1], 
                    msg = '', 
                    cur = moment(),
                    closest;

                // Loop through solat times
                for (var i in w) {

                    // Get time for each solat
                    var unix = moment.unix(t[w[i].index]);
                    w[i].time = unix;

                    // Get next solat time
                    if (unix.diff(cur, 'minutes') >= 0 && closest == undefined) {
                        closest = i;
                    }
                }

                if (s != undefined) {
                    msg = 'Waktu solat ' + s + ' bagi kawasan Johor Bahru adalah pada jam ' + w[s].time.format('HH:mm') + '\n';
                } else {

                    if (closest != undefined) {
                        var next = closest;

                        // Friday
                        if (cur.day() == 5 && closest == 'zuhur') 
                            next = 'Jumaat';

                        msg += 'In sya Allah lepas ni solat ' + next + ' pada jam ' + w[closest].time.format('HH:mm') + '\n\n';
                    }

                    if (typeof w[s] == undefined)
                        msg += 'Solat apa tu? ';

                    msg += 'Waktu solat harini (Johor Bahru):\n';
                    for (var i in w) {
                        msg += '/solat ' + i + ' (' + w[i].time.format('HH:mm') + ')\n';
                    }

                }
                msg += '\nSumber: ' + url + '\n';
                msg += '\n"Dan dirikanlah solat, tunaikanlah zakat dan ruku\'lah berserta orang-orang yang ruku\'"\nAl-Baqarah: 43';

                bot.sendMessage({
                    chat_id: data.chat.id,
                    text: msg
                })
            })
        }
    }
}