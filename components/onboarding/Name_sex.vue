<template>
  <section class="name-sex">
    <section class="sex">
      <h2>Je suis</h2>
      <input
        id="sexM"
        v-model="userNameSex.sex"
        v-validate="'required|included:M,F'"
        type="radio"
        name="sex"
        value="M"
      >
      <label for="sexM" class="choice_btn">Un homme</label>
      <input id="sexF" v-model="userNameSex.sex" type="radio" name="sex" value="F">
      <label for="sexF" class="choice_btn">Une femme</label>
      <p class="error">{{ errors.first('sex') }}</p>
    </section>
    <section class="name">
      <h2>Mon prénom est</h2>
      <input
        v-model="userNameSex.name"
        v-validate="{
          required: true,
          regex: /^[a-zàâçéèêëîïôûùüÿñæœ -]+$/i,
          min: 2,
          max: 20
        }"
        type="text"
        name="name"
        placeholder="Votre prénom"
      >
      <p class="error">{{ errors.first('name') }}</p>
    </section>

    <button class="validate_btn" @click="nextStep">Je m'inscris</button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

// interface for input sex and name
interface UserNameSex {
  sex: string | null;
  name: string | null;
}

@Component
class Registration extends Vue {
  // user object with his sex and his name
  userNameSex: UserNameSex = {
    sex: null,
    name: null
  };

  // function that checks both inputs with veevalidate
  // if both are valid the name and sex are stored and we go to the next step
  nextStep(): void {
    this.$validator.validateAll().then(result => {
      if (result) {
        this.$store.commit("user/populateUserRegistration", this.userNameSex);
        this.$parent.$emit("next");
      }
    });
  }
}

export default Registration;
</script>

<style lang="scss">
@media screen and (min-width: $tablet) {
  .name-sex {
    height: 80%;
    width: 45%;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 10%;
    & h2 {
      font-size: 46px;
      letter-spacing: 1.8px;
      margin: 20px auto;
    }
    // Hauteur pour éviter les saut avec les messages d'erreurs
    section.sex,
    section.name {
      height: 35%;
    }
    // Ajustement du bouton validé
    & .validate_btn {
      bottom: 20%;
    }
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .name-sex {
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 70vh;
    margin: 10% auto;
    & h2 {
      font-size: 46px;
      letter-spacing: 1.8px;
      margin: 20px auto;
    }
    // Hauteur pour éviter les saut avec les messages d'erreurs
    section.sex,
    section.name {
      height: 35%;
    }
    // Ajustement du bouton validé
    & .validate_btn {
      bottom: 20%;
    }
  }
}
</style>
