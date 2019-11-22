export default function(ctx) {
  // Si l'utilisateur n'est pas authentifié
  return new Promise((resolve, reject) => {
    const user = ctx.store.getters['user/getLoggedUser']
    if (user) {
      ctx.redirect('/')
    }
    resolve()
  })
}
