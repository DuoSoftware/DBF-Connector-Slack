const validator = require('validator');
const logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
const config = require('config');
//const messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
const Promise = require("bluebird");
const request = require("request")

module.exports.GetCardByID = (tenant, company, cardid) => {

    return new Promise(function (resolve, reject) {
        if ((config.Services && config.Services.botServiceHost && config.Services.botServicePort && config.Services.botServiceVersion)) {

            var dispatchURL = `http://${config.Services.botServiceHost}/DBF/API/${config.Services.botServiceVersion}/ViewService/Card/${cardid}`;
            if (validator.isIP(config.Services.botServiceHost))
                dispatchURL = `http://${config.Services.botServiceHost}:${config.Services.botServicePort}/DBF/API/${config.Services.botServiceVersion}/ViewService/Card/${cardid}`;

            request({
                method: "GET",
                url: dispatchURL,
                headers: {
                    authorization: "bearer " + config.Services.accessToken,
                    companyinfo: `${tenant}:${company}`
                }

            }, function (_error, _response, datax) {

                try {

                    if (!_error && _response && _response.statusCode == 200 && JSON.parse(datax).IsSuccess) {

                        resolve(JSON.parse(datax).Result);

                    } else {

                        let error = new Error(`There is an error in get bot`);
                        reject(error);
                    }
                }
                catch (excep) {

                    reject(excep);
                }
            });
        } else {

            reject(new Error("Service is not configured properly "));
        }

    });
};

module.exports.GetQuickReplyByID = (tenant, company, quickreply_id) => {

    return new Promise(function (resolve, reject) {
        if ((config.Services && config.Services.botServiceHost && config.Services.botServicePort && config.Services.botServiceVersion)) {

            var dispatchURL = `http://${config.Services.botServiceHost}/DBF/API/${config.Services.botServiceVersion}/ViewService/QuickReply/${quickreply_id}`;
            if (validator.isIP(config.Services.botServiceHost))
                dispatchURL = `http://${config.Services.botServiceHost}:${config.Services.botServicePort}/DBF/API/${config.Services.botServiceVersion}/ViewService/QuickReply/${quickreply_id}`;

            request({
                method: "GET",
                url: dispatchURL,
                headers: {
                    authorization: "bearer " + config.Services.accessToken,
                    companyinfo: `${tenant}:${company}`
                }

            }, function (_error, _response, datax) {

                try {

                    if (!_error && _response && _response.statusCode == 200 && JSON.parse(datax).IsSuccess) {

                        resolve(JSON.parse(datax).Result);

                    } else {

                        let error = new Error(`There is an error in get bot`);
                        reject(error);
                    }
                }
                catch (excep) {

                    reject(excep);
                }
            });
        } else {

            reject(new Error("Service is not configured properly "));
        }

    });
};

module.exports.GetCardByIDSample = (tenant, company, cardid) => {return {
    company: company,
    tenant: tenant,
    created_at: "2017-12-29T08:45:00.502Z",
    updated_at: "2017-12-29T08:45:00.502Z",
    type: "generic",
    items: [
        {
            title: "Cheese Pizza",
            sub_title: "Delicious pizza with Cheese and Chicken",
            image_url: "https://img.grouponcdn.com/deal/ibndC8sSczsdM5whApdG/Z1-700x420/v1/c700x420.jpg",
            default_action: {
                url: "https://www.pizzahut.lk",
            },
            buttons: [
                {
                    type: "web_url",
                    title: "View Details",
                    payload: {},
                    other_data: {
                        url:"https://www.pizzahut.lk"
                    }
                },
                {
                    type: "postback",
                    title: "Order Now",
                    payload: {
                        message: "I want a Cheese pizza"
                    },
                    other_data: {
                        url:"https://www.pizzahut.lk"
                    }
                }
            ]
        },
        {
            title: "Chicken Pizza",
            sub_title: "Delicious pizza with Chilli and Chicken",
            image_url: "https://s3-media2.fl.yelpcdn.com/bphoto/W7en943upohbhLqDsgxHzg/348s.jpg",
            default_action: {
                url: "https://www.pizzahut.lk",
            },
            buttons: [
                {
                    type: "web_url",
                    title: "View Details",
                    payload: {},
                    other_data: {
                        url:"https://www.pizzahut.lk"
                    }
                },
                {
                    type: "postback",
                    title: "Order Now",
                    payload: {
                        message: "I want a Chicken pizza"
                    },
                    other_data: {
                        url:"https://www.pizzahut.lk"
                    }
                }
            ]
        }
    ],
    buttons: []
}};

module.exports.GetQuickReplyByIDSample = (tenant, company, quickreplyid) => { return {
    company: company,
    tenant: tenant,
    created_at: "2017-12-29T08:45:00.502Z",
    updated_at: "2017-12-29T08:45:00.502Z",
    text: "How do you want to get your pizza?",
    items: [
        {
            type: "text",
            title: "Pickup",
            payload: "pickup"
        },
        {
            type: "location"
        }
    ],
}};