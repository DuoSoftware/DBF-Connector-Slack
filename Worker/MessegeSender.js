const request = require('request');
const config = require('config');
const messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
//const TemplateService = require('../Templates/Template.js');
const ViewService = require('../Utility/ViewService.js');
const async = require('async');
const FormData = require('form-data');
const fs = require('fs');

module.exports.GetProfile = function (req, res) {


    //console.log(req.body.channel_slack.api_token)
    //console.log(req.params.uid)
    let sender = req.params.uid;
    let SlackApiToken;
    if (req.body.channel_slack.api_token){
        SlackApiToken = req.body.channel_slack.api_token;
    }else{
        console.log("Unable to retrieve user profile : token field not found."); return;
    }

    request({
        url: `https://slack.com/api/users.info?token=${SlackApiToken}&user=${sender}`,
        method: 'GET',
        headers :{
            'Content-Type':'application/x-www-form-urlencoded'
        }

    }, function (error, response) {

        //console.log(JSON.parse(response.body).user.real_name);

        let jsonString;
        if (error) {
            console.log('Error sending message: ', error);
            jsonString=messageFormatter.FormatMessage(error, "Get Profile failed", false, undefined);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
            jsonString=messageFormatter.FormatMessage(response.body.error, "Get Profile failed", false, undefined);
        }else{

            let name = JSON.parse(response.body).user.real_name;
            let nameArr = name.split(" ");

            let obj = {};
            if(nameArr.length >= 2){
                obj.first_name = nameArr[0];
                obj.last_name = nameArr[1];
            }
            else {
                obj.first_name = nameArr[0];
                obj.last_name = "";
            }

            obj.user = JSON.parse(response.body).user;


            jsonString=messageFormatter.FormatMessage(undefined, "Get Profile succeed", true, obj);
        }
        //console.log(jsonString);

        res.end(jsonString);
    });


};

module.exports.SendMessage = function (event) {
    let SLACKbotToken = GETSLACKbotToken(event);
    if (SLACKbotToken === "N/A"){
        return;
    }

    let sender = event.from.id;
    let tenant = event.session.bot.tenant;
    let company = event.session.bot.company;

    let text = "error";
    if (event.message.outmessage && event.message.outmessage.type === "text") {
        if (event.message.outmessage.message !== "") {
            text = event.message.outmessage.message;
        } else {
            text = "That I can't answer. Anything else you want to know? :)";
        }


    }


    request({
        //url: 'https://slack.com/api/chat.postMessage?token='+SLACKbotToken+'&channel='+event.to.id+'&text='+event.message.outmessage.message,
        url: 'https://slack.com/api/chat.postMessage',

        method: 'POST',
        headers :{
            'Content-Type':'application/x-www-form-urlencoded'
        },
        form: {
            token :SLACKbotToken,
            channel :event.to.id,
            text: event.message.outmessage.message,
            //attachments :JSON.stringify(obj)
        }
    }, function (error, response) {

        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }else{
            console.log(response.body);
        }

    });


};

module.exports.SendCard = function (event) {
    let SLACKbotToken = GETSLACKbotToken(event);
    if (SLACKbotToken === "N/A"){
        return;
    }

    let sender = event.from.id;
    let tenant = event.session.bot.tenant;
    let company = event.session.bot.company;

    let templateJSON = {};
    if (event.message.outmessage) {
        if (event.message.outmessage.type !== "card") {
            console.log("Not a card."); return;
        }
    }


    let cardId = event.message.outmessage.message;
    //console.log("Card ID : "+ cardId);
    //Call to ViewService and get the Common JSON.
    ViewService.GetCardByID(tenant, company, cardId).then(function (data) {
        let CommonJSON = data;
        //Pass it to Template service and get the specific facebook template.



        //console.log(CommonJSON.items)

        let actionsArr = [];

        let count = 0;


        for (let value of CommonJSON.items) {
            //console.log(value);
            count++;
            async.waterfall([
                function(callback) {

                    let image = {
                        "title": value.sub_title,
                        "author_name": value.title,
                        "author_icon": "",
                        "image_url": value.image_url
                    };

                    callback(null, image);
                },
                function(image, callback) {

                    actionsArr.push(image);
                    callback(null);
                },
                function(callback) {

                    let action = {
                        "name": value.title,
                        "text": value.title,
                        "style": "danger",
                        "type": "button",
                        "value": value.sub_title,
                        "confirm": {
                            "title": "Are you sure?",
                            "text": "Are you sure?",
                            "ok_text": "Yes",
                            "dismiss_text": "No"
                        }
                    };

                    let obj = {
                        "text": value.title,
                        "fallback": "",
                        "callback_id": sender,
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "actions": [action]
                    };

                    actionsArr.push(obj);
                    callback(null, 'done');
                }
            ], function (err, result) {
                // result now equals 'done'


            });


            if(count>=50){
                break;
            }



        }


        request({
            //url: 'https://slack.com/api/chat.postMessage?token='+SLACKbotToken+'&channel='+event.to.id+'&text='+event.message.outmessage.message,
            url: 'https://slack.com/api/chat.postMessage',

            method: 'POST',
            headers :{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            form: {
                token :SLACKbotToken,
                channel :event.to.id,
                attachments : JSON.stringify(actionsArr)

            }

        }, function (error, response) {


            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }else{
                //console.log(response.body);
            }

        });
    }).catch(function (error) {
        console.log(error);
    });
};

