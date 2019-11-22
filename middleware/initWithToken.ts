export default function(ctx) {
  return new Promise((resolve, reject) => {
    ctx.store
      .dispatch('user/initAuth', ctx.req)
      .then(res => {
        console.log('ressssInit', res)
        // if (res) {
        //   return resolve()
        // } else {
        //   ctx.redirect('/')
        // }
        resolve()
      })
      .catch(err => {
        console.log('errrrrInit', err)
        // if (ctx.route.name === 'userSearch') {
        //   return resolve()
        // }
        resolve()
        // ctx.redirect('/')
      })
  })
}
