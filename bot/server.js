var _bot = require('vow-telegram-bot'),
	bot = new _bot({
		token: '82257237:AAFQx9upOKq9qPIKqEfm4w1pz3LONGsCFMQ',
		polling: {
			timeout: 3,
			limit: 100
		}
	})

var ran = [
	"Nothing is as easy as it looks.",
	"Everything takes longer than you think.",
	"Anything that can go wrong will go wrong.",
	"If there is a possibility of several things going wrong, the one that will cause the most damage will be the one to go wrong.",
	"If there is a worse time for something to go wrong, it will happen then.",
	"If anything simply cannot go wrong, it will anyway.",
	"If you perceive that there are four possible ways in which a procedure can go wrong, and circumvent these, then a fifth way, unprepared for, will promptly develop.",
	"Left to themselves, things tend to go from bad to worse.",
	"If everything seems to be going well, you have obviously overlooked something.",
	"Nature always sides with the hidden flaw.",
	"Mother nature is a bitch.",
	"It is impossible to make anything foolproof because fools are so ingenious.",
	"Whenever you set out to do something, something else must be done first.",
	"Every solution breeds new problems.",
	"Trust everybody ... then cut the cards.",
	"Two wrongs are only the beginning.",
	"If at first you don't succeed, destroy all evidence that you tried.",
	"To succeed in politics, it is often necessary to rise above your principles.",
	"Exceptions prove the rule ... and wreck the budget.",
	"Success always occurs in private, and failure in full view."
]

bot.on('message', function(data) {
	if (data.text.charAt(0) === '/') {
		var i = Math.floor((ran.length-1)*Math.random());
		bot.sendMessage({
			chat_id: data.chat.id,
			text: ran[i]
		})
	}
})