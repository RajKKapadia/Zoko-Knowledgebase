const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

// spreadsheet key is the long id in the sheets URL
const SHEET_ID = process.env.SHEET_ID;
const doc = new GoogleSpreadsheet(SHEET_ID);

// Credentials for the service account
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const getSimpleResponse = async () => {

    // use service account creds
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    await doc.loadInfo();

    let sheet = doc.sheetsByIndex[0];

    let rows = await sheet.getRows();

    console.log(rows[0].ans);
};

const getMenuItem = async (menuItem) => {

    // use service account creds
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    await doc.loadInfo();

    let sheet = doc.sheetsByIndex[1];

    let rows = await sheet.getRows();

    let response = '';

    for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (row.menuItem === menuItem) {
            response += `The item ${row.menuItem} has ${row.ingredients} in it, it has ${row.calories} calories, ${row.protein} protein, and ${row.carbohydrates} carbohydrates.`;
        }
    };

    if (response === '') {
        response += `We don't have information on the item ${menuItem}.`;
    }

    return response;
};

const getLocationInfo = async (store, infoType) => {

    // use service account creds
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    await doc.loadInfo();

    let sheet = doc.sheetsByIndex[2];

    let rows = await sheet.getRows();

    let response = '';

    for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (row.store === store) {
            if (infoType === 'hours' && row.status === 'Open') {
                response += `We are open for ${row.newHours}.`;
            } else if (infoType === 'hours' && row.status === 'Closed') {
                response += `Hey, ${row.newHours}.`;
            }  else if (infoType === 'orders') {
                response += `You can order food online at ${row.currentPickup}.`;
            } else if (infoType === 'phoneNumber') {
                response += `Phone number of the store location ${store} is ${row.phoneNumber}.`;
            } else if (infoType === 'address') {
                response += `The address of the store location ${store} is ${row.address}.`;
            } else if (infoType === 'delivery') {
                response += `Great, here’s the link to order: ${row.currentDelivery} Have a great day!`
            }
        }
    };

    if (response === '') {
        response += `We don't have information for the store location ${store}.`;
    }

    return response;
};

const getPhoneNumberForIVR = async (store_locations) => {

    // use service account creds
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    await doc.loadInfo();

    let sheet = doc.sheetsByIndex[2];

    let rows = await sheet.getRows();

    let response = {
        status: false,
        phoneNumber: ''
    };

    for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if (row.store === store_locations && row.status === 'Open') {
            let phoneNumber = row.phoneNumber;
            response.status = true;
            response.phoneNumber += `+1${phoneNumber}`;
        } else if (row.store === store_locations && row.status === 'Closed') {
            response.phoneNumber += `Sorry, we are permanently closed at ${store_locations}.`;
        }
    };

    if (response.phoneNumber === '') {
        response.phoneNumber += `Hey, we don't serve at the location ${store_locations}.`;
    }

    return response;
};

// getPhoneNumberForIVR('Lacey (Toms River)')
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

module.exports = {
    getSimpleResponse,
    getMenuItem,
    getLocationInfo,
    getPhoneNumberForIVR
};