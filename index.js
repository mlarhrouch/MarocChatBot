var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

// You MUST change these values, consult the Messenger Platform Getting Started guide
var verify_token = '2decembre1993';
var token = "EAAQCZA9RSe4kBANn3qz41BKZBwgkmtyHKUyZCtSmB1cVUEBSZCs5yOzc0feomGglXjz26I7EbutqDRhqu5rt4E7ZCR0QijAFUQ5nsujifctzTqDjbrf7TQcYjADMV2cZCZAiZCxz4B25nIuIB2foTJSSTgjVSVUqxJZCAHBKn4aW78QZDZD";

app.use(bodyParser.json());

app.get('/', function (req, res) {

    res.send('Hello World! This is the bot\'s root endpoint!');

});

app.get('/webhook/', function (req, res) {

    if (req.query['hub.verify_token'] === verify_token) {
        res.send(req.query['hub.challenge']);
    }

    res.send('Error, wrong validation token');

});

app.post('/webhook/', function (req, res) {

    var messaging_events = req.body.entry[0].messaging;

    for (var i = 0; i < messaging_events.length; i++) {

        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;

        if (event.message && event.message.text) {
            var text = event.message.text;

            sendTextMessage(sender, "Echo: " + text.substring(0, 200));
        }
    }

    res.sendStatus(200);

});

app.listen(process.env.PORT || 8080, function () {

    console.log('Facebook Messenger echoing bot started on port 1337!');

});

function sendTextMessage(sender, text) {

    var messageData = {
        text: text
    };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function (error, response) {

        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }

    });

}