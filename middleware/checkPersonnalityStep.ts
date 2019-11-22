export default function(ctx) {
  return new Promise((resolve, reject) => {
    const user = ctx.store.getters['user/getLoggedUser']
    if (!user) {
      ctx.redirect(`/login`)
    } else if (user.onboarding_step !== 'done') {
      ctx.redirect('/onboarding')
    } else if (user.personnality_step === 'done') {
      ctx.redirect(`/profil/${user.id}`)
    } 
    resolve()
  })
}
