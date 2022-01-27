const axios = require('axios');
require('dotenv').config();

const sendTextMessage = async (message, recipient) => {

  let data = JSON.stringify({
    channel: 'whatsapp',
    recipient: recipient,
    type: 'text',
    message: message
  });

  let config = {
    method: 'post',
    url: 'https://chat.zoko.io/v2/message',
    headers: {
      'apikey': process.env.API_KEY,
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    let response = await axios(config);
    console.log(response.data);
  } catch (error) {
    console.log(`Error at sendTextMessage --> ${error}`);
  }
};

const sendButtonMessage = async (buttons, message, recipient) => {

  let formatted_buttons = [];

  buttons.forEach(button => {
    formatted_buttons.push(
      {
        reply: {
          payload: button,
          title: button
        }
      }
    );
  });

  let data = JSON.stringify({
    channel: 'whatsapp',
    recipient: recipient,
    type: 'interactive_button',
    interactiveButton: {
      body: {
        text: message
      },
      buttons: formatted_buttons
    }
  });

  let config = {
    method: 'post',
    url: 'https://chat.zoko.io/v2/message',
    headers: {
      'apikey': process.env.API_KEY,
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    let response = await axios(config);
    console.log(response.data);
  } catch (error) {
    console.log(`Error at sendTextMessage --> ${error}`);
  }
};

module.exports = {
  sendTextMessage,
  sendButtonMessage
};
