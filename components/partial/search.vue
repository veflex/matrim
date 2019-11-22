<template>
  <section ref="sw" class="searchWidget" :style="`height:${sw_height}px`">
    <section class="sw-small" :style="`height:${sw_height_base}px`" @click="toggle_sw_medium">
      <h1><i class="fas fa-search"></i>Filtrer votre recherche</h1>
      <i ref="sw_menu_icon" class="fas fa-plus"></i>
    </section>
    <section ref="sw_medium" class="sw-medium">
      <article class="sw-age">
        <h2><i class="fas fa-birthday-cake"></i> Age</h2>
        <article class="sw-age-choice">
          <div class="input-nbr input-nbr-min"><input ref="min_age" v-model="min_age" placeholder="18" name="min_age" min="18" max="99" type="number" @change="input_nbr('min_age')"><span>ans</span><div class="input-nbr-arrow"><i class="fas fa-sort-up" @mousedown="input_nbr_start('input_nbr_increment','min_age')" @mouseleave="input_nbr_stop" @mouseup="input_nbr_stop" @touchstart="input_nbr_start('input_nbr_increment','min_age')" @touchend="input_nbr_stop" @touchcancel="input_nbr_stop"></i><i class="fas fa-sort-down" @mousedown="input_nbr_start('input_nbr_decrement','min_age')" @mouseleave="input_nbr_stop" @mouseup="input_nbr_stop" @touchstart="input_nbr_start('input_nbr_decrement','min_age')" @touchend="input_nbr_stop" @touchcancel="input_nbr_stop"></i></div></div>
          <p>à</p>
          <div class="input-nbr input-nbr-max"><input ref="max_age" v-model="max_age" placeholder="99" name="max_age" min="18" max="99" type="number" @change="input_nbr('max_age')" ><span>ans</span><div class="input-nbr-arrow"><i class="fas fa-sort-up" @mousedown="input_nbr_start('input_nbr_increment','max_age')" @mouseleave="input_nbr_stop" @mouseup="input_nbr_stop" @touchstart="input_nbr_start('input_nbr_increment','max_age')" @touchend="input_nbr_stop" @touchcancel="input_nbr_stop"></i><i class="fas fa-sort-down" @mousedown="input_nbr_start('input_nbr_decrement','max_age')" @mouseleave="input_nbr_stop" @mouseup="input_nbr_stop" @touchstart="input_nbr_start('input_nbr_decrement','max_age')" @touchend="input_nbr_stop" @touchcancel="input_nbr_stop"></i></div></div>
        </article>
      </article>
      <hr>
      <article class="sw-localisation">
        <h2><i class="fas fa-map-marker-alt"></i> Localisation</h2>
        <input
          id="cedex"
          v-model="cedex"
          v-validate="'required|min:5|max:5|isCedexValid'"
          type="number"
          maxlength="5"
          name="cedex"
          placeholder="code postal"
          list="cedex_list"
          class="sw-cedex"
          @input="autocomplete()"
        >
        <datalist id="cedex_list">
          <option v-for="cedex in cedexs" :key="cedex.id" :value="cedex.cedex"></option>
        </datalist>
      </article>
      <hr>
      <article class="sw-certification">
        <h2><IconBase width="18" height="18" view-box="0 0 19.08 18.95" icon-color="#C6AC52" icon-name="Certification" class="icon-certification"><IconCertif /></IconBase> Certification</h2>
        <input id="sw_certification" v-model="certification" class="sw_certification" type="checkbox">
        <label for="sw_certification" class="sw_certification">Avec obligatoirement</label>
      </article>
      <hr>
      <article class="sw-more-choice">
        <button class="sw-btn-reset" @click="reset">R&eacute;initialiser les filtres</button>
        <button class="pink_btn" @click="search">Rechercher</button>
      </article>
    </section>
    <modal v-if="modalData.isModalVisible" @close="closeModal">
      <template v-slot:body>
        <p class="text-align-center">{{ errors.first('cedex') }}</p>
      </template>
    </modal>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Validator } from "vee-validate";
