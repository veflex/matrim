export default {
  custom: {
    email: {
      required: 'Veuillez entrer un e-mail.',
      email: `Verifiez le format de votre adresse e-mail.`,
      unique: `Cet e-mail est déja utilisé.`,
      notAccount: `Votre e-mail est incorrect.`
    },
    password: {
      required: 'Veuillez entrer un mot de passe.',
      regex:
        'Veuillez saisir un mot de passe valide (12 caractères minimum avec au moins un chiffre, une lettre majuscule et une lettre minuscule.'
    },
    name: {
      required: 'Veuillez entrer votre nom.',
      min: 'Attention, votre prénom doit contenir entre 2 et 20 lettres.',
      max: 'Attention, votre prénom doit contenir entre 2 et 20 lettres.',
      regex: 'Il semble que vous ayez entré un caractère interdit.'
    },
    sex: {
      required: 'Veuillez choisir votre sexe.'
    },
    cedex: {
      required: 'Veuillez entrer votre code postal.',
      min: 'Le code postal doit être composé de 5 chiffres.',
      max: 'Le code postal doit être composé de 5 chiffres.',
      isCedexValid: 'Veuillez entrer un code postal valide.'
    },
    birthday: {
      required: 'Veuillez entrer votre date de naissance.',
      legal: 'Vous devez être majeur(e) pour vous inscrire.',
      isDateValid: 'Votre date de naissance semble être incorrecte.'
    },
    phone: {
      required: 'Veuillez entrer votre numéro de téléphone.',
      digits: 'Le numéro de téléphone doit être composer de 10 chiffres.'
    },
    situation: {
      required: 'Veuillez choisir votre situation matrimoniale.',
      included: 'Veuillez sélectionner votre situation matrimoniale.'
    },
    upload_picture: {
      mimes: 'Veuillez télécharger une image au format JPG/JPEG ou PNG.',
      size: "L'image doit être inférieure à 5 Mo."
    },
    textarea: {
      required: 'Veuillez renseigner une réponse',
      max: 'La longueure de ce champ est limitée 1000 caractères'
    },
    sworn_statement: {
      required: 'Veuillez compléter la saisie de votre attestation.',
      regex: 'Veuillez effectuer la saisie complète de votre attestation.'
    },
    statement_confirmation: {
      required: 'Veuillez cocher la validation de votre attestation.'
    }
  }
}
