const data = function data(to_recipients, tokenLink) {
  return {
    sender: {
      Email: 'contact@matrimonline.fr',
      Name: 'MatriMonline'
    },
    recipients: to_recipients,
    subject: 'MatriMonline - Reconnexion rapide',
    template_ID: 895531,
    variables: {
      name: to_recipients[0].Name,
      link: tokenLink
    }
  }
}
module.exports = data
