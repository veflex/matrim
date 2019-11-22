<template>
  <section class="answer-list">
    <h2 v-if="max > 1" class="answers-left">Choix multiple: {{maxAnswers}} restant</h2>
    <h2 v-else-if="type === 'radio'" class="answers-left">Choix unique</h2>
    <div class="all-answers">
      <div v-for="(answer, i) in answers" :key="answer.id" class="answer">
        <input
          :id="answer"
          :ref="'input'+i"
          v-model="userAnswer"
          :value="answer"
          :type="type"
          @click="toggleHidden($event.target)"
          @change="checkAnswer($event.target)"
        />
        <label
          class="answeer"
          :tabindex="i+1"
          :for="answer"
          @keypress="clickOnInput($refs['input'+i])"
        >{{answer}}</label>
      </div>
      <label v-if="position === 9" ref="where" for="where" class="where hidden">
        Où?
        <input
          v-model="where"
          placeholder="Indiquez le ou les pays"
          type="text"
          name="where"
          @change="checkAnswer($event.target)"
        />
      </label>
    </div>

    <!-- autre -->
    <!-- <div v-if="other" class="other">
      <OtherAnswer :other="other" :reset="reset" @otherInput="checkOtherAnswer"/>
    </div>-->
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import OtherAnswer from "@/components/onboarding/personnality_questions/OtherAnswer.vue";
@Component({
  name: "AnswerList",
  components: {
    OtherAnswer
  }
})
class AnswerList extends Vue {
  @Prop() answers;
  @Prop() isMultiple;
  @Prop() type;
  @Prop() other;
  @Prop() position;
  @Prop() max;
  @Prop() sendAnswer;
  userAnswer: any = null;
  where: string = "";
  // otherAnswer: string = "";
  maxAnswers: number = this.max;
  reset: boolean = false;
  clickOnInput(alo) {
    alo[0].click();
  }
  created() {
    if (this.isMultiple) {
      this.userAnswer = [];
    }
  }
  @Watch("maxAnswers")
  checkMaxAnswers(value: number) {
    let isDisabled = false;
    const checkboxes = document.querySelectorAll(
      "input[type='checkbox']:not(:checked)"
    );
    // const other = document.querySelector("input[type='text']");
    if (value === 0) {
      isDisabled = true;
    }
    // if (other && !this.otherAnswer.length) {
    //   (other as HTMLInputElement).disabled = isDisabled;
    // }
    checkboxes.forEach(checkbox => {
      (checkbox as HTMLInputElement).disabled = isDisabled;
    });
  }

  checkAnswer(evt: any) {
    if (!this.isMultiple) {
      this.reset = true;
    } else if (evt.checked === true) {
      this.maxAnswers--;
    } else {
      this.maxAnswers++;
    }
    this.storeAnswer();
  }

  formatAnswer() {
    let userAnswer = this.userAnswer.slice();
    if (this.isMultiple) {
      // if (this.otherAnswer.length) {
      //   userAnswer.push(this.otherAnswer);
      // }
      userAnswer = userAnswer.join(";");
    }
    // else {
    //   userAnswer += this.otherAnswer;
    // }
    return userAnswer;
  }

  toggleHidden(target: any) {
    if (this.position === 9) {
      if (target.value === "Oui") {
        (this.$refs.where as any).classList.remove("hidden");
      } else {
        (this.$refs.where as any).classList.add("hidden");
        this.where = "";
      }
    }
  }
  storeAnswer() {
    let finalAnswer = this.formatAnswer();
    if (this.position === 9 && this.where) {
      finalAnswer = this.where;
    }
    this.$emit("answer", finalAnswer);
  }
}
export default AnswerList;
</script>

<style lang="scss">
.answer-list {
  font-family: "Quicksand";
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 480px;
  height: 400px;
  .hidden {
    display: none;
  }
  .where {
    color: white;
  }
  .all-answers {
    width: 100%;
    height: 80%;
    padding-top: 5px;
    overflow: auto;
    margin-bottom: 1%;
    // box-shadow: inset 0 -30px 6px -4px rgba(0, 0, 0, 0.25);
    .answer {
      margin-bottom: 15px;
      .answeer {
        background: none;
        color: #fff;
        font-family: $btnFont;
        font-weight: 700;
        font-size: 16px;
        line-height: 23px;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        outline: none;
        border: none;
        border-radius: 5px;
        margin: 5px;
        padding: 5px 10px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        -ms-border-radius: 5px;
        -o-border-radius: 5px;
        transition: 0.5s;
        -webkit-transition: 0.5s;
        -moz-transition: 0.5s;
        -ms-transition: 0.5s;
        -o-transition: 0.5s;
        &:hover,
        &:focus {
          background: white;
          color: black;
          box-shadow: 4px 4px 12px rgba($darkBlack, 0.4);
        }
      }
    }
  }
  .answers-left {
    color: white;
    width: 100%;
    text-align: right;
    margin-bottom: 3%;
  }
  h2 {
    width: 100%;
  }
  input[type="checkbox"],
  input[type="radio"] {
    display: none;
  }
  input:checked + label {
    background: $sweetPink !important;
    color: white !important;
  }
}
@media screen and (max-width: $tablet - 1px) {
  .answer-list {
    width: 100%;
    .answers-left {
      width: 80%;
    }
  }
}
</style>
