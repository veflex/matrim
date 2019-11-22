export default function(ctx) {
  return new Promise((resolve, reject) => {
    // Page reset-password
    const user = ctx.store.getters['user/getLoggedUser']
    if (!user) {
      resolve()
    }
    if (user.onboarding_step !== 'done') {
      ctx.redirect('/onboarding')
    } else if (user.personnality_step !== 'done') {
      ctx.redirect('/personnality')
    }
    resolve()
  })
}
