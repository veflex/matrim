<template>
  <section class="login">
    <CustomMsg :msg="errorMsg" :css="'error'"></CustomMsg>
    <label for="email">
      E-mail
      <article class="inputLog">
        <i class="fas fa-user-alt"></i>
        <input
          id="email"
          v-model="user.email"
          v-validate="'required|email'"
          type="text"
          name="email"
          placeholder="Email"
        />
      </article>
      <p class="error">{{ errors.first('email') }}</p>
    </label>
    <label for="password">
      Mot de passe
      <article class="inputLog">
        <i class="fas fa-lock"></i>
        <input
          id="password"
          v-model="user.password"
          v-validate="'required'"
          type="password"
          name="password"
          placeholder="Mot de passe"
        />
        <button id="showPassword_icon" class="showPassword fa fa-eye-slash" @click="showPassword"></button>
      </article>
      <p class="error">{{ errors.first('password') }}</p>
    </label>
    <section class="connexion_register">
      <button class="pink_btn" @click="login">Connexion</button>
      <nuxt-link class="link" :to="{ name: 'forgotPassword' }">Mot de passe oubli&eacute;</nuxt-link>
    </section>
    <p class="notRegister">
      Pas encore membre ?
      <nuxt-link to="/onboarding" class="link">Inscrivez-vous</nuxt-link>maintenant.
    </p>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import CustomMsg from "@/components/Custom_msg.vue";

interface HTMLElement {
  [key: string]: any; // Add index signature
}
@Component({
  components: {
    CustomMsg
  }
}) // interface for input
class Login extends Vue {
  user: {
    email: string | null;
    password: string | null;
  } = {
    email: "flex@flex.fr",
    password: "flexfleX1201"
  };
  errorMsg: string = "";
  login() {
    this.$validator.validateAll().then(res => {
      if (res) {
        this.$store
          .dispatch("user/login", this.user)
          .then(user => {
            if (user.onboarding_step < 4) {
              this.$router.push({ name: "onboarding" });
            } else {
              this.$router.push(`/profil/${user.id}`);
            }
          })
          .catch(err => {
            this.errorMsg = err.response.data;
          });
      }
    });
  }
  // function that transforms password input into text input so we can see the password
  showPassword(): void {
    const input: HTMLElement | null = document.getElementById("password");
    const icon: HTMLElement | null = document.getElementById(
      "showPassword_icon"
    );
    if (input && icon) {
      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa", "far");
        icon.classList.replace("fa-eye-slash", "fa-eye");
      } else {
        input.type = "password";
        icon.classList.replace("far", "fa");
        icon.classList.replace("fa-eye", "fa-eye-slash");
      }
    }
  }
}

export default Login;
</script>

<style lang="scss">
@media screen and (min-width: $tablet) {
  .login {
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.25) 30%,
      rgba(255, 255, 255, 0.45)
    );
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    min-height: 400px;
    height: 60vh;
    max-height: 600px;
    min-width: 200px;
    width: 600px;
    margin: auto !important;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    // Inputs ajustements avec icone
    & input {
      width: auto;
    }
    & i {
      width: 40px;
    }
    & input,
    & i {
      display: inline-block;
      align-self: center;
      border: none;
      outline: none;
      font-size: 20px;
      background: transparent;
      text-align: left;
      color: #fdfcfd;
      text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
    }
    // Parent du composant input
    & .inputLog {
      width: fit-content;
      font-size: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      margin: 5px auto;
      display: flex;
      flex-wrap: nowrap;
      position: relative;
    }
    // Label qui englobe l'input
    & label {
      width: fit-content;
      color: $blueGround;
      // font-family: $paragraphFont_A;
      font-family: $titleFont;
      text-transform: uppercase;
      font-weight: 700;
      text-align: left;
      font-size: 26px;
      height: 100px;
    }
    // Texte de redirection vers register
    .notRegister {
      color: #fff;
    }
    // Champ du mot de passe avec image d'oeil
    .showPassword {
      position: absolute;
      bottom: 5px;
      right: 0px;
      color: #fff;
      border: none;
      background: none;
    }
    .connexion_register {
      margin-bottom: 10px;
      a {
        margin: 5px auto 0;
        display: block;
      }
    }
    .link {
      text-shadow: 0px 0px 12px rgba(255, 255, 255, 0.4);
    }
    .link,
    .notRegister {
      font-weight: 400;
      font-size: 14px;
      letter-spacing: 1.2px;
    }
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .login {
    min-height: 400px;
    height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    // Inputs ajustements avec icone
    & input {
      width: auto;
    }
    & i {
      width: 40px;
    }
    & input,
    & i {
      display: inline-block;
      align-self: center;
      border: none;
      outline: none;
      font-size: 20px;
      background: transparent;
      color: #fdfcfd;
    }
    // Parent du composant input
    & .inputLog {
      width: fit-content;
      font-size: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      margin: 5px auto;
      display: flex;
      flex-wrap: nowrap;
      position: relative;
    }
    // Label qui englobe l'input
    & label {
      width: fit-content;
      color: $blueGround;
      font-family: $titleFont;
      font-weight: 700;
      text-align: left;
      font-size: 26px;
      height: 100px;
    }
    // Texte de redirection vers register
    .notRegister {
      color: #fff;
    }
    // Champ du mot de passe avec image d'oeil
    .showPassword {
      position: absolute;
      bottom: 5px;
      right: 0px;
      color: #fff;
      border: none;
      background: none;
    }
    .connexion_register {
      a {
        margin: 5px auto 0;
        display: block;
      }
    }
    .link,
    .notRegister {
      font-weight: 400;
      font-size: 16px;
      font-family: $paragraphFont_Q;
      letter-spacing: 1.2px;
    }
    .link {
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
