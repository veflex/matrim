export default function(ctx) {
  return new Promise((resolve, reject) => {
    ctx.store
      .dispatch('user/getOneUser', { id: ctx.params.id, isLogging: false })
      .then(res => {
        resolve()
      })
      .catch(err => reject(err))
  })
}