module.exports.SendAction = function (event) {
    let SLACKbotToken = GETSLACKbotToken(event);
    if (SLACKbotToken === "N/A"){
        return;
    }

    let sender = event.from.id;

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',

        method: 'POST',
        json: {
            recipient: {id: sender},
            sender_action: event.message.outmessage.message // mark_seen, typing_on, typing_off
        }
    }, function (error, response) {
        if (error) {
            console.log(`Error sending action : `, error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });

};

module.exports.SendAttachment = function (event) {
    let SLACKbotToken = GETSLACKbotToken(event);
    if (SLACKbotToken === "N/A"){
        return;
    }

    let sender = event.from.id;
    let tenant = event.session.bot.tenant;
    let company = event.session.bot.company;

    let attachmentid = event.message.outmessage.message;

    ViewService.GetAttachmentByID(tenant, company, attachmentid).then(function (data) {
    //ViewService.GetAttachmentByID(tenant, company, '5a544d9ff1c26e206c369493').then(function (data) {

        let name  = (data.payload.url.split('/')).slice(-1)[0];



        let form = new FormData();

        form.append('token', SLACKbotToken);
        form.append('channels', event.to.id);
        form.append('as_user', 'false');
        form.append('title', name);
        form.append('filename', name);
        form.append('filetype', 'auto');
        //form.append('file', response.body);
        form.append('file',  request(data.payload.url));

        form.submit('https://slack.com/api/files.upload', function(err, res) {
            // res – response object (http.IncomingMessage)  //
            console.log(res.statusCode);
            res.resume();
        });





    });







};



module.exports.SendQuickReply = function (event, slackData) {





    let SLACKbotToken = GETSLACKbotToken(event);
    if (SLACKbotToken === "N/A"){
        return;
    }

    let sender = event.from.id;
    let tenant = event.session.bot.tenant;
    let company = event.session.bot.company;






    if (event.message.outmessage && event.message.outmessage.type === "quickreply") {

        let text = "error";

        let quickreplyid = event.message.outmessage.message;
        ViewService.GetQuickReplyByID(tenant, company, quickreplyid).then(function (data) {


            let actionsArr = [];

            //console.log(data.items);
            for (let value of data.items) {


                let action = {
                    "name": value.title,
                    "text": value.title,
                    "style": "default",
                    "type": "button",
                    "value": value.payload,
                    /*"confirm": {
                     "title": "Are you sure?",
                     "text": "Are you sure?",
                     "ok_text": "Yes",
                     "dismiss_text": "No"
                     }*/
                };

                actionsArr.push(action);
            }


            if (data.text !== "") {
                text = data.text;
            } else {
                text = "That I can't answer. Anything else you want to know? :)";
            }

            //console.log(JSON.stringify({attachments :actionsArr}));

            request({
                url: 'https://slack.com/api/chat.postMessage',

                method: 'POST',
                headers :{
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                form: {
                    token :SLACKbotToken,
                    channel :event.to.id,
                    //text: slackData.text,
                    attachments: JSON.stringify([
                        {
                            color: "good",
                            text: `*${slackData.text}*`

                        }
                    ])

                }
            }, function (error, response) {

                if (error) {
                    console.log('Error sending message: ', error);
                } else if (response.body.error) {
                    console.log('Error: ', response.body.error);
                }else{

                    request({
                        url: 'https://slack.com/api/chat.postMessage',

                        method: 'POST',
                        headers :{
                            'Content-Type':'application/x-www-form-urlencoded'
                        },
                        form: {
                            token :SLACKbotToken,
                            channel :event.to.id,
                            text: text,
                            attachments :JSON.stringify([
                                {
                                    "text": "",
                                    "fallback": "",
                                    "callback_id": sender,
                                    "attachment_type": "default",
                                    "replace_original": true,
                                    "actions": actionsArr
                                }
                            ])
                        }
                    }, function (error, response) {

                        if (error) {
                            console.log('Error sending message: ', error);
                        } else if (response.body.error) {
                            console.log('Error: ', response.body.error);
                        }else{
                            console.log(response.body);
                        }

                    });
                }

            });




        });

    }



};



module.exports.SendList = function (event) {
    let SLACKbotToken = GETSLACKbotToken(event);
    if (SLACKbotToken === "N/A"){
        return;
    }

    let sender = event.from.id;

    let payload = [];
    if (event.message.outmessage) {
        if (event.message.outmessage.type === "list") {
            payload = event.message.outmessage.message;
        }
    }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',

        method: 'POST',
        json: {
            messaging_type: "RESPONSE",
            recipient: {id: sender},
            message: {attachment: {type: "template", payload: payload}}
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending list : ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });


};



module.exports.SendReciept = function (event) {
    let SLACKbotToken = GETSLACKbotToken(event);
    if (SLACKbotToken === "N/A"){
        return;
    }

    let sender = event.from.id;

    let payload = [];
    if (event.message.outmessage) {
        if (event.message.outmessage.type === "reciept") {
            payload = event.message.outmessage.message;
        }
    }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',

        method: 'POST',
        json: {
            messaging_type: "RESPONSE",
            recipient: {id: sender},
            message: {attachment: {type: "template", payload: payload}}
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending reciept : ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });


};



let GETSLACKbotToken = (data) => {
    let SLACKbotToken = "";
    if (data.session){
        if (data.session.bot){
            if (data.session.bot.channel_slack){
                SLACKbotToken = data.session.bot.channel_slack.bot_token;
            }else{
                console.log("Error getting SLACK token : channel_slack not found.");
                SLACKbotToken = "N/A";
            }
        }else{
            console.log("Error getting SLACK token : bot not found.");
            SLACKbotToken = "N/A";
        }
    }else{
        console.log("Error getting SLACK token : session not found.");
        SLACKbotToken = "N/A";
    }

    return SLACKbotToken;
};