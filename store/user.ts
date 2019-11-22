import { GetterTree, MutationTree, ActionTree } from 'vuex'
import Cookie from 'js-cookie'
import jwtDecode from 'jwt-decode'

import auth from './../utils/auth'
// Interface model of state
interface State {
  userRegistration: {
    sex: string | null
    name: string | null
    email: string | null
    password: string | null
  }
  loggedUser: any
  user: any
  users: any
  usersDiscover: any
  usersFiltered: any
  usersCertified: any
  myFavoriteUsers: any
  meFavoritedUsers: any
  maxPages: number | null
  token: string | null
  isLoading: boolean
}

// Set default state
const state = () => ({
  // user registration object
  userRegistration: {
    sex: null,
    name: null,
    email: null,
    password: null
  },
  loggedUser: null,
  user: null,
  users: null,
  usersDiscover: null,
  usersFiltered: null,
  usersCertified: null,
  myFavoriteUsers: null,
  meFavoritedUsers: null,
  maxPages: null,
  token: null,
  isLoading: false

})

// States getters
const getters: GetterTree<State, any> = {
  getName(state) {
    return state.userRegistration.name
  },
  getEmail(state) {
    return state.userRegistration.email
  },
  getUser(state) {
    return state.user
  },
  getLoggedUser(state) {
    return state.loggedUser
  },
  getUsers(state) {
    return state.users
  },
  getUsersDiscover(state) {
    return state.usersDiscover
  },
  getUsersFiltered(state) {
    return state.usersFiltered
  },
  getUsersCertified(state) {
    return state.usersCertified
  },
  getMyFavoriteUsers(state) {
    return state.myFavoriteUsers
  },
  getMeFavoritedUsers(state) {
    return state.meFavoritedUsers
  },
  getMaxPages(state) {
    return state.maxPages
  },
  getToken(state) {
    return state.token
  },
  getIsLoading(state) {
    return state.isLoading
  }
}

// States mutations
const mutations: MutationTree<State> = {
  // the registration phase is in 2 steps, populateUserRegistration() is used to populate the userRegistration state with infos registered by the user while the user is registering
  populateUserRegistration(state: any, infos) {
    for (const info in infos) {
      state.userRegistration[info] = infos[info]
    }
  },
  setUser(state, user) {
    state.user = user
  },
  setLoggedUser(state, user) {
    state.loggedUser = user
  },
  setUsers(state, users) {
    state.users = users
  },
  setUsersFiltered(state, users) {
    state.usersFiltered = users
  },
  setUsersCertified(state, users) {
    state.usersCertified = users
  },
  setUsersDiscover(state, users) {
    state.usersDiscover = users
  },
  setMyFavoriteUsers(state, users) {
    state.myFavoriteUsers = users
  },
  setMeFavoritedUsers(state, users) {
    state.meFavoritedUsers = users
  },
  setMaxPages(state, maxPages) {
    state.maxPages = maxPages
  },
  setToken(state, token) {
    state.token = token
  },
  clearToken(state) {
    state.token = null
  },
  clearLoggedUser(state) {
    state.loggedUser = null
  },
  clearUser(state) {
    state.user = null
  },
  loading(state, isLoading) {
    state.isLoading = isLoading;
  }
}

