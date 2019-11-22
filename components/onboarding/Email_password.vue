<template>
  <div class="registration">
    <modal v-show="modalData.isModalVisible" @close="closeModal">
      <template v-slot:body>
        <component :is="modalData.isComponent"></component>
      </template>
    </modal>
    <section class="email">
      <h2>E-mail</h2>
      <input
        id="email"
        v-model="userEmailPasswordConditions.email"
        v-validate="'required|email|unique'"
        type="text"
        name="email"
        placeholder="Votre email"
      >
      <p class="error">{{ errors.first('email') }}</p>
    </section>
    <section class="password">
      <h2>Mot de passe</h2>
      <article class="input_password">
        <input
          id="password"
          v-model="userEmailPasswordConditions.password"
          v-validate="{ required: true, regex: passwordRegex }"
          type="password"
          name="password"
          placeholder="Votre mot de passe"
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
    <section class="cgu_cookies_newsletter">
      <section class="conditions">
        <label for="conditions">
          <input
            id="conditions"
            v-model="userEmailPasswordConditions.conditions"
            v-validate="'required'"
            type="checkbox"
            value="conditions"
            name="conditions"
            class="ckeckbox"
          >
          <p>
            J'ai lu et j'accepte les
            <button
              class="btn_link"
              @click="showModal('Cguv')"
            >conditions contractuelles</button>
            du service MatriMonline.
          </p>
        </label>
        <span
          v-show="errors.has('conditions')"
          class="error"
        >Vous devez accepter les conditions contractuelles pour vous inscrire.</span>
      </section>
      <section class="dataCollect">
        <label for="dataCollect">
          <input
            id="dataCollect"
            v-model="userEmailPasswordConditions.dataCollect"
            v-validate="'required'"
            type="checkbox"
            value="dataCollect"
            name="dataCollect"
            class="ckeckbox"
          >
          <p>
            Je reconnais et accepte que l'utilisation du service MatriMonline
            implique la collecte et le traitement de donn&eacute;es personnelles
            me concernant. Pour en savoir plus, nous vous invitons à lire avec
            attention notre
            <button
              class="btn_link"
              @click="showModal('PolitiqueDeCondidentialite')"
            >Politique de confidentialit&eacute;</button>
            et la
            <button
              class="btn_link"
              @click="showModal('PolitiqueDeCookies')"
            >Politique de cookies</button>.
          </p>
        </label>
        <span v-show="errors.has('dataCollect')" class="error">
          Vous devez reconnaître avoir pris en compte notre politique concernant
          la confidentialit&eacute; et les cookies.
        </span>
      </section>
      <section class="newsletter">
        <label for="newsletter">
          <input
            id="newsletter"
            v-model="userEmailPasswordConditions.newsletter"
            type="checkbox"
            value="newsletter"
            name="newsletter"
            class="ckeckbox"
          >
          <p>
            J'accepte de recevoir des actualités et des offres promotionnelle du
            service MatriMonline.
          </p>
        </label>
      </section>
    </section>
    <button class="validate_btn" @click="goToEligibility">Je valide</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Validator } from "vee-validate";

import CustomMsg from "./../Custom_msg.vue";
import Modal from "./../Modal.vue";
import Cguv from "./../conditions/CGUV.vue";
import PolitiqueDeCondidentialite from "./../conditions/Politique_de_confidentialite.vue";
import PolitiqueDeCookies from "./../conditions/Politique_de_cookies.vue";

// interface for input email and password
interface UserEmailPasswordConditions {
  email: string | null;
  password: string | null;
  conditions: boolean | null;
  dataCollect: boolean | null;
  newsletter: boolean | null;
}
// interface for input email and password
interface modalData {
  isModalVisible: boolean | null;
  isComponent: string | null;
}

// interface for input
interface HTMLElement {
  [key: string]: any; // Add index signature
}

@Component({
  components: {
    CustomMsg,
    Modal,
    Cguv,
    PolitiqueDeCondidentialite,
    PolitiqueDeCookies
  }
})
class Registration extends Vue {
  // initialising the object that collects email and password
  userEmailPasswordConditions: UserEmailPasswordConditions = {
    email: null,
    password: null,
    conditions: false,
    dataCollect: false,
    newsletter: false
  };
  modalData: modalData = {
    isModalVisible: false,
    isComponent: null
  };

  // RegExp that will be injected in veevalidate to verify if the password contains 12 characters or more with minimum 1 uppercase, 1 lowercase and 1 number
  passwordRegex: RegExp = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{12,})"
  );

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

  // function that send users email and password to the store, then triggers insertUser that will send the user in the database and emit next that will go to the next step
  goToEligibility(): void {
    this.$validator.validateAll().then(result => {
      if (result) {
        this.$store.commit(
          "user/populateUserRegistration",
          this.userEmailPasswordConditions
        );
        this.$store
          .dispatch("user/insertUser")
          .then(() => {
            // Sending newsletter if input checked
            if (this.userEmailPasswordConditions.newsletter === true) {
              this.$store
                .dispatch("user/newsletter_on", {
                  email: this.$store.getters["user/getEmail"],
                  name: this.$store.getters["user/getName"]
                })
                .then(() => {
                  this.$parent.$emit("next");
                })
                .catch(err => {
                  console.error(err);
                  // Si le mail n'a pas été envoyé, on envoie une notification sur discord
                  this.$store
                    .dispatch("notif/sendNewsletterEmailNotSentNotif", {
                      email: this.$store.getters["user/getEmail"],
                      name: this.$store.getters["user/getName"]
                    })
                    .then(() => {
                      return this.$parent.$emit("next");
                    });
                });
            } else {
              this.$parent.$emit("next");
            }
          })
          .catch(err => {
            console.error(err);
          });
      } else {
      }
    });
  }
  mounted() {
    // checks if the email registered is already used
    const isEmailUnique = (email: string): any => {
      return new Promise(resolve => {
        this.$store
          .dispatch("user/checkMailExistence", email)
          .then(res => {
            resolve(res);
          })
          .catch(err => console.error(err));
      });
    };

    // creating a new instance of veevalidator for our custom rule unique to check if a mail already exists
    const instance = new Validator();
    instance.extend("unique", {
      validate: isEmailUnique
    });
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
    const myInput = this.userEmailPasswordConditions.password;
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
  showModal(componentName: string | null) {
    this.modalData.isModalVisible = true;
    this.modalData.isComponent = componentName;
  }
  closeModal() {
    this.modalData.isModalVisible = false;
  }
}
export default Registration;
</script>

