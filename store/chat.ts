import { GetterTree, MutationTree, ActionTree } from 'vuex'

import axios from 'axios'

// Interface model of state
interface State {
  isChatOpen: boolean
  conversations: any
  lastMessage: any
  messages: any
}

// Set default state
const state = () => ({
  isChatOpen: false,
  conversations: null,
  lastMessage: null,
  messages: null
})

// States getters
const getters: GetterTree<State, any> = {
  isChatOpen(state) {
    return state.isChatOpen
  },
  getConversations(state) {
    return state.conversations
  },
  getLastMessage(state) {
    return state.lastMessage
  },
  getMessages(state) {
    return state.messages
  }
}

// States mutations
const mutations: MutationTree<State> = {
  toggleChat(state) {
    state.isChatOpen = !state.isChatOpen
  },
  async asyncForEach(state, payload) {
    for (let index = 0; index < payload.array.length; index++) {
      await payload.callback(payload.array[index], index, payload.array)
    }
  },
  setConversations(state, conversations) {
    state.conversations = conversations
  },
  updateStoreIsRead(state, conversations_id) {
    state.conversations.forEach(conv => {
      if (conv.id_conv === conversations_id) {
        conv.isRead = true
      }
    })
  },
  setLastMessage(state, lastMessage) {
    state.lastMessage = lastMessage
  },
  setMessages(state, messages) {
    state.messages = messages
  }
}

// States actions
const actions: ActionTree<State, any> = {
  getConversations(ctx, id) {
    return new Promise(async (resolve, reject) => {
      const conversations = await (this as any).$axios.$get(
        `/conversations/${id}`
      )
      ctx.commit('setConversations', conversations)
      resolve()
    })
  },
  getLastMessage(ctx, id) {
    return new Promise(async (resolve, reject) => {
      const lastMessage = await (this as any).$axios.$get(`/lastMessage/${id}`)
      resolve(lastMessage)
    })
  },
  getMessages(ctx, id) {
    return new Promise(async (resolve, reject) => {
      const messages = await (this as any).$axios.$get(`/message/${id}`)
      ctx.commit('setMessages', messages)
      resolve(messages)
    })
  },
  sendMessage(ctx, payload) {
    return new Promise(async (resolve, reject) => {
      ;(this as any).$axios.$post(`/message`, payload).then(() => {
        resolve()
      })
    })
  },
  updateConv(ctx, payload) {
    return new Promise(async (resolve, reject) => {
      let url = ''
      if (payload.read) {
        url = '/conversation-read/'
      } else if (payload.write) {
        url = '/conversation-write/'
      }
      ;(this as any).$axios
        .$put(`${url}${payload.id_conv}`, {
          from_user: payload.from_user
        })
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          console.error(err)
        })
      // resolve(messages)
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
