<template>
  <section class="reset_password">
    <section class="password">
      <h2>Modifier mon mot de passe</h2>
      <article class="input_password">
        <input
          id="password"
          v-model="userPassword.password"
          v-validate="{ required: true, regex: passwordRegex }"
          type="password"
          name="password"
          class="input_bottom_border_white"
          placeholder="Nouveau mot de passe"
          @focus="showValidations"
          @blur="hideValidations"
          @input="checkValidations"
        >
        <button id="showPassword_icon" class="showPassword fa fa-eye-slash" @click="showPassword"></button>
      </article>
      <p class="error">{{ errors.first('password') }}</p>
      <div ref="passwordValidation" class="password-validation">
        <h3>Le mot de passe doit au moins contenir :</h3>
        <p ref="letter" class="invalid">une lettre minuscule</p>
        <p ref="capital" class="invalid">une lettre majuscule</p>
        <p ref="number" class="invalid">un nombre</p>
        <p ref="length" class="invalid">12 caractères</p>
      </div>
    </section>
    <button class="validate_btn" @click="valid_newPassword">Modifier</button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';
import auth from './../../../utils/auth';

// interface for input password
interface UserPassword {
  password: string | null;
}

// interface for input
interface HTMLElement {
  [key: string]: any; // Add index signature
}

@Component({
  name: "resetPassword",
  middleware: ["initWithToken", "checkParamsInRoute"]
})

class Reset_password extends Vue {
  userPassword: UserPassword = {
    password: null
  }
  // password: string | null = "";
  get user() {
    return jwtDecode(this.$route.params.token).userId;
  }

  created() {
  }
  
  // RegExp that will be injected in veevalidate to verify if the password contains 12 characters or more with minimum 1 uppercase, 1 lowercase and 1 number
  passwordRegex: RegExp = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{12,})"
  );

  log(token): void {
    auth.setLocalToken(token);
    Cookie.set('jwt', token);
    this.$router.push('/');
  }
  valid_newPassword(): void {
    this.$validator.validateAll().then(result => {
      if(result) {
        this.$store
        .dispatch('user/updatePassword', {pass:{password: this.userPassword.password}, id: this.user})
        .then((result) => {
          this.log(result);
        })
        .catch(err => {
                console.error(err);
              });
      } else {}
    })
  }
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
  showValidations(): void {
    const validations: HTMLElement = this.$refs.passwordValidation;
    validations.style.display = "block";
  }
  hideValidations(): void {
    const validations: HTMLElement = this.$refs.passwordValidation;
    validations.style.display = "none";
  }
  checkValidations() {
    // Validate lowercase letters
    const myInput = this.userPassword.password;
    const letter: HTMLElement = this.$refs.letter;
    const capital: HTMLElement = this.$refs.capital;
    const number: HTMLElement = this.$refs.number;
    const length: HTMLElement = this.$refs.length;
    if (myInput !== null) {
      const lowerCaseLetters = /[a-z]/g;
      if (myInput.match(lowerCaseLetters)) {
        letter.classList.remove("invalid");
        letter.classList.add("valid");
      } else {
        letter.classList.remove("valid");
        letter.classList.add("invalid");
      }

      // Validate capital letters
      const upperCaseLetters = /[A-Z]/g;
      if (myInput.match(upperCaseLetters)) {
        capital.classList.remove("invalid");
        capital.classList.add("valid");
      } else {
        capital.classList.remove("valid");
        capital.classList.add("invalid");
      }

      // Validate numbers
      const numbers = /[0-9]/g;
      if (myInput.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
      } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
      }

      // Validate length
      if (myInput.length >= 12) {
        length.classList.remove("invalid");
        length.classList.add("valid");
      } else {
        length.classList.remove("valid");
        length.classList.add("invalid");
      }
    }
  }
  
}
export default Reset_password;
</script>

<style lang="scss">
.reset_password {
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
  & h2 {
    color: $kakiGold;
    font-family: $titleFont;
    font-weight: 700;
    font-size: 46px;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    margin: 20px auto;
  }
  .password-validation {
    display: none;
    width: fit-content;
    z-index: 5;
    background: $darkBlack;
    background-image: radial-gradient(
      closest-side,
      rgba(255, 255, 255, 0.95) 80%,
      rgba(255, 255, 255, 0.9)
    );
    border-radius: 6px;
    color: $darkBlack;
    position: relative;
    padding: 20px 40px;
    margin: 10px auto 0;
    font-family: $paragraphFont_A;
    font-size: 16px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.4);
    p {
      text-align: left;
      padding: 5px 0;
      padding-left: calc(40% - 35px);
      font-weight: 700;
      &:first-of-type {
        margin-top: 15px;
      }
    }
  }
  /* Add a green text color and a checkmark when the requirements are right */
  .valid {
    color: #3bb44a;
    transition: color 0.3s linear;
  }

  .valid:before {
    content: "\f00c";
    width: 20px;
    text-align: center;
    display: inline-flex;
    justify-content: center;
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    position: relative;
    left: -35px;
    transform: rotate(0deg);
    transition: transform 0.3s ease-out;
  }

  /* Add a gray text color and an "x" icon when the requirements are wrong */
  .invalid {
    color: $gray;
    transition: color 0.3s linear;
  }

  .invalid:before {
    content: "\f00d";
    width: 20px;
    text-align: center;
    display: inline-flex;
    justify-content: center;
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    position: relative;
    left: -35px;
    transform: rotate(-90deg);
    transition: transform 0.3s ease-in;
  }
}
@media screen and (min-width: $tablet) {
  .reset_password {
    height: 90%;
    width: 40%;
    margin: auto;
    // Ajustement du boutton validé
    & .validate_btn {
      bottom: 10%;
    }
    // // Hauteur pour fixer les erreurs
    // section.email,
    // section.password {
    //   height: 20%;
    // }
    // Champ du mot de passe avec image d'oeil
    & .input_password {
      width: fit-content;
      margin: auto;
      position: relative;
      .showPassword {
        position: absolute;
        bottom: 5px;
        right: 0px;
        color: #fff;
        border: none;
        background: none;
      }
    }
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .reset_password {
    margin: auto;
    // Hauteur pour fixer les erreurs
    section.password {
      height: 20%;
    }
    // Champ du mot de passe avec image d'oeil
    & .input_password {
      width: fit-content;
      margin: auto;
      position: relative;
      .showPassword {
        position: absolute;
        bottom: 5px;
        right: 0px;
        color: #fff;
        border: none;
        background: none;
      }
    }
  }
}
</style>