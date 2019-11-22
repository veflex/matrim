<template>
  <section class="cam-explications">
    <article class="anchors">
      <h1>Activation de la caméra sur le navigateur :</h1>

      <hr class="separator" />

      <div class="links">
        <a href="#google">Activer sa caméra sur Google Chrome</a>
        <a href="#firefox">Activer sa caméra sur Mozilla Firefox</a>
        <a href="#edge">Activer sa caméra sur Edge</a>
        <a href="#safari">Activer sa caméra sur Safari</a>
      </div>
    </article>

    <!-- GOOGLE CHROME -->
    <article id="google" class="google">
      <h2 class="title">Activation de la caméra sur Google chrome :</h2>
      <p class="step">
        Étape 1: Cliquez sur le cadenas à gauche de votre URL de navigation --> indiqué par un
        <span
          class="red-circle"
        ></span> sur le schéma ci-dessous
      </p>
      <img
        class="step-img"
        src="@/assets/img-capture-cam/Etape1_chrome.jpg"
        alt="premiere étape pour débloquer la caméra google chrome"
      />
      <p class="step">Étape 2: Cliquez sur le menu "Demander(par defaut)" de l'appareil photo:</p>
      <img
        src="@/assets/img-capture-cam/Etape2_chrome.jpg"
        alt="deuxieme étape pour débloquer la caméra google chrome"
        class="step-img second"
      />
      <p class="step">Étape 3: Cliquez sur autoriser:</p>
      <img
        src="@/assets/img-capture-cam/Etape3_chrome.jpg"
        alt="troisieme étape pour débloquer la caméra google chrome"
        class="step-img second"
      />
    </article>

    <!-- FIREFOX -->
    <article id="firefox" class="firefox">
      <h2 class="title">Activation de la caméra sur Mozilla firefox :</h2>
      <p class="step">Étape 1: Cette pop up apparaît, cliquez sur autoriser :</p>
      <img
        src="@/assets/img-capture-cam/Etape1_firefox.jpg"
        alt="premiere étape pour débloquer la caméra firefox"
        class="step-img second"
      />
      <p class="step">Étape 2: La caméra apparaît, elle est activée :</p>
      <img
        src="@/assets/img-capture-cam/Etape2_firefox.jpg"
        alt="deuxieme étape pour débloquer la caméra firefox"
        class="step-img second-firefox"
      />
    </article>

    <!-- EDGE -->
    <article id="edge" class="edge">
      <h2 class="title">Activation de la caméra sur Edge :</h2>
    </article>

    <!-- SAFARI -->
    <article id="safari" class="safari">
      <h2 class="title">Activation de la caméra sur Safari :</h2>
    </article>
    <CustomMsg v-if="msg" :msg="msg" :css="'error'" />
    <GetMail @validMail="isEmailValid === true" @isEmailValid="handleInput" />
    <button @click="sendMail">Recevoir un mail de connexion pour allé sur mobile</button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import GetMail from "@/components/GetMail.vue";
import CustomMsg from "@/components/Custom_msg.vue";

@Component({
  name: "camExplications",
  components: {
    GetMail,
    CustomMsg
  },
  layout: "onboarding"
})
class CamExplications extends Vue {
  email: string | null = null;
  isEmailValid: boolean = false;
  msg: string = "";
  handleInput(input) {
    console.log(input);
    this.msg = input.errorMsg;
    this.isEmailValid = input.isEmailValid;
    this.email = input.email;
  }
  sendMail() {
    if (this.isEmailValid) {
      this.$store.dispatch("user/checkMailExistence", this.email).then(res => {
        if (!res.valid) {
          this.$store.dispatch("mail/sendConnexionMail", this.email);
        }
      });
    }
  }
}
export default CamExplications;
</script>

<style lang="scss">
.cam-explications {
  min-height: 100vh;

  & article {
    display: block;
    font-family: $paragraphFont_Q;
    min-height: 100vh;
    padding: 30px;
    .second-firefox {
      width: 100%;
      border-radius: 9px;
    }
  }
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
  .separator {
    width: 45%;
    margin: auto;
    border: 1.5px solid white;
    margin-bottom: 7%;
  }
  .anchors {
    height: 100vh;
    h1 {
      color: $kakiGold;
      font-weight: 700;
      font-size: calc(2vw + 20px);
      letter-spacing: 1.8px;
      margin-bottom: 3%;
      text-align: center;
      margin-bottom: 3%;
      display: block;
    }

    .links {
      width: 60%;
      height: 40%;
      background: white;
      opacity: 0.5;
      border-radius: 25px;
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      text-align: left;
      padding: 40px;
      a {
        text-decoration: underline;
        color: black;
        font-size: calc(1vw + 10px);
        &:hover {
          color: $blueGround;
        }
      }
    }
  }
  & .title {
    text-decoration: underline;
    color: $kakiGold;
    font-size: 35px;
    text-align: left;
    margin-bottom: 3%;
  }
  & .step {
    color: white;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: 1px;
    text-align: left;
    margin-bottom: 3%;
    & .red-circle {
      width: 25px;
      display: inline-block;
      height: 25px;
      border-radius: 50%;
      background: transparent;
      border: 2px solid red;
    }
  }
  .step-img {
    width: 80%;
    margin-bottom: 3%;
    display: block;
    border-radius: 13px;
    &.second {
      width: 40%;
    }
  }
  .google {
  }
}
</style>
