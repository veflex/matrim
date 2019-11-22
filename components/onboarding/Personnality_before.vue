<template>
  <section class="personnalityTestBefore">
    <img src="@/assets/logo/logo.png" alt="logo" />
    <h1>Merci {{ user.name }} et bienvenue sur MatriMonline !</h1>
    <article class="description">
      <p>Plus que quelques minutes pour finaliser votre profil...</p>
      <p>Pour mieux vous connaître, nous allons vous poser une série de questions. Merci de répondre à l'ensemble des questions, c'est très important !</p>
      <p>Ne vous inquiétez pas, toutes vos réponses sont sauvegardées automatiquement. Vous pourrez à nouveau y avoir accès pour les modifier, une fois que vous aurez terminé.</p>
    </article>
    <button class="validate_btn" @click="next">C'est à vous...</button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({
  name: "PersonnalityTestBefore"
})
class PersonnalityTestBefore extends Vue {
  @Prop() id: any;
  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }
  next() {
    this.$store
      .dispatch("user/updateUser", {
        id: this.user.id,
        body: {
          onboarding_step: "done"
        }
      })
      .then(() => {
        console.log("ca dégage");
        this.$router.push("/personnality");
      });
  }
  created() {}
}
export default PersonnalityTestBefore;
</script>

<style lang="scss">
@media screen and (min-width: $tablet) {
  .personnalityTestBefore {
    width: 80%;
    height: 80%;
    margin: auto;
    // Titre
    & h1 {
      color: $kakiGold;
      font-family: $titleFont;
      font-weight: 700;
      font-size: 36px;
      letter-spacing: 1.8px;
      text-transform: uppercase;
      margin: 40px auto;
    }
    // Logo MatriMonline
    img {
      width: 250px;
      margin: 5px auto 20px;
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
  .personnalityTestBefore {
    margin: auto;
    width: 100%;
    // Titre
    & h1 {
      color: $kakiGold;
      font-family: $titleFont;
      font-weight: 700;
      font-size: 30px;
      letter-spacing: 1.8px;
      text-transform: uppercase;
      margin: 40px auto;
    }
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
      font-size: 14px;
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
