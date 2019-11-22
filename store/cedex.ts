import { GetterTree, MutationTree, ActionTree } from 'vuex'

import axios from 'axios'

// Interface model of state
interface State {
  cedexs: any[]
  cedex: any
  cedexsFromRayon: any[]
}

// Set default state
const state = () => ({
  cedexs: [],
  cedex: null,
  cedexsFromRayon: []
})

// States getters
const getters: GetterTree<State, any> = {
  getAutocompletion: state => state.cedexs,
  getOneCedex: state => state.cedex,
  getCedexsFromRayon: state => state.cedexsFromRayon
}

// States mutations
const mutations: MutationTree<State> = {
  setAutocompletionCedexs(state, cedexs) {
    state.cedexs = cedexs
  },
  setOneCedex(state, cedex) {
    state.cedex = cedex
  },
  setCedexsFromRayon(state, cedex) {
    state.cedexsFromRayon = cedex
  }
}

// States actions
const actions: ActionTree<State, any> = {
  getAutocompletion(ctx, cedex) {
    ;(this as any).$axios
      .$get(`/cedex?cedex=${cedex}`)
      .then(res => {
        ctx.commit('setAutocompletionCedexs', res)
      })
      .catch(err => console.error(err))
  },
  isCedexValid(ctx, cedex) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/cedex/${cedex}`)
        .then(res => {
          if (!res.length) {
            return resolve({ valid: false })
          }
          ctx.commit('setOneCedex', res)
          return resolve({ valid: true })
        })
        .catch(err => reject(err))
    })
  },
  // getCedexFromDistance(ctx, opt) {
  //   return new Promise((resolve, reject) => {
  //     ;(this as any).$axios
  //       .$get(`https://www.villes-voisines.fr/getcp.php?cp=${opt.cedex}&rayon=${opt.rayon}`, {
          // headers: {
          //   'Access-Control-Allow-Origin': '*',
          //   'Content-Type': 'text/html; charset=UTF-8',
          //   'Accept': 'text/html; charset=utf-8',
          //   'Authorization': 'www.villes-voisines.fr'
          // },
          // proxy: {
          //   host: 'www.villes-voisines.fr'
          // }
          // proxy: {
          //   host: '188.165.53.185',
          //   port: '443'
          // },
          // crossdomain: true,
          // useCredentails: true,
    //     })
    //     .then(res => {
    //       console.log('getCedex', res)
    //       ctx.commit('setCedexsFromRayon', res)
    //       resolve(res)
    //     })
    //     .catch(err => reject(err))
    // })
  // }
}

export default {
  namespaced: true,
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
}
