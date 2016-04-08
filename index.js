var Botkit = require('botkit')
var Witbot = require('witbot')

var slackToken = process.env.SLACK_TOKEN
var witToken = process.env.WIT_TOKEN

var controller = Botkit.slackbot({
	debug: false
})

controller.spawn({
	token.slackToken
}).startRTM(function (err, bot, payload) {
	if (err) {
		throw new Error('Error connecting to slack: ', err)
	}
	console.log('Connected to slack')
})

var witbot = Withbot(witToken)