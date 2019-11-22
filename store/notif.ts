import { GetterTree, MutationTree, ActionTree } from 'vuex'

// Interface model of state
interface State {}

// Set default state
const state = () => ({})

// States getters
const getters: GetterTree<State, any> = {}

// States mutations
const mutations: MutationTree<State> = {}

// States actions
const actions: ActionTree<State, any> = {
  // will allow to send a notification on discord when a user is registered and eligible
  sendNewUserNotif(ctx) {
    const user = ctx.rootState.user.loggedUser
    return new Promise((resolve, reject) => {
      ;(this as any).$axios.$post(
        'https://discordapp.com/api/webhooks/580373929168994330/sGkLy9t3-JA8nERZRYlXg2t5w_Vi4JkgQMN9ftd0WnDrNR2kk1VgEWcFohNm6N0G7HC7',
        {
          content:
            '<@232169584344432641> il y a un nouvel utilisateur: ' +
            user.name +
            ', email: ' +
            user.email
        }
      )
      resolve()
      // axios.post(
      //   'https://discordapp.com/api/webhooks/559716197499928597/8ntFXf8AtFS5F6e93YdDNeNTJDK2xpZLeucJoXFMO1eX4_Wn1NnOhgYsG6epO5AR2wEE',
      //   { content: 'new user: ' + newUser.name + ' ' + newUser.email }
      // );
    })
  },
  // will allow to send a notification on discord when a user check newsletter on OnBoarding but e-mail was not sent
  sendNewsletterEmailNotSentNotif(ctx, user) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios.$post(
        'https://discordapp.com/api/webhooks/586110311401127938/CAZBeyIVqmd0BY2KqrnPZZWJAcsIdVpJl8zYtRWvoHDZZMqKK-dcnyjLIXpf9-4Ku8Z7',
        {
          content:
            "<@458955097783926795> le mail de Newsletter n'a pas été envoyé: " +
            user.name +
            ', email: ' +
            user.email
        }
      )
      resolve()
    })
  },
  // will allow to send a notification on discord when a user send a document certification on OnBoarding 
  sendNewCertificationNotif(ctx, user) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios.$post(
        'https://discordapp.com/api/webhooks/596317135958179861/sCMEETVQRHS2CcprZWZAGHiXpTBEYTo60xehAoMjihvkgqjIXzy3Xn6Kktm1XWvIDP74',
        {
          content:
            "<@458955097783926795> un utilisateur a envoyé un document =>  " +
            "**name**: " +
            user.name +
            ", **id**: " +
            user.id +
            ", **email**: " +
            user.email +
            ", **type de certification**: " +
            user.certif_type
        }
      )
      resolve()
    })
  },
  // will allow to send a notification on discord when a user complete IDcheck from OnBoarding
  sendNewIDCheckNotif(ctx, user) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios.$post(
        'https://discordapp.com/api/webhooks/596317135958179861/sCMEETVQRHS2CcprZWZAGHiXpTBEYTo60xehAoMjihvkgqjIXzy3Xn6Kktm1XWvIDP74',
        {
          content:
            "<@458955097783926795> **##### IDcheck #####** un utilisateur a envoyé un document =>  " +
            "**name**: " +
            user.name +
            ", **id**: " +
            user.id +
            ", **email**: " +
            user.email +
            ", **type de certification**: " +
            user.certif_type +
            ", **type de document**: " +
            user.docType
        }
      )
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
}
