var bot = require('vow-telegram-bot')

telegramBot.on('message', function(data) {
	telegramBot.sendMessage({
		chat_id: data.chat.id,
		text: 'Saya masih malu-malu dan belum bersedia lagi. Tunggu la dulu ye...'
	})
})