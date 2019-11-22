<template>
  <section class="third-screen">
    <!-- BIRTHDAY -->
    <section class="birthday">
      <h2>Date de naissance</h2>
      <div class="birthdayInput">
        <input
          id="day"
          v-model="birthday.day"
          type="tel"
          maxlength="2"
          placeholder="JJ"
          pattern="\d*"
          @input="goToNextInput($event, 'month')"
          @change="testBirthday"
        />
      </div>
      <div class="birthdayInput">
        <input
          id="month"
          v-model="birthday.month"
          type="tel"
          maxlength="2"
          placeholder="MM"
          pattern="\d*"
          @input="goToNextInput($event, 'year')"
          @change="testBirthday"
        />
      </div>
      <div class="birthdayInput">
        <input
          id="year"
          v-model="birthday.year"
          type="tel"
          maxlength="4"
          class="year"
          placeholder="AAAA"
          pattern="\d*"
          @change="testBirthday"
        />
      </div>
      <CustomMsg :msg="birthdayErrorMessage" css="error" />
    </section>
    <section class="phoneCedex">
      <!-- PHONE NUMBER -->
      <section class="phone">
        <h2>Téléphone</h2>
        <input
          id="phone"
          v-model="user.phone"
          v-validate="'required|digits:10'"
          type="tel"
          name="phone"
          maxlength="10"
          placeholder="ex: 0612345678"
        />
        <p class="error">{{ errors.first('phone') }}</p>
      </section>
      <!-- CEDEX -->
      <section class="cedex">
        <h2>Code Postal</h2>
        <input
          id="cedex"
          v-model="user.cedex"
          v-validate="'required|min:5|max:5|isCedexValid'"
          type="number"
          maxlength="5"
          name="cedex"
          placeholder="ex: 12345"
          list="cedex_list"
          @input="autocomplete()"
        />
        <p class="error">{{ errors.first('cedex') }}</p>
        <datalist id="cedex_list">
          <option v-for="cedex in cedexs" :key="cedex.id" :value="cedex.cedex"></option>
        </datalist>
      </section>
    </section>
    <!-- MARITAL STATUS -->
    <section class="situation">
      <h2>Situation matrimoniale</h2>
      <section class="situationInputs">
        <input
          v-if="userSex === 'M'"
          id="veuf"
          v-model="user.situation"
          v-validate="
            'required|included:veuf,en instance de divorce,célibataire,séparé,divorcé'
          "
          type="radio"
          name="situation"
          value="veuf"
        />
        <label v-if="userSex === 'M'" class="choice_btn" for="veuf">Veuf</label>
        <input
          v-if="userSex === 'F'"
          id="veuve"
          v-model="user.situation"
          v-validate="
            `required|included:veuve,célibataire,séparée,divorcée,en instance de divorce`
          "
          type="radio"
          name="situation"
          value="veuve"
        />
        <label v-if="userSex === 'F'" class="choice_btn" for="veuve">Veuve</label>
        <input
          id="instance"
          v-model="user.situation"
          type="radio"
          name="situation"
          value="en instance de divorce"
        />
        <label class="choice_btn" for="instance">En instance de divorce</label>
        <input
          v-if="userSex === 'M'"
          id="divorcé"
          v-model="user.situation"
          type="radio"
          name="situation"
          value="divorcé"
        />
        <label v-if="userSex === 'M'" class="choice_btn" for="divorcé">Divorcé</label>
        <input
          v-if="userSex === 'F'"
          id="divorcée"
          v-model="user.situation"
          type="radio"
          name="situation"
          value="divorcée"
        />
        <label v-if="userSex === 'F'" class="choice_btn" for="divorcée">Divorcée</label>
        <input
          id="célibataire"
          v-model="user.situation"
          type="radio"
          name="situation"
          value="célibataire"
        />
        <label class="choice_btn" for="célibataire">Célibataire</label>
        <input
          v-if="userSex === 'M'"
          id="séparé"
          v-model="user.situation"
          type="radio"
          name="situation"
          value="séparé"
        />
        <label v-if="userSex === 'M'" class="choice_btn" for="séparé">Séparé</label>
        <input
          v-if="userSex === 'F'"
          id="séparée"
          v-model="user.situation"
          type="radio"
          name="situation"
          value="séparée"
        />
        <label v-if="userSex === 'F'" class="choice_btn" for="séparée">Séparée</label>
        <p class="error">{{ errors.first('situation') }}</p>
      </section>
    </section>

    <button id="validate_btn" class="validate_btn" @click="nextStep">Valider</button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Validator } from "vee-validate";
import CustomMsg from "@/components/Custom_msg.vue";
import auth from "./../../utils/auth";

@Component({
  components: {
    CustomMsg
  }
})
class ThirdScreen extends Vue {
  user: {
    cedex: string;
    situation: string;
    birthday: string;
    phone: string;
  } = {
    cedex: "",
    situation: "",
    birthday: "",
    phone: ""
  };

