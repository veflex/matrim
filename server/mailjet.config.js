process.env.MJ_APIKEY_PUBLIC = "677d4de9dd4b198c83e6d4431f77dea1";
process.env.MJ_APIKEY_PRIVATE = "7c43880837b26d97557279e087548c12";

const connection = require ('node-mailjet')
    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE, {
        url: 'api.mailjet.com', // default is the API url
        version: 'v3.1', // default is '/v3'
        perform_api_call: true // used for tests. default is true
      })

module.exports = {
  connection
};