export default function(ctx) {
  return new Promise((resolve, reject) => {

    // Page reset-password
    if(ctx.req.url.includes("/reset")){
      if(ctx && ctx.params['token']){
        resolve()
      } else {
        ctx.redirect('/onboarding')
        resolve()
      }
    }
    
  })
}
