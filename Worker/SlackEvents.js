/*

// Initialize using verification token from environment variables
const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
const { WebClient } = require('@slack/client');
const slackEvents = createSlackEventAdapter('V4RziySqYN8QvGQuWHDjYcxD');
// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = "xoxb-295303466291-3v495qCgo2KpVJRthuQ8CGAx";
const port = process.env.PORT || 3640;
const web = new WebClient(token);


// Attach listeners to events by Slack Event "type". See: https://api.slack.com/events/message.im
slackEvents.on('message', (event) => {
    console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);


    if(event.user !== undefined)        {
        console.log('ewewewewewewewewewewe');
        //reply(event.channel);

        web.chat.postMessage(event.channel, 'Hello there')
            .then((res) => {
                // `res` contains information about the posted message
                console.log('Message sent: ', res.ts);

            })
            .catch(console.error);

    }

});





*/
