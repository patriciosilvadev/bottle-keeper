require('dotenv').config()
const request = require('request');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Handles messages events
function handleMessage(sender_psid, received_message) {

  let response;

  // Check if the message contains text
  if (received_message.text) {

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}"`
    }
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "messaging_type": 'RESPONSE',
    "message": {
        "text": response,
        "quick_replies": [
            {
                "content_type":"text",
                "title":"Yes",
                "payload":"User clicked Yes",
            },
            {
                "content_type":"text",
                "title":"No",
                "payload":"User click No",
            }
        ]
    }
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
      console.log('result', res);
      console.log('body', body);
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

module.exports = { handlePostback, handleMessage, callSendAPI }