// States actions
const actions: ActionTree<State, any> = {
  // checks in the database if the mail registered by the user already exists if res.length > 0 the email exist so we send a error message
  checkMailExistence(ctx: any, email: string) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/user/${email}`)
        .then(res => {
          if (res) {
            return resolve({
              valid: false
            })
          }
          resolve({ valid: true })
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // insert the user in the database with name, sex, email and password
  insertUser(ctx: any) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$post('/user', ctx.state.userRegistration)
        .then(res => {
          const token = res.token
          const newUser = { ...ctx.state.userRegistration, id: res.id }
          ctx.commit('setLoggedUser', newUser)
          Cookie.set('jwt', res.token, { expires: 365 })
          auth.setLocalToken(token)
          resolve(token)
        })
        .catch(err => {
          reject(err.response)
        })
    })
  },
  // get one user thanks to his id
  getOneUser(ctx, data) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/user/${data.id}`)
        .then(res => {
          if (data.isLogging) {
            ctx.commit('setLoggedUser', res)
          } else {
            ctx.commit('setUser', res)
          }
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getAllUsers(ctx, opt) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/user?page=${opt.page}&sex=${opt.sex}`)
        .then(res => {
          ctx.commit('setUsers', res.users)
          ctx.commit('setMaxPages', res.maxPages)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getUsersDiscover(ctx, opt) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/users/discover?sex=${opt.sex}&limit=${opt.limit}`)
        .then(res => {
          console.log('res', res.users);
          ctx.commit('setUsersDiscover', res.users)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getUsersFiltered(ctx, opt) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/users/filtered?sex=${opt.sex}&cedex=${opt.cedex}&certified=${opt.certified}&min_age=${opt.min_age}&max_age=${opt.max_age}`)
        .then(res => {
          console.log('res', res.users);
          ctx.commit('setUsersFiltered', res.users)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getUsersCertified(ctx, opt) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/users/certified?sex=${opt.sex}&limit=${opt.limit}`)
        .then(res => {
          console.log('res', res);
          ctx.commit('setUsersCertified', res.users)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getMyFavoriteUsers(ctx, opt) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/favorites/user?sex=${opt.sex}&user_id=${opt.user_id}`)
        .then(res => {
          if(res.users.length > 0){
            ctx.commit('setMyFavoriteUsers', res.users)
          }
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getMeFavoritedUsers(ctx, opt) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/favorited/user?sex=${opt.sex}&user_id=${opt.user_id}`)
        .then(res => {
          if(res.users.length > 0){
            ctx.commit('setMeFavoritedUsers', res.users)
          }
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getFavorite(ctx, opt) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/favorites?user_id=${opt.user_id}&user_favorited=${opt.user_favorited}`)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  postFavorite(ctx, opt) {
    console.log('opt', opt);
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$post(`/favorites?user_id=${opt.user_id}&user_favorited=${opt.user_favorited}`)
        .then(res => {
          console.log('postfavorite', res);
          // if(res.users.length > 0){
          //   console.log('length > 0');
          //   ctx.commit('setfavorite', true)
          // }
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deleteFavorite(ctx, opt) {
    console.log('opt', opt);
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$delete(`/favorites?user_id=${opt.user_id}&user_favorited=${opt.user_favorited}`)
        .then(res => {
          console.log('deletefavorite', res);
          // if(res.users.length > 0){
          //   console.log('length > 0');
          //   ctx.commit('setfavorite', true)
          // }
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // update the user
  updateUser(ctx, data) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$put(`/user/${data.id}`, data.body)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // update the password
  updatePassword(ctx, data) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$put(`/user/${data.id}/password`, data.pass)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // update profil picture of user
  updateImgProfilUser(ctx, data: { id: number; file: File }) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$put(`/user/${data.id}/img`, data.file)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response)
        })
    })
  },
  // update profil picture of user
  updateDocProfilUser(ctx, data: { id: number; file: File; doc_name: string }) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$patch(`/user/${data.id}/doc`, {file: data.file, doc_name: data.doc_name})
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response)
        })
    })
  },
  // login the user by setting a token and a cookie
  login(ctx, user) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$post('/user/login', {
          user
        })
        .then(res => {
          auth.setLocalToken(res.token)
          Cookie.set('jwt', res.token, { expires: 365 })
          ctx.commit('setToken', res.token)
          ctx.commit('setLoggedUser', res.user)
          resolve(res.user)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // checking if there is a token if so we get the user
  initAuth(ctx, req) {
    return new Promise((resolve, reject) => {
      let token
      if (ctx.state.token) {
        token = ctx.state.token
      } else if (req) {
        if (!req.headers.cookie) {
          return reject('no cookies')
        }
        const jwtCookie = req.headers.cookie
          .split(';')
          .find(c => c.trim().startsWith('jwt='))
        if (!jwtCookie) {
          return reject('no jwt cookie')
        }
        token = jwtCookie.split('=')[1]
      } else {
        token = localStorage.getItem('authToken')
      }
      if (token) {
        ctx.commit('setToken', token)
        ctx
          .dispatch('getOneUser', {
            id: jwtDecode(token).userId,
            isLogging: true
          })
          .then(res => {
            resolve(token)
          })
      } else return reject('no token')
    })
  },
  // deletes cookie and local token
  logout(ctx) {
    ctx.commit('clearToken')
    ctx.commit('clearLoggedUser')
    Cookie.remove('jwt')
    localStorage.removeItem('authToken')
  },
  /**
   * @function newsletter_on  To send a welcome email.
   * @param user  Object with 2 args: email and name.
   */
  newsletter_on(ctx, user) {
    return new Promise((resolve, reject) => {
      let token
      ;(this as any).$axios
        .$post('/user/newsletter', {
          token: localStorage.getItem('authToken'),
          user
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          resolve(err)
        })
    })
  },
  /**
   * @function welcome_email  To send a welcome email.
   * @param user  Object with 2 args: email and name.
   */
  welcome_email(ctx, user) {
    return new Promise((resolve, reject) => {
      let token
      ;(this as any).$axios
        .$post('/user/welcome', {
          user
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /**
   * @function reset_password  To send a welcome email.
   * @param user  Object with 1 args: email.
   */
  reset_password(ctx, user) {
    return new Promise((resolve, reject) => {
      let token
      ;(this as any).$axios
        .$post('/user/reset-password', user)
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