import IconBase from '@/components/icons/icon_base.vue';
import IconCertif from '@/components/icons/svg/certification.vue';
import Modal from "@/components/Modal.vue";

interface HTMLElement {
  [key: string]: any;
}
interface modalData {
  isModalVisible: boolean | null;
}
@Component({
  name: 'search-widget',
   components: {
    IconBase,
    IconCertif,
    Modal
  }
})
class partialSearch extends Vue {
  sw_height: number = 50;
  sw_height_base: number = 50;
  min_age: number | null = null;
  max_age: number | null = null;
  cedex: number | null = null;
  certification: boolean = false;
  interval: any;
  modalData: modalData = {
    isModalVisible: false,
  };

  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }

  // get 15 cedex code from the store thanks to the user input that will allow to show autocompletion
  get cedexs() {
    return this.$store.getters["cedex/getAutocompletion"];
  }
  
  created() {
    // this.min_age = this.user.age - 5;
    // this.max_age = this.user.age + 5;
    // this.min_age = this.user.age - 5;
    // this.max_age = this.user.age + 5;
  }
  mounted() {
    // checks if the cedex is in the database
    const isCedexValid = (cedex: string): any => {
      return new Promise(resolve => {
        this.$store
          .dispatch("cedex/isCedexValid", cedex)
          .then(res => {
            resolve(res);
          })
          .catch(err => console.error(err));
      });
    };

    // creating a new instance of veevalidator for our custom rule isCedexValid to check if the cedex is in the databse
    const instance = new Validator();
    instance.extend("isCedexValid", {
      validate: isCedexValid
    });
  }

  // get the 15 cedexs code from the database while the user is typing
  autocomplete() {
    if (this.user.cedex.length <= 1 || this.user.cedex.length === 5) {
    } else this.$store.dispatch("cedex/getAutocompletion", this.user.cedex);
  }

  toggle_sw_medium() {
    const sw: HTMLElement = this.$refs.sw;
    const sw_menu_icon: HTMLElement = this.$refs.sw_menu_icon;
    const sw_medium: HTMLElement = this.$refs.sw_medium;
    sw_medium.classList.toggle('active-medium');
    sw.classList.toggle('sw-active');
    this.sw_height = this.sw_height_base + sw_medium.offsetHeight;
    this.$root.$emit('sw_height', this.sw_height);
    if(sw_menu_icon.classList.contains('fa-plus')) {
        sw_menu_icon.classList.replace("fa-plus", "fa-minus");
    } else {
        sw_menu_icon.classList.replace("fa-minus", "fa-plus");
    }
  }
  search() {
    // console.log(certification);
    this.$validator.validateAll().then(result => {
      if (result) {
        let sex;
        if(this.user.sex === 'M') {
          sex = 'F'
        } else {
          sex = 'M'
        }
        // this.$store.dispatch("cedex/getCedexFromDistance", {cedex: this.cedex, rayon: 10});
        this.$store.dispatch("user/getUsersFiltered", {sex: sex, cedex: [this.cedex], certified: this.certification, min_age: this.min_age, max_age: this.max_age})
        this.$router.push('/recherche');
      } else {
        this.showModal();
      }
      })
  }
  reset() {
    // this.min_age = this.user.age - 5;
    // this.max_age = this.user.age + 5;
    this.min_age = null;
    this.max_age = null;
    this.certification = false;
    this.cedex = null;
  }
  input_nbr_increment(input) {
    // const input_ref: HTMLElement = this.$refs[input];
    if(this[input] === null && input === "min_age") {
      this[input] = 18
    } else if(this[input] === null && input === "max_age") {
      this[input] = 99
    } else if(this[input] < 99) {
      this[input] +=1
      // input_ref.stepDown();
    } else {
      this[input] = 99
    }
    this.input_nbr(input);
  }
  input_nbr_decrement(input) {
    // const input_ref: HTMLElement = this.$refs[input];
    if(this[input] === null && input === "min_age") {
      this[input] = 18
    } else if(this[input] === null && input === "max_age") {
      this[input] = 99
    } else if(this[input] > 18) {
      this[input] -=1
      // input_ref.stepUp();
    } else {
      this[input] = 18
    }
    this.input_nbr(input);
  }
  input_nbr(input) {
    if(this[input] !== null && this.max_age !== null && input === "min_age" && Number(this[input]) === (Number(this.max_age) - 9)) {
      this.max_age = Number(this.max_age) + 1;
    } else if (this[input] !== null && this.min_age !== null && input === "max_age" && Number(this[input]) === (Number(this.min_age) + 9)) {
      this.min_age = Number(this.min_age) - 1;
    } else if(this[input] === null && input === "max_age") {
      this[input] = 99
    } else if(this[input] === null && input === "min_age") {
      this[input] = 18
    } else if(this[input] < 18) {
      this[input] = 18
    } else if(this[input] > 99) {
      this[input] = 99
    }
  }
  input_nbr_start(clbk,input){
    if(!this.interval){
      this.interval = setInterval(() => this[clbk](input), 150)	
    }
  }
  input_nbr_stop(){
    clearInterval(this.interval)
    this.interval = false
  }
  showModal() {
    this.modalData.isModalVisible = true;
  }
  closeModal() {
    this.modalData.isModalVisible = false;
  }
}
export default partialSearch;
</script>

