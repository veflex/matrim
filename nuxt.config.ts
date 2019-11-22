import pkg from './package.json'
import dict from './vee.dictionary'

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['@fortawesome/fontawesome-free/css/all.css'],
  styleResources: {
    scss: [
      '@/styles/reset.scss',
      '@/styles/base.scss',
      '@/styles/elements.scss',
      '@/styles/general.scss'
    ]
  },

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/vee-validate.ts',
    '~/plugins/socket-io.js',
    '~plugins/vueSmoothScroll.ts',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    '@nuxtjs/moment'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:9999/api/v1'
    // baseURL: 'https://matrim.lauriannel.com/api/v1/
  },

  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:9999/api/v1',
    SOCKET_HOST_URL: process.env.SOCKET_HOST_URL || 'http://localhost:9999'
    // baseURL: 'https://matrim.lauriannel.com/api/v1/
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  // Retrouver une position en switchant de page
  router: {
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        let position = {}
        if (to.matched.length < 2) {
          position = { x: 0, y: 0 }
        } else if (
          to.matched.some(r => r.components.default.options.scrollToTop)
        ) {
          position = { x: 0, y: 0 }
        }
        if (to.hash) {
          position = { selector: to.hash }
        }
        return position
      }
    }
  }
}
