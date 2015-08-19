var _bot = require('vow-telegram-bot'),
	bot = new _bot({
		token: '82257237:AAFQx9upOKq9qPIKqEfm4w1pz3LONGsCFMQ',
		polling: {
			timeout: 3,
			limit: 100
		}
	})

var randomResponse = [
	'Saya masih malu-malu dan belum bersedia lagi. Tunggu la dulu ye...',
	'Ish awak ni. Saya belum siap lagi..',
	'Heyyy!! Belum la! Cium baru tau.',
	'Hihihi (tutup mulut malu-malu)',
	'Awak ni la. Kan saya kata belum siap. Tak faham lagi ke?',
]

var i = Math.floor(4*Math.random());

bot.on('message', function(data) {
	if (data.text.charAt(0) === '/') {
		bot.sendMessage({
			chat_id: data.chat.id,
			text: randomResponse[i]
		})
	}
})