<style lang="scss">
@media screen and (min-width: $tablet) {
  .searchWidget {
    position: fixed;
    top:$navbar_height_desktop;
    left: 0;
    right: 0;
    height: $searchWidget_height_desktop;
    z-index: 9;
    border: 1px solid red;
    background: #fff;
    & h1 {
      color: $kakiGold;
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 18px;
      width: 100%;
      & i {
        margin-right: 5px;
      }
    }
    & .sw-small {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      // height: 100%;
      cursor: pointer;
      & > i {
        margin-right: 5px;
        color: $kakiGold;
      }
    }
    & .sw-medium {
      display: none;
      flex-wrap: nowrap;
      justify-content: space-around;
      border-top: 1px solid #c9c9C9;
      & .sw-age, & .sw-localisation, & .sw-certification, & .sw-more-choice {
        padding-top: 14px;
      }
      & hr {
        border: none;
        background: #c9c9C9;
        width: 0.9px;
        height: auto;
        padding: 0;
        margin: 0;
      }
      & h2 {
        color: $kakiGold;
        font-family: $paragraphFont_Q;
        font-weight: 700;
        font-size: 18px;
        display: flex;
        flex-wrap: nowrap;
        // justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        & i, & .icon-certification {
          margin-right: 5px
        }
      }
      & .sw-certification {
        font-family: $paragraphFont_Q;
        font-weight: 700;
        font-size: 16px;
        & .sw_certification {
          cursor: pointer;
        }
      }
      & .sw-more-choice {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        & .pink_btn {
          order: 1;
          padding: 8px 25px;
        }
        & .sw-btn-reset {
          order: 2;
        }
      }
    }
    & .active-medium {
      display: flex;
      padding-bottom: 5px;
    }
    & input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    & input[type=number] {
      -moz-appearance:textfield;
    }
    & .sw-age-choice {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      & p {
        display: flex;
        align-items: center;
        margin: auto 8px;
      }
    }
    & .sw-cedex, & .input-nbr {
      border-radius: 8px;
      // overflow: hidden;
      padding: 4px 6px;
      border: 1px solid black;
    }
    & .input-nbr {
      display: flex;
      flex-direction: row;
      // margin: auto 5px;
      text-align: center;
      position: relative;
      & .input-nbr-arrow {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        & i {
          height: 4px;
          cursor: pointer;
          }
      }
      & input[type=number] {
        border: none;
        width: 32px;
        text-align: center;
        font-family: $paragraphFont_Q;
        font-size: 14px;
        font-weight: 700;
      }
      & input[type=number]::placeholder {
        text-align: center;
      }
      &.input-nbr-min:before, &.input-nbr-max:before {
        position: absolute;
        top: -10px;
        background: #fff;
        left: 22%;
        padding: 0px 3px;
        transform: translate(-50%, 0%);
        font-size: 12px;
        font-weight: 700;
        font-family: $paragraphFont_Q;
      }
      &.input-nbr-min:before {
        content: 'Min';
      }
      &.input-nbr-max:before {
        content: 'Max';
      }
    }
    & .input-nbr span, & input[type=number]::placeholder {
      font-family: $paragraphFont_Q;
      font-size: 14px;
      font-weight: 700;
      line-height: 15px;
      display: flex;
      align-items: center;
    }
    & .input-nbr span {
      margin-right: 4px;
    }
    & .sw-btn-reset {
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 14px;
      background: none;
      border: none;
      transition: all 0.25s ease-in-out;
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  body {
    // overflow: scroll;
  }
  .searchWidget {
    position: fixed;
    top:$navbar_height_desktop;
    left: 0;
    right: 0;
    bottom: 0;
    height: $searchWidget_height_desktop;
    z-index: 9;
    border: 1px solid red;
    background: #fff;
    &.sw-active {
      top: 0;
      bottom: 0;
      z-index: 10;
    }
    & h1 {
      color: $kakiGold;
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 18px;
      width: 100%;
      & i {
        margin-right: 5px;
      }
    }
    & .sw-small {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      & > i {
        margin-right: 5px;
        color: $kakiGold;
      }
    }
    & .sw-medium {
      display: none;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: space-around;
      border-top: 1px solid #c9c9C9;
      height: calc(100vh - 50px);
      & .sw-age, & .sw-localisation, & .sw-certification, & .sw-more-choice {
        // padding-top: 14px;
        margin-right: auto;
        margin-left: auto;
      }
      & hr {
        border: none;
        background: #c9c9C9;
        width: 100%;
        height: 0.9px;
        padding: 0;
        margin: 0;
      }
      & h2 {
        color: $kakiGold;
        font-family: $paragraphFont_Q;
        font-weight: 700;
        font-size: 18px;
        display: flex;
        flex-wrap: nowrap;
        // justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        & i, & .icon-certification {
          margin-right: 5px
        }
      }
      & .sw-certification {
        font-family: $paragraphFont_Q;
        font-weight: 700;
        font-size: 16px;
        & .sw_certification {
          cursor: pointer;
        }
      }
      & .sw-more-choice {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        & .pink_btn {
          order: 1;
          padding: 8px 25px;
        }
        & .sw-btn-reset {
          order: 2;
        }
      }
    }
    & .active-medium {
      display: flex;
      padding-bottom: 5px;
    }
    & input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    & input[type=number] {
      -moz-appearance:textfield;
    }
    & .sw-age-choice {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: center;
      padding-top: 8px;
      & p {
        display: flex;
        align-items: center;
        margin: auto 8px;
      }
    }
    & .sw-cedex, & .input-nbr {
      border-radius: 8px;
      // overflow: hidden;
      padding: 4px 6px;
      border: 1px solid black;
    }
    & .input-nbr {
      display: flex;
      flex-direction: row;
      // margin: auto 5px;
      text-align: center;
      position: relative;
      & .input-nbr-arrow {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        & i {
          height: 4px;
          cursor: pointer;
          }
      }
      & input[type=number] {
        border: none;
        width: 32px;
        text-align: center;
        font-family: $paragraphFont_Q;
        font-size: 14px;
        font-weight: 700;
      }
      & input[type=number]::placeholder {
        text-align: center;
      }
      &.input-nbr-min:before, &.input-nbr-max:before {
        position: absolute;
        top: -10px;
        background: #fff;
        left: 22%;
        padding: 0px 3px;
        transform: translate(-50%, 0%);
        font-size: 12px;
        font-weight: 700;
        font-family: $paragraphFont_Q;
      }
      &.input-nbr-min:before {
        content: 'Min';
      }
      &.input-nbr-max:before {
        content: 'Max';
      }
    }
    & .input-nbr span, & input[type=number]::placeholder {
      font-family: $paragraphFont_Q;
      font-size: 14px;
      font-weight: 700;
      line-height: 15px;
      display: flex;
      align-items: center;
    }
    & .input-nbr span {
      margin-right: 4px;
    }
    & .sw-btn-reset {
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 14px;
      background: none;
      border: none;
      transition: all 0.25s ease-in-out;
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}
</style>
