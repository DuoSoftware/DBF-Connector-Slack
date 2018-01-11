const request = require('request');

class Template {
    constructor() {

    }
}

class FacebookTemplate extends Template {
    constructor(PSID, Ttype, CommonJSON) {
        super();
        this.PSID = PSID;
        this.TemplateType = Ttype;
        this.CommonJSON = CommonJSON;

        this.TemplateJSON = this.GetBroilerPlateJSON();
    }

    GetBroilerPlateJSON() {
        return {
            messaging_type: "RESPONSE",
            recipient:{id: this.PSID},
            message:{}
        }
    }

    Generate() {
        switch (this.TemplateType) {
            case "text":
                this.TemplateJSON.message.text = this.CommonJSON.text;
                break;
            case "card":
                this.TemplateJSON.message.attachment = {
                    type: "template",
                    payload: {
                        template_type: this.CommonJSON.type,
                        elements: [

                        ]
                    }
                }

                for (var i = 0; i < this.CommonJSON.items.length; i++) {
                    let item = this.CommonJSON.items[i];
                    this.TemplateJSON.message.attachment.payload.elements[i] = {};
                    this.TemplateJSON.message.attachment.payload.elements[i].title = item.title;
                    this.TemplateJSON.message.attachment.payload.elements[i].subtitle = item.sub_title;
                    this.TemplateJSON.message.attachment.payload.elements[i].image_url = item.image_url;
                    if (item.default_action){
                        this.TemplateJSON.message.attachment.payload.elements[i].default_action = {
                            type: "web_url",
                            url: item.default_action.url,
                            messenger_extensions: true,
                            webview_height_ratio: "tall",
                            fallback_url: item.default_action.url
                        }
                    }
                    if (item.buttons.length > 0){
                        this.TemplateJSON.message.attachment.payload.elements[i].buttons = [];

                        for (var x = 0; x < item.buttons.length; x++){
                            let button = item.buttons[x];
                            switch(button.type) {
                                case "web_url":
                                    this.TemplateJSON.message.attachment.payload.elements[i].buttons[x]={
                                        type: button.type,
                                        title: button.title,
                                        url: button.other_data.url
                                    }
                                    break;
                                case "postback":
                                    this.TemplateJSON.message.attachment.payload.elements[i].buttons[x]={
                                        type: button.type,
                                        title: button.title,
                                        payload: button.payload.message
                                    }
                                    break;
                                default:
                                    console.log("unknown button type.. Fatal error...")
                                    break;
                            }
                        }
                    }
                }

                if (this.CommonJSON.buttons && this.CommonJSON.buttons.length > 0){
                    this.TemplateJSON.message.attachment.payload.buttons = [];
                    for (var x = 0; x < this.CommonJSON.buttons.length; x++){
                        let button = this.CommonJSON.buttons[x];
                        switch(button.type) {
                            case "web_url":
                                this.TemplateJSON.message.attachment.payload.buttons[x]= {
                                    type: button.type,
                                    title: button.title,
                                    url: button.other_data.url
                                }
                                break;
                            case "postback":
                                this.TemplateJSON.message.attachment.payload.buttons[x] = {
                                    type: button.type,
                                    title: button.title,
                                    payload: button.payload.message
                                }
                                break;
                            default:
                                console.log("unknown button type.. Fatal error...")
                                break;
                        }
                    }
                }

                break;
            case "attachment":
                console.log("Attachments not implemented yet.");
                break;
            case "quickreply":
                if (this.CommonJSON.text) {
                    this.TemplateJSON.message.text = this.CommonJSON.text;
                    if (this.CommonJSON.items.length > 0) {
                        this.TemplateJSON.message.quick_replies = [];
                        for (var x = 0; x < this.CommonJSON.items.length; x++) {
                            let item = this.CommonJSON.items[x];
                            switch (item.type) {
                                case "text":
                                    this.TemplateJSON.message.quick_replies[x] = {
                                        content_type: "text",
                                        title: item.title,
                                        payload: item.payload,
                                    };
                                    if (item.image){
                                        this.TemplateJSON.message.quick_replies[x].image_url = item.image;
                                    }
                                    break;
                                case "location":
                                    this.TemplateJSON.message.quick_replies[x] = {
                                        content_type: "location"
                                    };
                                    break;
                                default:
                                    console.log("Fatal Error : Unknown quickreply item type");
                                    break;
                            }
                        }
                    }
                }else{
                    console.log("Fatal Error : Not enough quick reply items to display");
                }
                break;
            case "actioncard":
                console.log("Attachments not implemented yet.");
                break;
            default:
                console.log("ERROR : Unsupported response type.");
                this.result.message = "ERROR : Unsupported response type."
                break;
        }
        return this.TemplateJSON;
    }
}

module.exports.FacebookTemplate = FacebookTemplate;