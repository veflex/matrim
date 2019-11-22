export default function(ctx) {
  return new Promise((resolve, reject) => {
    const user = ctx.store.getters['user/getLoggedUser']
    console.log(user)
    if (!user) {
      resolve()
    } else if (user.onboarding_step === 'done') {
      ctx.redirect('/personnality')
    }
    resolve()
  })
}
