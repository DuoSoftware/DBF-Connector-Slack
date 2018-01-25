const validator = require('validator');
const logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
const config = require('config');
const messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
const Promise = require("bluebird");
const request = require("request")

module.exports.InvokeDispatch = function(company, tenant,payload){

    return new Promise(function(resolve, reject) {
        if((config.Services && config.Services.dispatchServiceHost && config.Services.dispatchServicePort && config.Services.dispatchServiceVersion)) {


            var dispatchURL = `https://${config.Services.dispatchServiceHost}/DBF/API/${config.Services.dispatchServiceVersion}/Dispatcher/Invoke/`;
            if (validator.isIP(config.Services.dispatchServiceHost))
                dispatchURL = `https://${config.Services.dispatchServiceHost}:${config.Services.dispatchServicePort}/DBF/API/${config.Services.dispatchServiceVersion}/Dispatcher/Invoke/`;

            console.log(dispatchURL)

            request({
                method: "POST",
                url: dispatchURL,
                headers: {
                    authorization: "bearer "+config.Services.accessToken,
                    companyinfo: `${tenant}:${company}`
                },
                json: payload
            }, function (_error, _response, datax) {

                try {

                    if (!_error && _response && _response.statusCode === 200&& _response.body) {

                        resolve( _response.body);

                    }else{

                        let error =  new Error(`There is an error in invoke dispatcher`);
                        reject(error);
                    }
                }
                catch (excep) {

                    reject(excep);
                }
            });
        }else{

            reject(new Error("Service is not configured properly "));
        }

    });
};
