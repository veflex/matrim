export default function(ctx) {
  return new Promise((resolve, reject) => {
    // Page reset-password
    const token = ctx.params.token
    if (token) {
      ctx.store.commit('user/setToken', token)
      resolve()
    } else {
      ctx.redirect('/')
    }
  })
}
