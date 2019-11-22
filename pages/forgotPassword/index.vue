<template>
  <section class="forgot_password">
    <h1>Mot de passe oubli&eacute;</h1>
    <section class="email">
      <input
        id="email"
        v-model="userEmail.email"
        v-validate="'required|email|notAccount'"
        type="text"
        class="input_bottom_border_white"
        name="email"
        placeholder="Votre adresse email"
        data-vv-delay="1000"
      >
      <p v-show="errors.has('email')" class="error">{{ errors.first('email') }}</p>
    </section>
    <button class="validate_btn" @click="send_Email">Envoyer</button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Validator } from "vee-validate";

// interface for input password
interface UserEmail {
  email: string | null;
}

@Component({
  name: "forgotPassword",
  middleware: "initWithToken"
})

class Forgot_password extends Vue {
  userEmail: UserEmail = {
    email: null
  }
  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }
  created() {

  }
  mounted() {
    // checks if the email registered is already used
    const isEmailUnique = (email: string): any => {
      return new Promise(resolve => {
        this.$store
          .dispatch("user/checkMailExistence", email)
          .then(res => {
            resolve(!res.valid);
          })
          .catch(err => console.error(err));
      });
    };

    // creating a new instance of veevalidator for our custom rule unique to check if a mail already exists
    const instance = new Validator();
    instance.extend("notAccount", {
      validate: isEmailUnique
    });
  }
  send_Email() {
    this.$validator.validateAll().then(result => {
      if (result) {
        this.$store
          .dispatch("user/reset_password", {email: this.userEmail.email})
          .then(() => {
            console.log("success")
          })
          .catch(err => {
            console.error(err);
          })
      } else {

      }
    })
  }
}
export default Forgot_password;
</script>

<style lang="scss">
.forgot_password{
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
  // Titres
  & h1 {
    color: $kakiGold;
    font-family: $titleFont;
    font-weight: 700;
    font-size: 46px;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    margin: 20px auto;
  }
}
</style>

