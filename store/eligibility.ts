import { GetterTree, MutationTree, ActionTree } from 'vuex'

import axios from 'axios'

// Interface model of state
interface State {
  eligibilityQuestions: string[]
}

// Set default state

const state = () => ({
  eligibilityQuestions: []
})

// States getters
const getters: GetterTree<State, any> = {
  getQuestions: state => state.eligibilityQuestions
}

// States mutations
const mutations: MutationTree<State> = {
  setEligibilityQuestions(
    state: any,
    questions: [{ id: number; question: string }]
  ) {
    state.eligibilityQuestions = questions
  }
}

// States actions
const actions: ActionTree<State, any> = {
  getAllEligibilityQuestions(ctx, sex) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/elig_question?sex=${sex}`)
        .then(res => {
          ctx.commit('setEligibilityQuestions', res)
          resolve()
        })
        .catch(err => reject(err))
    })
  },

  getOneEligibilityAnswer(ctx, data) {
    return new Promise((resolve, reject) => {
      const { userId, questionId } = data
      ;(this as any).$axios
        .$get(`/elig_answer/${userId}/${questionId}`)
        .then(res => {
          console.log(res)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  insertAnswer(ctx, data) {
    ;(this as any).$axios.$post('/elig_answer', data).then(res => {
      console.log(res)
    })
  },
  updateAnswer(ctx, data) {
    ;(this as any).$axios.$put('/elig_answer', data).then(res => {
      console.log(res)
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
