import { GetterTree, MutationTree, ActionTree } from 'vuex'

import axios from 'axios'

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
  blockUneligibleUser(ctx, id) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$post(`/block_user/${id}`)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  checkBlockedUser(ctx, id) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/block_user/${id}`)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
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
