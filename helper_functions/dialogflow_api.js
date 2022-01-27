const dialogflow = require('@google-cloud/dialogflow').v2beta1;
require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const projectId = CREDENTIALS.project_id;

const knowledgeBasePath = process.env.knowledgeBasePath;

const config = {
    credentials: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    }
}

const sessionClient = new dialogflow.SessionsClient(config);

const detectIntent = async (queryText, sessionId) => {

    let sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    let request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText,
                languageCode: 'en-US',
            }
        },
        queryParams: {
            knowledgeBaseNames: [knowledgeBasePath]
        }
    };

    try {
        let responses = await sessionClient.detectIntent(request);
        let result = responses[0].queryResult;
        if (result.knowledgeAnswers && result.knowledgeAnswers.answers) {
            let answers = result.knowledgeAnswers.answers;
            return {
                status: 200,
                text: JSON.stringify({
                    text: [
                        answers[0].answer
                    ],
                    buttons: []
                })
            };
        } else {
            return {
                status: 200,
                text: result.fulfillmentMessages[0].text.text[0]
            };
        }
    } catch (error) {
        console.log(`Error at detectIntent --> ${error}`);
        return {
            status: 401,
            text: 'None'
        };
    }
};

module.exports = {
    detectIntent
}