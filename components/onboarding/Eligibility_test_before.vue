<template>
  <section class="EligibilityTestBefore">
    <img src="@/assets/logo/logo.png" alt="logo" />
    <article class="description">
      <p>Merci {{ userName }} et bienvenue sur MatriMonline !</p>
      <p>
        La s&eacute;lection des membres est primordiale chez MatriMonline et est
        la base de notre service.
      </p>
      <p>
        Avant de pouvoir continuer &agrave; compl&eacute;ter votre profil, merci
        de r&eacute;pondre &agrave; ces quelques questions.
      </p>
    </article>
    <button class="validate_btn" @click="next">C'est parti</button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({
  name: "EligibilityTestBefore"
})
class EligibilityTestBefore extends Vue {
  get userName() {
    return this.$store.getters["user/getLoggedUser"].name;
  }
  next() {
    this.$parent.$emit("next");
  }
  created() {}
}
export default EligibilityTestBefore;
</script>

<style lang="scss">
@media screen and (min-width: $tablet) {
  .EligibilityTestBefore {
    width: 80%;
    height: 60%;
    margin: auto;
    // Logo MatriMonline
    img {
      width: 400px;
      margin: 40px auto;
    }
    // Ajustement de la position du boutton validé
    & .validate_btn {
      bottom: 20%;
    }
    // Paragraphe de description
    .description {
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 18px;
      color: #fff;
      letter-spacing: 1.8px;
      & p {
        margin: 10px auto;
      }
    }
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .EligibilityTestBefore {
    margin: auto;
    width: 100%;
    // Logo MatriMonline
    img {
      min-width: 300px;
      width: 90%;
      max-width: 400px;
      margin: 40px auto;
    }
    // Paragraphe de description
    .description {
      display: block;
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 18px;
      color: #fff;
      letter-spacing: 1.8px;
      margin: auto;
      & > * {
        margin: 20px auto;
      }
    }
  }
}
</style>
