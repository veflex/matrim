module.exports = function sendWithMailjet(mailjetConnect, data) {
  console.log("Mailjet is sending e-mail");
  
    const sender = data.sender;
    const recipients = data.recipients;
    const subject = data.subject;
    const template_ID = data.template_ID;
    const variables = data.variables;
  
      /**
     *
     * This call sends a message to the given recipient with vars and custom vars.
     *
     */
        const mailjet = require ('node-mailjet')
        .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
        const request = mailjetConnect
        .post("send", {'version': 'v3.1'})
        .request({
          "Messages":[
            {
              "From": sender,
              "To": recipients,
              "TemplateID": template_ID,
              "TemplateLanguage": true,
              "Subject": subject,
              "Variables": variables
            }
          ]
        })
        request
        .then((result) => {
          console.log("Mailjet has send e-mail", result.body)
        })
        .catch((err) => {
          console.log("Mailjet has errors", err.statusCode, err)
        })
    };