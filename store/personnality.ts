import { GetterTree, MutationTree, ActionTree } from 'vuex'

// Interface model of state
interface State {
  questions: any
  answers: any
}

// Set default state
const state = () => ({
  questions: null,
  answers: null
})

// States getters
const getters: GetterTree<State, any> = {
  getQuestions(state) {
    return state.questions
  },
  getUserAnswers(state) {
    return state.answers
  }
}

// States mutations
const mutations: MutationTree<State> = {
  setQuestions(state, questions) {
    state.questions = questions
  },
  setUserAnswers(state, answers) {
    state.answers = answers
  }
}

// States actions
const actions: ActionTree<State, any> = {
  getQuestions(ctx, sex) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/personnality_question?sex=${sex}`)
        .then(res => {
          ctx.commit('setQuestions', res)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getOneAnswer(ctx, payload) {
    const { id_user, id_question } = payload
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/personnality_answer/${id_user}/${id_question}`)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getUserAnswers(ctx, id) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/personnality_answer/${id}`)
        .then(res => {
          ctx.commit('setUserAnswers', res)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  insertAnswer(ctx, payload) {
    const { id_user, id_question, answer } = payload
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$post(`/personnality_answer/${id_user}`, { id_question, answer })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  updateAnswer(ctx, payload) {
    const { id_user, id_question, answer } = payload
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$put(`/personnality_answer`, { id_user, id_question, answer })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
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
