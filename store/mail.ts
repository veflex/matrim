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
  sendConnexionMail(ctx: any, email: string) {
    console.log('aleeeeeeed')
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$post('/user/fast-connexion', { email })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
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
