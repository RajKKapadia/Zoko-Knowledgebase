const express = require('express');
require('dotenv').config();

const webApp = express();

webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());

const PORT = process.env.PORT;

webApp.get('/', (req, res) => {
    res.send(`Hello World.!`);
});

const DIALOGFLOW_API = require('../helper_functions/dialogflow_api');
const ZOKO_API = require('../helper_functions/zoko_api');

const sleep = (milliseconds) => {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
};

webApp.post('/whatsapp', async (req, res) => {

    let message = req.body.text;
    let sender_id = req.body.platformSenderId.split('+')[1];

    console.log('A new message came.')
    console.log(sender_id);
    console.log(message);

    try {
        let intent_data = await DIALOGFLOW_API.detectIntent(message, sender_id);
        console.log('Intent detected.')
        console.log(intent_data.text);
        let data = JSON.parse(intent_data.text);
        let text_messages = data.text;
        let buttons = data.buttons;
        console.log('Intent extracted.');
        console.log(text_messages);
        console.log(buttons);
        for (let index = 0; index < text_messages.length; index++) {
            const text = text_messages[index];
            if (index == text_messages.length - 1) {
                if (buttons.length == 0) {
                    await ZOKO_API.sendTextMessage(text, sender_id);
                } else {
                    await ZOKO_API.sendButtonMessage(buttons, text, sender_id);
                }
            } else {
                await ZOKO_API.sendTextMessage(text, sender_id);
            }
            sleep(1000);
        }
    } catch (error) {
        console.log(`Error at wehatsapp route --> ${error}`);
        await ZOKO_API.sendTextMessage('Sorry, an error occured at whatsapp route.', sender_id);
    }
    res.sendStatus(200);
});

webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});