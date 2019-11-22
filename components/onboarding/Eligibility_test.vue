<template>
  <div v-if="eligibilityQuestions" class="eligibility-test">
    <customMsg :msg="message" :css="'error'" />
    <div v-for="(question, i) in eligibilityQuestions" :key="question.id">
      <p class="eligibility_question">{{ question.question }}</p>
      <input
        :id="'yes' + i"
        v-validate="`required|included:1,0`"
        :name="'question' + i"
        type="radio"
        :value="1"
        @click="sendAnswer($event, question.id)"
      />
      <label :for="'yes' + i" class="choice_btn">oui</label>
      <input
        :id="'no' + i"
        :name="'question' + i"
        type="radio"
        :value="0"
        @click="sendAnswer($event, question.id)"
      />
      <label :for="'no' + i" class="choice_btn">non</label>
    </div>
    <button class="validate_btn" @click="nextStep">Je valide</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import customMsg from "@/components/Custom_msg.vue";
// import auth from "./../../utils/auth";

@Component({
  components: {
    customMsg
  }
})
class EligibilityTest extends Vue {
  answer: {
    questionId: number | null;
    userId: number | undefined;
    answer: number | null;
  } = {
    questionId: null,
    userId: undefined,
    answer: null
  };

  message: string | null = null;
  userSex: string | null = null;
  userId: number | undefined = undefined;

  // computed list of eligibility questions
  get eligibilityQuestions(): string[] {
    return this.$store.getters["eligibility/getQuestions"];
  }

  checkEligibility(): boolean {
    const radios = document.querySelectorAll('input[type="radio"]:checked');
    let isEligible: boolean = true;
    radios.forEach(
      (input: any): boolean | undefined => {
        if (Number(input.value) === 0) {
          return (isEligible = false);
        }
      }
    );
    return isEligible;
  }

  blockUser() {
    return this.$store.dispatch("blocked/blockUneligibleUser", this.userId);
  }

  setUserEligibility(isEligible: boolean) {
    return this.$store.dispatch("user/updateUser", {
      id: this.userId,
      body: {
        is_eligible: isEligible
      }
    });
  }

  setUserStatus(status: string) {
    return this.$store.dispatch("status/setStatus", {
      id: this.userId,
      status
    });
  }

  nextStep() {
    this.$validator.validateAll().then(res => {
      if (res) {
        const isEligible = this.checkEligibility();
        if (isEligible) {
          this.setUserEligibility(true).then(() => {
            this.setUserStatus("eligible").then(() => {
              this.$store.dispatch("notif/sendNewUserNotif").then(() => {
                return this.$parent.$emit("next");
              });
            });
          });
        } else {
          this.setUserEligibility(false).then(() => {
            this.blockUser().then(() => {
              this.setUserStatus("bloqué").then(() => {
                this.$router.push("/blockedUser");
              });
            });
          });
        }
      } else
        return (this.message = "Veuillez répondre à toutes les questions.");
    });
  }

  sendAnswer(evt: any, id: number): void {
    this.answer.questionId = id;
    this.answer.userId = this.userId;
    this.answer.answer = evt.target.value;
    this.$store
      .dispatch("eligibility/getOneEligibilityAnswer", this.answer)
      .then((res: any) => {
        if (res.length) {
          this.updateAnswer();
        } else {
          this.insertAnswer();
        }
      });
  }
  // insert user's answer in the database
  insertAnswer() {
    this.$store.dispatch("eligibility/insertAnswer", this.answer);
  }
  // updates the already answered question with the new answer
  updateAnswer() {
    this.$store.dispatch("eligibility/updateAnswer", this.answer);
  }

  created() {
    this.userSex = this.$store.getters["user/getLoggedUser"].sex;
    this.userId = this.$store.getters["user/getLoggedUser"].id;
    this.$store.dispatch(
      "eligibility/getAllEligibilityQuestions",
      this.userSex
    );
  }
}
export default EligibilityTest;
</script>

<style lang="scss">
@media screen and (min-width: $tablet) {
  .eligibility-test {
    height: 75vh;
    // ajustement du boutton validé
    & .validate_btn {
      bottom: 8%;
    }
    // Questions
    .eligibility_question {
      color: $kakiGold;
      font-family: $titleFont;
      font-weight: 700;
      font-size: 22px;
      letter-spacing: 1.8px;
      margin: 40px auto 5px;
    }
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .eligibility-test {
    min-width: 310px;
    width: 100%;
    // Questions
    .eligibility_question {
      color: $kakiGold;
      font-family: $titleFont;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 1.8px;
      margin: 40px auto 5px;
      text-align: center;
      text-justify: inter-character;
    }
    // Bouttons de choix oui-non
    & label.choice_btn {
      font-size: 14px;
    }
  }
}
</style>
