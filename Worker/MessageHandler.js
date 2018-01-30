const SendMessenger = require('./MessegeSender');
const request = require('request');
const Payload = require('../Common/Payload');
var validator = require('validator');
var format = require("stringformat");
const logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
var dispatcher = require('../Utility/Dispatcher');


module.exports.Validate = function (req, res, next) {

    if(req.body.challenge){
        console.log("Challenge Accepted");
        res.send(200,req.body.challenge,{'Content-type' : 'text/plain'});
        next();
    }


    //TODO : Find mechanism to check 'file_share' type for bot users only when file share is expected of user like 'bot_message' type
     if(req.body.event && req.body.event.subtype !== 'bot_message' && req.body.event.subtype !== 'file_share' ){
        HandleMessage(req, function (found) {

        });

        res.send(200);
    }

    else if(req.body.hasOwnProperty('payload')){
        let payload = JSON.parse(req.body.payload);
        //console.log(payload);

        if(payload.type && payload.type === 'interactive_message'){

            let modObj ={};
            modObj.body ={};
            modObj.params = req.params;
            modObj.body.event ={
                type :'message',
                user: payload.user.id,
                channel :  payload.channel.id,
                text: payload.actions[0].value,
                response_url : payload.response_url

            };

            //console.log(modObj);

            HandleMessage(modObj, function (found) {

            });


        }
        res.send(200);
    }
    else{
        res.send(200);
    }







};

let GetEventType = (event) => {
    var retType;
    if (event.type) {
        retType = event.subtype;
    } else {
        retType = "text";
    }
    return retType;
};


let GetEventData = (event) => {
    var eventData;
    if (event.message.type) {
        switch (event.message.type){
            case "location":
                eventData = event.message.data;
                break;
            case "postback":
                eventData = event.message.data;
                break;
            default:
                //for now.. later might be changed
                eventData = event.message.data;
                break;
        }
    } else {
        eventData = event.message.text;
    }
    return eventData;
};


function HandleMessage (req, res) {

    //commenting this line since we are getting message did read lines as well
    //console.log(JSON.stringify(req.body));

    let event = req.body.event;

    const company = req.params.company;
    const tenant = req.params.tenant;




    if (event && event.type === 'message') {


        /*if (event.postback) {
            //console.log("Incoming payload event : " + new Date().toLocaleString());
            //console.log(JSON.stringify(event.postback) + "\n");
            //redirect to message system.
            event.message = {type: "postback", data: event.postback.payload};
        }*/

        if (event.text) {
            console.log("Incoming Message : " + new Date().toLocaleString());


            //Create payload for dispatcher
            let payload = Payload.Payload();
            payload.direction = "in";
            payload.platform = "slack";
            payload.engagement = "slack";
            payload.bid = req.params.bid;
            payload.from.id = event.user;
            payload.to.id = event.channel;




            if (!event.hasOwnProperty('subtype')){
                payload.message.type = 'text';
            }
            else {
                payload.message.type = GetEventType(event);
            }

            payload.message.data = event.text;



            console.log("Payload to Dispatcher : ");
            console.log(JSON.stringify(payload));

            dispatcher.InvokeDispatch(company, tenant, payload).then(function (data) {
                console.log("Payload from Dispatcher : ");
                //console.log(JSON.stringify(data));
                //console.log( data.session.bot.channel_slack);
                console.log(data.message.outmessage);
                if (data && data.message && data.message.outmessage) {

                    switch (data.message.outmessage.type) {
                        case "action":
                            SendMessenger.SendAction(data);
                            break;
                        case  "text" :
                            SendMessenger.SendMessage(data);
                            break;
                        case "attachment":
                            SendMessenger.SendAttachment(data);
                            break;
                        case "quickreply":
                            SendMessenger.SendQuickReply(data,event);
                            break;
                        case "card":
                            SendMessenger.SendCard(data);
                            break;
                        case "list":
                            SendMessenger.SendList(data);
                            break;
                        case "button":
                            SendMessenger.SendButton(data);
                            break;
                        case "media":
                            SendMessenger.SendMedia(data);
                            break;
                        case "reciept":
                            SendMessenger.SendReciept(data);
                            break
                        case "persistmenu":
                            SendMessenger.CreatePersistMenu(data);
                            break;
                        default:
                            data.message.outmessage.type = "text";
                            data.message.outmessage.message = "TypeError!"
                            SendMessenger.SendMessage(data);
                            break;

                    }
                    //console.log("Request completed. \n");
                } else {
                    //console.log("There is no out message found ");
                }

            }).catch(function (error) {

            });

            // if (payload.message && payload.message.data) {
            //
            //     request({
            //         method: "POST",
            //         url: "http://localhost:3638/DBF/API/1.0.0.0/Dispatcher/Invoke",
            //         json: payload
            //     }, function (_error, _response, datax) {
            //
            //         SendMessenger.SendTyping(payload, false);
            //
            //
            //
            //
            //         //SendMessage(datax);
            //     });
            // }
        } else {
            //currently ignore any other msg types such as read, delivered....
            //add code later if needed for those callbacks
            ////console.log("Other Event : ");
            ////console.log(JSON.stringify(req.body));
        }





    }
}