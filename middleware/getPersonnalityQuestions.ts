export default function(ctx) {
  return new Promise((resolve, reject) => {
    if (ctx.store.getters['user/getLoggedUser']) {
      ctx.store
        .dispatch(
          'personnality/getQuestions',
          ctx.store.getters['user/getLoggedUser'].sex
        )
        .then(res => {
          resolve()
        })
        .catch(err => reject(err))
    } else {
      ctx.redirect('/login')
    }
  })
}
