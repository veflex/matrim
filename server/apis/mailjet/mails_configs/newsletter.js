const data = function data (to_recipients, tokenLink) {
  return {
    sender: {
      Email: "sarah@matrimonline.fr",
      Name: "Sarah"
    },
    recipients: to_recipients,
    subject: "Merci de confirmer votre inscription à la Newsletter de MatriMonline {{var:name:\"nouveau Membre\"}}",
    template_ID: 842231,
    variables: {
      name: to_recipients[0].Name,
      link: tokenLink
    }
  }
}
module.exports = data;