  birthday: {
    day: string;
    month: string;
    year: string;
  } = {
    day: "",
    month: "",
    year: ""
  };

  userId: number | undefined = undefined;
  userSex: string | null = null;
  // string for the error on brithday
  birthdayErrorMessage: string = "";

  // this regex allows to verify if the date is valid (no alpha, leap years, 30/31 february etc..)
  birthdayRegex: RegExp = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)\d{2})$/;

  // get 15 cedex code from the store thanks to the user input that will allow to show autocompletion
  get cedexs() {
    return this.$store.getters["cedex/getAutocompletion"];
  }

  // get the 15 cedexs code from the database while the user is typing
  autocomplete() {
    if (this.user.cedex.length <= 1 || this.user.cedex.length === 5) {
    } else this.$store.dispatch("cedex/getAutocompletion", this.user.cedex);
  }

  // calculate the age of the user thanks to his birthday will allow to verify if > 18
  dateDiff(birthday: any, today: any) {
    const ynew = today.getFullYear();
    const mnew = today.getMonth();
    const dnew = today.getDate();
    const yold = birthday.getFullYear();
    const mold = birthday.getMonth();
    const dold = birthday.getDate();
    let diff = ynew - yold;
    if (mold > mnew) diff--;
    else if (mold === mnew) {
      if (dold > dnew) diff--;
    }
    return diff;
  }

  // function that leap from an input to the other so the user can type continuously
  goToNextInput(evt: any, next: string): void {
    const nextInput = document.getElementById(next);
    const current: HTMLInputElement = evt.target;
    if (nextInput && current && current.value.length === 2) {
      nextInput.focus();
    }
  }

  testBirthday() {
    const { day, month, year } = this.birthday;
    if (day && month && year) {
      this.checkBirthday();
    }
  }
  // checks if the birthday correspond to an actual date and if the user is > 18
  checkBirthday() {
    const { day, month, year } = this.birthday;
    const birthday = new Date(`${month}-${day}-${year}`);
    const today = new Date();
    const age = this.dateDiff(birthday, today);
    const isValidDate = `${day}-${month}-${year}`.match(this.birthdayRegex);
    if (age < 18 || age > 90) {
      this.birthdayErrorMessage =
        "Vôtre âge ne correspond pas aux critères du site.";
      return false;
    } else if (isValidDate) {
      this.birthdayErrorMessage = "";
      this.user.birthday = `${day}-${month}-${year}`;
      return true;
    }
    this.birthdayErrorMessage = "Votre date de naissance semble incorrect.";
    return false;
  }

  // send user info to the database
  nextStep() {
    const isDateValid = this.checkBirthday();
    this.$validator.validateAll().then(res => {
      if (res && isDateValid) {
        const id = auth.getTokenUserId();
        if (id) {
          console.log(this.user);
          this.$store.dispatch(`user/updateUser`, { id, body: this.user });
          this.$parent.$emit("next");
        }
      }
    });
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

  created() {
    const user = this.$store.getters["user/getLoggedUser"];
    this.userSex = user.sex;
  }
}

export default ThirdScreen;
</script>

<style lang="scss">
.third-screen {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-evenly;
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .cedex,
  .birthday,
  .phone {
    height: 150px;
  }
  .birthday {
    text-align: center;
  }
  .situation {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .cedex,
  .birthday,
  .phone,
  .situation,
  .phoneCedex {
    color: #fff;
    width: 45%;
    margin: 5px auto;
    font-family: $paragraphFont_A;
    font-weight: 300;
    line-height: 18px;
    font-size: 12px;
    letter-spacing: 1.2px;
    & h2 {
      width: 100%;
      text-align: center;
      font-size: 36px;
      line-height: 38px;
      letter-spacing: 1.8px;
      margin: 20px auto;
    }

    & .situationInputs {
      flex-wrap: wrap;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: 70%;
    }

    &.phoneCedex {
      display: flex;
      flex-wrap: wrap;
      min-width: 310px;
    }

    & .birthdayInput {
      display: inline-flex;
      input {
        width: 62.5px;
        &.year {
          width: 125px;
        }
      }
    }
  }

  .error {
    width: 100%;
    text-align: center;
  }

  #validate_btn {
    position: relative;
    display: block;
    left: 0;
    transform: none;
    margin: 4vh auto;
  }
}

@media screen and (min-width: $tablet - 1px) and (max-width: 1280px) {
  .third-screen {
    .cedex,
    .birthday,
    .phone,
    .situation,
    .phoneCedex {
      width: 50%;
    }
    .phoneCedex {
      width: 55%;
    }
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .third-screen {
    min-width: 310px;
    width: 100%;
    height: auto;

    label {
      text-align: center;
    }
    .cedex,
    .birthday,
    .phone,
    .situation,
    .phoneCedex {
      width: 100%;
      & h2 {
        font-size: 26px;
        line-height: 28px;
      }
      &.situation {
        margin-bottom: 0;
        .situationInputs {
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
}
</style>
