export default function(ctx) {
  return new Promise((resolve, reject) => {
    const user = ctx.store.getters['user/getLoggedUser']
    if (user) {
      ctx.store.dispatch('blocked/checkBlockedUser', user.id).then(res => {
        if (res.length && res[0].date > new Date().getTime()) {
          ctx.redirect('/blockedUser')
        }
      })
    }
    resolve()
  })
}
