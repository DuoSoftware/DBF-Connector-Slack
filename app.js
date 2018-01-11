const restify = require('restify');
const config = require('config');
const messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
const jwt = require('restify-jwt');
const secret = require('dvp-common-lite/Authentication/Secret.js');
const authorization = require('dvp-common-lite/Authentication/Authorization.js');
const logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
const corsMiddleware = require('restify-cors-middleware');

//const slackEvents = require('./Worker/SlackEvents');

const HandleMessage = require('./Worker/MessageHandler').HandleMessage;
const Validator = require('./Worker/MessageHandler').Validate;
const GetProfile = require('./Worker/MessegeSender').GetProfile;

const port = config.Host.port || 3640;
const version=config.Host.version;
const hpath=config.Host.hostpath;


const server = restify.createServer({
    name: "slack-connector",
    version: '1.0.0'
},function(req,res)
{

});


const cors = corsMiddleware({
    allowHeaders: ['authorization']
})

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.queryParser({
    mapParams: true
}));
server.use(restify.plugins.bodyParser({
    mapParams: true
}));


server.listen(port, () => {
    console.log('%s listening at %s', server.name, server.url);
});



const GetToken = function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0].toLowerCase() === 'bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.params && req.params.Authorization) {
        return req.params.Authorization;
    } else if (req.query && req.query.Authorization) {
        return req.query.Authorization;
    }
    return null;
};



//https://094/DBF/API/1.0.0.0/tenant/1/company/103/bot/123
//server.post('/DBF/API/:version/tenant/:tenant/company/:company/bot/:bid',HandleMessage);
server.post('/DBF/API/:version/tenant/:tenant/company/:company/bot/:bid/slack',Validator);



server.post('/DBF/API/:version/BotConnector/Platform/:platform/UserProfile/:uid',jwt({secret: secret.Secret,getToken: GetToken}),
    authorization({resource:"client", action:"read"}),GetProfile);


