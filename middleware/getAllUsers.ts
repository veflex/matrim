export default function(ctx) {
  return new Promise((resolve, reject) => {
    let page = 1
    let sex
    const user = ctx.store.getters['user/getLoggedUser']
    if (ctx.query.page) {
      page = ctx.query.page
    }
    if (user) {
      if (user.sex === 'M') {
        sex = 'F'
      } else {
        sex = 'M'
      }
    }
    ctx.store.dispatch('user/getAllUsers', { page, sex }).then(res => {
      resolve()
    })
  })
}
