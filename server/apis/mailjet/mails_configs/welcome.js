const data = function data (to_recipients) {
  return {
    sender: {
      Email: "sarah@matrimonline.fr",
      Name: "Sarah"
    },
    recipients: to_recipients,
    subject: "Bienvenue chez MatriMonline {{var:name:\"nouveau Membre\"}} : Envoyez vos documents et bénéficiez d'un abonnement gratuit de 4 mois",
    template_ID: 823848,
    variables: {
      name: to_recipients[0].Name
    }
  }
}
module.exports = data;