<style lang="scss">
$blockCGU_paddLeft: 0px;
.registration {
  // label {
  //   cursor: pointer;
  // }
  // label:hover input {
  //   color: $sweetPink;
  // }
  label input {
    visibility: hidden; /* <-- hide the default checkbox, the rest is to hide and alllow tabbing, which display:none prevents */
    display: block;
    height: 0;
    width: 0;
    position: absolute;
    overflow: hidden;
  }
  label p:before {
    /* <-- style the artificial checkbox */
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 10px;
    height: 10px;
    transition: transform 0.28s ease;
    border-radius: 2.5px;
    border: 1px solid grey;
  }
  [type="checkbox"]:checked + p:before,
  label:hover p:before {
    /* <-- style its checked state */
    content: "✔";
    border: 1px solid $sweetPink;
    background: $sweetPink;
    line-height: 11px;
    text-align: center;
  }
  .conditions,
  .dataCollect,
  .newsletter {
    p {
      width: 90%;
      position: relative;
      padding-left: 25px;
    }
  }
  .password {
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
}
@media screen and (min-width: $tablet) {
  .registration {
    height: 90%;
    width: 40%;
    margin: auto;
    & h2 {
      font-size: 46px;
      letter-spacing: 1.8px;
      margin: 20px auto;
    }
    // Ajustement du boutton validé
    & .validate_btn {
      bottom: 10%;
    }
    // Hauteur pour fiser les erreurs
    section.email,
    section.password {
      height: 20%;
    }

    // Section du block de texte à valider
    .cgu_cookies_newsletter {
      margin: 25px auto 0px;
      height: 35%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-content: center;
      & a {
        color: #fff;
      }
      & .error {
        width: 100%;
      }
      // Paragraphes du block de texte à valider
      .conditions,
      .dataCollect,
      .newsletter {
        color: #fff;
        margin: 2px 0px;
        text-align: left;
        & label {
          font-family: $paragraphFont_A;
          font-weight: 300;
          line-height: 14px;
          font-size: 14px;
          letter-spacing: 1px;
          text-shadow: #000 1px 0 10px;
          display: flex;
          flex-direction: row;
          & > input {
            margin: 0 5px 5px;
          }
          & > p {
            text-align: justify;
            text-justify: inter-character;
          }
        }
      }
    }
    // Champ du mot de passe avec image d'oeil
    & .input_password {
      width: fit-content;
      margin: auto;
      position: relative;
      display: table;
      & input {
        padding-right: 30px;
        box-sizing: border-box;
      }
      .showPassword {
        position: absolute;
        bottom: 5px;
        right: 0px;
        color: #fff;
        border: none;
        background: none;
        &:hover {
          color: $sweetPink;
        }
      }
    }
    // Bouton des CGU, confidentialite et cookies
    .btn_link {
      border: none;
      outline: none;
      background: none;
      color: inherit;
      font: inherit;
      letter-spacing: inherit;
      text-decoration: underline;
      padding: 0px;
    }
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .registration {
    margin: auto;
    & h2 {
      font-size: 46px;
      letter-spacing: 1.8px;
      margin: 20px auto;
    }
    // Hauteur pour fiser les erreurs
    section.email,
    section.password {
      height: 20%;
    }
    // Section du block de texte à valider
    .cgu_cookies_newsletter {
      margin: 25px auto 0px;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-content: center;
      & a {
        color: #fff;
      }
      & .error {
        width: 100%;
      }
      // Paragraphes du block de texte à valider
      .conditions,
      .dataCollect,
      .newsletter {
        color: #fff;
        margin: 2px 0px;
        text-align: left;
        & label {
          font-family: $paragraphFont_A;
          font-weight: 300;
          line-height: 14px;
          font-size: 14px;
          letter-spacing: 1px;
          text-shadow: #000 1px 0 10px;
          display: flex;
          flex-direction: row;
          & > input {
            margin: 0 5px 5px;
          }
          & > * {
            text-align: left;
            margin: 4px 0;
            padding-left: $blockCGU_paddLeft;
          }
        }
      }
    }
    // Champ du mot de passe avec image d'oeil
    & .input_password {
      width: fit-content;
      margin: auto;
      position: relative;
      display: table;
      & input {
        padding-right: 30px;
        box-sizing: border-box;
      }
      .showPassword {
        position: absolute;
        bottom: 5px;
        right: 0px;
        color: #fff;
        border: none;
        background: none;
      }
    }
    // Bouton des CGU, confidentialite et cookies
    .btn_link {
      border: none;
      outline: none;
      background: none;
      color: inherit;
      font: inherit;
      letter-spacing: inherit;
      text-decoration: underline;
      padding: 0px;
    }
  }
}
</style>
