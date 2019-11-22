const data = function data (to_recipients, tokenLink) {
  return {
    sender: {
      Email: "contact@matrimonline.fr",
      Name: "MatriMonline"
    },
    recipients: to_recipients,
    subject: "MatriMonline - Mot de passe oublié",
    template_ID: 857200,
    variables: {
      name: to_recipients[0].Name,
      link: tokenLink
    }
  }
}
module.exports = data;