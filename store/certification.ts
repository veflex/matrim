import { GetterTree, MutationTree, ActionTree } from 'vuex'
import Cookie from 'js-cookie'
import jwtDecode from 'jwt-decode'

import auth from './../utils/auth'
// Interface model of state
interface State {
  certification_state: any;
  certification_type: any[];
  certification_validation: boolean;
  certification_file: boolean;
  certification_file_deleteState: boolean;
  certification_sworn_statement: string | null;
}

// Set default state
const state = () => ({
  certification_state: false,
  certification_type: [],
  certification_validation: false,
  certification_file: null,
  certification_sworn_statement: null
})

// States getters
const getters: GetterTree<State, any> = {
  getCertification_state(state) {
    return state.certification_state
  },
  getCertification_type(state) {
    return state.certification_type
  },
  getCertification_validation(state) {
    return state.certification_validation
  },
  getCertification_file_deleteState(state) {
    return state.certification_file_deleteState
  },
  getCertification_file(state) {
    return state.certification_file
  },
  getCertification_statement(state) {
    return state.certification_sworn_statement
  }
}

// States mutations
const mutations: MutationTree<State> = {
  setCertification_state(state, certification_state) {
    state.certification_state = certification_state
  },
  setCertification_type(state, certification_type) {
    state.certification_type = certification_type
  },
  setCertification_validation(state, certification_validation) {
    state.certification_validation = certification_validation
  },
  setCertification_file(state, certification_file) {
    state.certification_file = certification_file
  },
  setCertification_file_deleteState(state, certification_file_deleteState) {
    state.certification_file_deleteState = certification_file_deleteState
  },
  setCertification_statement(state, certification_sworn_statement) {
    state.certification_sworn_statement = certification_sworn_statement
  }
}

// States actions
const actions: ActionTree<State, any> = {
  getCertification_type(ctx) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/certification/type`)
        .then(res => {
          ctx.commit('setCertification_type', res);
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  validationCertificationUser(ctx, id) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
      .$get(`/certification/validation/user/${id}`)
      .then(res => {
        ctx.commit('setCertification_validation', Boolean(res[0].certified));
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
    });
  },
  // checks in the database if the statement registered by the user already exists
  checkStatementExistence(ctx: any, data) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
      .$get(`/certification/statement?id_user=${data.id_user}&id_certif=${data.id_certif}`)
      .then(res => {
        if (res) {
          return resolve(res)
        }
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
      })
    },
    // checks in the database if the file registered by the user already exists
    checkFileExistence(ctx: any, data) {
      return new Promise((resolve, reject) => {
        ;(this as any).$axios
        .$get(`/certification/file?id_user=${data.id_user}&id_certif=${data.id_certif}`)
        .then(res => {
          if(res.length > 0) {
            ctx.commit('setCertification_file', res[0].file_name);
          } else {
            ctx.commit('setCertification_file', null);
          }
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
      })
    },
  // update profil document of user
  updateDocProfilUser(ctx, data: { id: number;id_user: number, id_certif: number, file: File; name: string; doc_name: string; old_file: string }) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$put(`/certification/file?id_user=${data.id_user}&id_certif=${data.id_certif}&name=${data.name}&doc_name=${data.doc_name}&file=${data.old_file}`, data.file)
        .then(res => {
          ctx.commit('setCertification_file', res);
          resolve(res)
        })
        .catch(err => {
          reject(err.response) 
        })
      })
    },
    // post profil document of user
    postDocProfilUser(ctx, data: { id: number;id_user: number, id_certif: number, file: File; name: string; doc_name: string }) {
      return new Promise((resolve, reject) => {
        ;(this as any).$axios
        .$post(`/certification/file?id_user=${data.id_user}&id_certif=${data.id_certif}&name=${data.name}&doc_name=${data.doc_name}`, data.file)
        .then(res => {
          ctx.commit('setCertification_file', res);
          resolve(res)
        })
        .catch(err => {
          reject(err.response) 
        })
      })
    },
    // post IDCheck picture of user
    postIDcheckProfilUser(ctx, data: { id: number;id_user: number, id_certif: number, file: File; page: string; doc_name: string }) {
      console.log('data',data)
      return new Promise((resolve, reject) => {
        ;(this as any).$axios
        .$post(`/certification/file?id_user=${data.id_user}&id_certif=${data.id_certif}&page=${data.page}&doc_name=${data.doc_name}`, data.file)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response) 
        })
      })
    },
    // update statement of user
    getStatementUser(ctx, data) {
      return new Promise((resolve, reject) => {
        ;(this as any).$axios
        .$get(`/certification/statement?id_user=${data.id_user}&id_certif=${data.id_certif}`)
        .then(res => {
          // console.log('res', res[0].sworn_statement);
          if(res.length > 0) {
            ctx.commit('setCertification_statement', res[0].sworn_statement);
          } else {
            ctx.commit('setCertification_statement', null);
          }
          resolve(res)
        })
        .catch(err => {
          reject(err.response)
        })
    })
  },
  // update statement of user
  updateStatementUser(ctx, data) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$put(`/certification/statement`, data)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response)
        })
    })
  },
  // post statement of user
  postStatementUser(ctx, data) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$post(`/certification/statement`, data)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response)
        })
    })
  },
  // get state of certification
  getCertification_state(ctx, data) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$get(`/certification/state?id_user=${data.id_user}&id_certif=${data.id_certif}`)
        .then(res => {
          ctx.commit('setCertification_state', Boolean(res.data));
          resolve(res)
        })
        .catch(err => {
          reject(err.response)
        })
    })
  },
  deleteFileUploded(ctx, data) {
    return new Promise((resolve, reject) => {
      ;(this as any).$axios
        .$delete(`/certification/file?id_user=${data.id_user}&id_certif=${data.id_certif}&file=${data.doc_name}`)
        .then(res => {
          // ctx.commit('setCertification_file_deleteState', res);
          resolve(res);
        })
        .catch(err => {
          reject(err.response)
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
