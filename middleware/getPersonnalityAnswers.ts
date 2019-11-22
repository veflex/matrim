export default function(ctx) {
  return new Promise((resolve, reject) => {
    ctx.store
      .dispatch(
        'personnality/getUserAnswers',
        ctx.store.getters['user/getUser'].id
      )
      .then(() => {
        resolve()
      })
      .catch(err => reject(err))
  })
}
