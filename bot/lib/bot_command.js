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
    daftar: {
        init: ['Nak daftar? Kasi nama penuh/glamor dulu.', 'Hello. Dengar cerita nak daftar? Nama penuh apa? Nama glamor pun boleh.', 'Saya memang suka daftarkan orang ni. Cer bagi nama penuh.'],
        sorry: ['Pendaftaran melalui Telegram masih belum tersedia. Harap maaf.', 'Sorry. Borang pendaftaran belum fotostat.', 'Kalau nak daftar, PM saya.']
    }
};

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
        solat: function(data) {
            request('http://solatapi.herokuapp.com/api.php?place=jb', function(err, res, body) {
                var a = JSON.parse(body)
                bot.sendMessage({
                    chat_id: data.chat.id,
                    text: "Solat yang wajib ada 5. Subuh, Zohor, Asar, Isyak & Maghrib. Dah settle ke belum?"
                })
            })
        }
    }
}