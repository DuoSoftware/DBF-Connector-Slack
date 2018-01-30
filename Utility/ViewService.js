const validator = require('validator');
const logger = require('dvp-common-lite/LogHandler/CommonLogHandler.js').logger;
const config = require('config');
//const messageFormatter = require('dvp-common-lite/CommonMessageGenerator/ClientMessageJsonFormatter.js');
const Promise = require("bluebird");
const request = require("request");

module.exports.GetAttachmentByID = (tenant, company, id) => {

    return new Promise(function (resolve, reject) {
        if ((config.Services && config.Services.botServiceHost && config.Services.botServicePort && config.Services.botServiceVersion)) {

            let dispatchURL = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}/DBF/API/${config.Services.botServiceVersion}/ViewService/Attachment/${id}`;
            if (validator.isIP(config.Services.botServiceHost))
                dispatchURL = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}:${config.Services.botServicePort}/DBF/API/${config.Services.botServiceVersion}/ViewService/Attachment/${id}`;

            request({
                method: "GET",
                url: dispatchURL,
                headers: {
                    authorization: "bearer " + config.Services.accessToken,
                    companyinfo: `${tenant}:${company}`
                }

            }, function (_error, _response, datax) {

                try {

                    if (!_error && _response && _response.statusCode === 200 && JSON.parse(datax).IsSuccess) {

                        resolve(JSON.parse(datax).Result);

                    } else {

                        let error = new Error(`There is an error in get attachment`);
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

module.exports.GetReceiptByID = (tenant, company, id) => {

    return new Promise(function (resolve, reject) {
        if ((config.Services && config.Services.botServiceHost && config.Services.botServicePort && config.Services.botServiceVersion)) {

            let dispatchURL = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}/DBF/API/${config.Services.botServiceVersion}/ViewService/Receipt/${id}`;
            if (validator.isIP(config.Services.botServiceHost))
                dispatchURL = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}:${config.Services.botServicePort}/DBF/API/${config.Services.botServiceVersion}/ViewService/Receipt/${id}`;

            request({
                method: "GET",
                url: dispatchURL,
                headers: {
                    authorization: "bearer " + config.Services.accessToken,
                    companyinfo: `${tenant}:${company}`
                }

            }, function (_error, _response, datax) {

                try {

                    if (!_error && _response && _response.statusCode === 200 && JSON.parse(datax).IsSuccess) {

                        resolve(JSON.parse(datax).Result);

                    } else {

                        let error = new Error(`There is an error in get receipt`);
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

module.exports.GetCardByID = (tenant, company, cardid) => {

    return new Promise(function (resolve, reject) {
        if ((config.Services && config.Services.botServiceHost && config.Services.botServicePort && config.Services.botServiceVersion)) {

            let dispatchURL = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}/DBF/API/${config.Services.botServiceVersion}/ViewService/Card/${cardid}`;
            if (validator.isIP(config.Services.botServiceHost))
                dispatchURL = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}:${config.Services.botServicePort}/DBF/API/${config.Services.botServiceVersion}/ViewService/Card/${cardid}`;

            request({
                method: "GET",
                url: dispatchURL,
                headers: {
                    authorization: "bearer " + config.Services.accessToken,
                    companyinfo: `${tenant}:${company}`
                }

            }, function (_error, _response, datax) {

                try {

                    if (!_error && _response && _response.statusCode === 200 && JSON.parse(datax).IsSuccess) {

                        resolve(JSON.parse(datax).Result);

                    } else {

                        let error = new Error(`There is an error in get card`);
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

            let dispatchURL = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}/DBF/API/${config.Services.botServiceVersion}/ViewService/QuickReply/${quickreply_id}`;
            if (validator.isIP(config.Services.botServiceHost))
                dispatchURL = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}:${config.Services.botServicePort}/DBF/API/${config.Services.botServiceVersion}/ViewService/QuickReply/${quickreply_id}`;

            request({
                method: "GET",
                url: dispatchURL,
                headers: {
                    authorization: "bearer " + config.Services.accessToken,
                    companyinfo: `${tenant}:${company}`
                }

            }, function (_error, _response, datax) {

                try {

                    if (!_error && _response && _response.statusCode === 200 && JSON.parse(datax).IsSuccess) {

                        resolve(JSON.parse(datax).Result);

                    } else {

                        let error = new Error(`There is an error in get quickreply`);
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

module.exports.GetMediaCardByID = (tenant, company, id) => {

    return new Promise(function (resolve, reject) {
        if ((config.Services && config.Services.botServiceHost && config.Services.botServicePort && config.Services.botServiceVersion)) {

            let dispatchURL = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}/DBF/API/${config.Services.botServiceVersion}/ViewService/MediaCard/${id}`;
            if (validator.isIP(config.Services.botServiceHost))
                dispatchURL = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}:${config.Services.botServicePort}/DBF/API/${config.Services.botServiceVersion}/ViewService/MediaCard/${id}`;

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

                        let error = new Error(`There is an error in get media card`);
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

module.exports.GetButtonsByID = (tenant, company, id) => {

    return new Promise(function (resolve, reject) {
        if ((config.Services && config.Services.botServiceHost && config.Services.botServicePort && config.Services.botServiceVersion)) {

            var dispatchURL = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}/DBF/API/${config.Services.botServiceVersion}/ViewService/ButtonList/${id}`;
            if (validator.isIP(config.Services.botServiceHost))
                dispatchURL = `${config.Services.botServiceProtocol}://${config.Services.botServiceHost}:${config.Services.botServicePort}/DBF/API/${config.Services.botServiceVersion}/ViewService/ButtonList/${id}`;

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

                        let error = new Error(`There is an error in get buttons`);
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