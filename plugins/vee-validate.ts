import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import dict from '~/vee.dictionary'

Vue.use(VeeValidate, {
  events: 'input'
})
Validator.localize('fr', dict)
