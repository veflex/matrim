<template>
  <div class="onBoarding">
    <modal v-if="modalData.isModalVisible" @close="closeModal">
      <template v-slot:body>
        <component :is="modalData.isComponent"></component>
      </template>
    </modal>
    <NameSex v-if="step === 0" />
    <EmailPassword v-if="step === 1" />
    <EligibilityTestBefore v-if="step === 2" />
    <EligibilityTest v-if="step === 3" />
    <Picture v-if="step === 4" :id="user.id" />
    <!-- <Picture-uploader v-if="step === 4"/> -->
    <IdCheck v-if="step === 5" />
    <ThirdScreen v-if="step === 6" />
    <PersonnalityTestBefore v-if="step === 7" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import auth from "./../../utils/auth";
import EligibilityTest from "@/components/onboarding/Eligibility_test.vue"; // @ is an alias to /src
import EligibilityTestBefore from "@/components/onboarding/Eligibility_test_before.vue"; // @ is an alias to /src
import NameSex from "@/components/onboarding/Name_sex.vue";
import EmailPassword from "@/components/onboarding/Email_password.vue";
import Picture from "@/components/onboarding/Picture_capture.vue";
// import PictureUploader from "@/components/onboarding/Picture_uploader.vue";
import ThirdScreen from "@/components/onboarding/Third_screen.vue";
import PersonnalityTestBefore from "@/components/onboarding/Personnality_before.vue";
import Modal from "@/components/Modal.vue";
import ChangeBrowser from "@/components/conditions/ChangeBrowser.vue";
import IdCheck from "@/components/onboarding/ID_Check.vue";

interface modalData {
  isModalVisible: boolean | null;
  isComponent: string | null;
}

@Component({
  name: "onboarding",
  layout: "onboarding",
  components: {
    EligibilityTest,
    EligibilityTestBefore,
    NameSex,
    EmailPassword,
    Picture,
    // PictureUploader,
    ThirdScreen,
    PersonnalityTestBefore,
    Modal,
    ChangeBrowser,
    IdCheck
  },
  middleware: ["checkOnboardingStep"]
})
class Onboarding extends Vue {
  step: number = 0;
  user: any | null = {};
  modalData: modalData = {
    isModalVisible: false,
    isComponent: null
  };

  nextStep(): void {
    this.step++;
    if (this.step > 2) {
      const userId = auth.getTokenUserId();
      this.$store
        .dispatch("user/updateUser", {
          id: userId,
          body: {
            onboarding_step: this.step
          }
        })
        .then(res => {
          console.log(res);
        });
    }
  }
  detectIE() {
    const ua = window.navigator.userAgent;

    const msie = ua.indexOf("MSIE ");
    if (msie > 0) {
      // IE 10 or older => return version number
      return true;
    }

    const trident = ua.indexOf("Trident/");
    if (trident > 0) {
      // IE 11 => return version number
      return true;
    }

    const edge = ua.indexOf("Edge/");
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return true;
    }

    // other browser
    return false;
  }

  created() {
    this.$on("next", this.nextStep);
    const user = this.$store.getters["user/getLoggedUser"];
    if (user) {
      this.step = Number(user.onboarding_step);
    }
    if (process.client) {
      if (this.detectIE()) {
        this.showModal("ChangeBrowser");
      }
    }
  }
  showModal(componentName: string | null) {
    this.modalData.isModalVisible = true;
    this.modalData.isComponent = componentName;
  }
  closeModal() {
    this.modalData.isModalVisible = false;
  }
}

export default Onboarding;
</script>

<style lang="scss" >
@media screen and (min-width: $tablet) {
  // Style gobal pour la vue et ses components
  .onBoarding {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 600px;
    &::after {
      content: "";
      position: fixed;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      z-index: -2;
      background-image: url("~@/assets/BG/OnBoarding_BG.gif");
      background-size: cover;
      background-attachment: fixed;
    }
    // Fond noir opaque
    &::before {
      content: "";
      position: fixed;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      z-index: -1;
      background: rgba($darkBlack, 0.4);
    }
    // Boutton de validation
    & .validate_btn {
      position: absolute;
      left: 50%;
      bottom: 50px;
      margin: auto;
      transform: translate(-50%, 0%);
    }
    // Bouton de choix noir à rose
    & input[type="radio"] {
      display: none;
      &:checked + label {
        background: $sweetPink;
        color: #fff;
      }
    }
    // Inputs avec ligne blanche
    & input[type="text"],
    & input[type="password"],
    & input[type="number"],
    & input[type="tel"],
    & input[type="number"] {
      background: none;
      outline: none;
      border: none;
      border-bottom: 1.5px solid#fff;
      width: 250px;
      text-align: center;
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 18px;
      color: #fff;
      &::placeholder {
        font-weight: 400;
        color: rgb(140, 140, 140);
      }
    }
    // Reset pour IOS
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      -moz-appearance: none;
      -o-appearance: none;
      appearance: none;
      margin: 0;
    }
    // Titres
    & h2 {
      color: $kakiGold;
      font-family: $titleFont;
      font-weight: 700;
      // font-size: 46px;
      // letter-spacing: 1.8px;
      text-transform: uppercase;
      // margin: 20px auto;
    }
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  // Style gobal pour la vue et ses components
  .onBoarding {
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // Ajout de la bordure d'espacement
    & > * {
      padding: 15px;
    }
    // Background image
    &::after {
      content: "";
      position: fixed;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      z-index: -2;
      background-image: url("~@/assets/BG/OnBoarding_BG_phone.gif");
      background-size: cover;
      background-attachment: fixed;
    }
    // Fond noir opaque
    &::before {
      content: "";
      position: fixed;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      z-index: -1;
      background: rgba($darkBlack, 0.4);
    }
    // Bouton de choix noir à rose
    & input[type="radio"] {
      display: none;
      &:checked + label {
        background: $sweetPink;
        color: #fff;
      }
    }
    // Inputs avec ligne blanche
    & input[type="text"],
    & input[type="password"],
    & input[type="tel"],
    & input[type="number"] {
      background: none;
      outline: none;
      border: none;
      border-bottom: 1.5px solid#fff;
      width: 250px;
      text-align: center;
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 18px;
      color: #fff;
      &::placeholder {
        font-weight: 400;
        color: rgb(140, 140, 140);
      }
    }
    // Titres
    & h2 {
      color: $kakiGold;
      font-family: $titleFont;
      font-weight: 700;
      text-transform: uppercase;
      // font-size: 26px;
      // letter-spacing: 1.8px;
      // margin: 20px auto;
    }
  }
}
</style>
