<template>
  <section v-if="user" class="personnality">
    <no-ssr>
      <div class="barre">
        <p
          class="current-question"
          :style="`left:calc(${progressWidth}% - 30px)`"
        >{{index}}/{{questions.length}}</p>
        <span class="container" :style="`width:${progressWidth}%`">
          <span class="progress"></span>
        </span>
      </div>
      <div v-for="question in questions" :key="question.id" class="questions">
        <section v-if="index === question.position" class="question">
          <Question
            :id="question.id"
            :question="question.text"
            :subtext="question.subtext"
            :max="question.nb_choice"
            @questionId="setQuestionId"
          />
          <CustomMsg v-if="msg && question.type !== 'textarea'" :msg="msg" :css="'error'" />
          <span class="error">{{ errors.first('textarea') }}</span>

          <AnswersList
            v-if="question.type === 'radio' || question.type ==='checkbox'"
            :answers="question.possible_answer.split(';')"
            :is-multiple="question.isMultiple"
            :type="question.type"
            :other="question.other_answer"
            :max="question.nb_choice"
            :position="question.position"
            @answer="setAnswer"
          />
          <!-- text answer  -->
          <div v-else-if="question.type === 'text'" class="answer-container">
            <input
              id="text-answer"
              v-model="answer"
              class="text-answer"
              placeholder="Ecrivez votre réponse ici"
              type="text"
              name="text-answer"
            />
          </div>
          <!-- range answer -->
          <div v-else-if="question.type === 'range'" class="answer-container">
            <label
              v-if="answer === ''"
              for="range-answer"
            >Déplacez le curseur pour choisir votre réponse</label>
            <label v-else-if="answer === question.possible_answer.split(';')[0]" for="range-answer">
              {{answer}}
              <span v-if="question.position === 15">cm ou moins</span>
              <span v-if="question.position === 17">kg ou moins</span>
            </label>
            <label v-else-if="answer===question.possible_answer.split(';')[1]" for="range-answer">
              {{answer}}
              <span v-if="question.position === 15">cm ou plus</span>
              <span v-if="question.position === 17">kg ou plus</span>
            </label>
            <label v-else for="range-answer">
              {{answer}}
              <span v-if="question.position === 15">cm</span>
              <span v-if="question.position === 17">kg</span>
            </label>
            <input
              id="range-answer"
              v-model="answer"
              class="range-answer"
              type="range"
              name="range-answer"
              step="1"
              :min="question.possible_answer.split(';')[0]"
              :max="question.possible_answer.split(';')[1]"
              @input="resetErrorMsg"
            />
          </div>

          <div
            v-else-if="question.type === 'textarea' && user.sex === 'M' && index === 38"
            class="answer-container"
          >
            <span class="max-length">Il vous reste {{1000 - answer.length}} caractères</span>
            <textarea
              v-model="answer"
              v-validate="'required|max:1000'"
              name="textarea"
              maxlength="1000"
              placeholder="Ecrivez ce qui vous plait ! Soyez sincère, original, drôle, touchant, mystérieux.... Surtout soyez vous-même !
Vous pouvez décrire ce qui fait particulièrement votre charme ou votre personnalité. Si vous ne savez pas comment vous décrire, pensez à ce que vos amis, vos proches disent de vous.... D'une manière générale, soyez positif, attentif au présent et tourné vers l'avenir.

Pour vous éviter le syndrome de la page blanche, on vous donne un petit coup de main. 
Les attributs qui font mon charme et mon style : 
Ma façon d’être et mon caractère :
Mes goûts : 
Ma vision de l’avenir et de la vie à 2 : 
N’hésitez pas à mettre régulièrement votre description à jour"
              class="textarea-answer"
              @input="resetErrorMsg"
            ></textarea>
          </div>
          <div
            v-else-if="question.type === 'textarea' && user.sex === 'F' && index === 38"
            class="answer-container"
          >
            <span class="max-length">Il vous reste {{1000 - answer.length}} caractères</span>
            <textarea
              v-model="answer"
              v-validate="'required|max:1000'"
              name="textarea"
              maxlength="1000"
              placeholder="Ecrivez ce qui vous plait ! Soyez sincère, originale, drôle, touchante, mystérieuse.... Surtout soyez vous-même !
Vous pouvez décrire ce qui fait particulièrement votre charme ou votre personnalité. Si vous ne savez pas comment vous décrire, pensez à ce que vos amis, vos proches disent de vous.... D'une manière générale, soyez positive, attentive au présent et tournée vers l'avenir.

Pour vous éviter le syndrome de la page blanche, on vous donne un petit coup de main. 
Les attributs qui font mon charme et mon style : 
Ma façon d’être et mon caractère :
Mes goûts : 
Ma vision de l’avenir et de la vie à 2 : 
N’hésitez pas à mettre régulièrement votre description à jour"
              class="textarea-answer"
              @input="resetErrorMsg"
            ></textarea>
          </div>
          <div
            v-else-if="question.type === 'textarea' && user.sex === 'M' && index === 39"
            class="answer-container"
          >
            <span class="max-length">Il vous reste {{1000 - answer.length}} caractères</span>
            <textarea
              v-model="answer"
              v-validate="'required|max:1000'"
              name="textarea"
              maxlength="1000"
              placeholder="Pour vous éviter le syndrome de la page blanche, on vous donne un petit coup de main. 
Je recherche une femme  
Tranche d’âge :
Avec ces attributs physiques qui me font craquer :
Avec ces qualités et traits de caractère incontournables :
Avec ces valeurs que je veux partager :  
Avec ce petit grain de folie auquel je ne peux pas résister :
N’hésitez pas à remettre à jour régulièrement votre profil idéal"
              class="textarea-answer"
              @input="resetErrorMsg"
            ></textarea>
          </div>
          <div
            v-else-if="question.type === 'textarea' && user.sex === 'F' && index === 39"
            class="answer-container"
          >
            <span class="max-length">Il vous reste {{1000 - answer.length}} caractères</span>
            <textarea
              v-model="answer"
              v-validate="'required|max:1000'"
              name="textarea"
              maxlength="1000"
              placeholder="Pour vous éviter le syndrome de la page blanche, on vous donne un petit coup de main. 
Je recherche un homme   
Tranche d’âge :
Avec ces attributs physiques qui me font craquer :
Avec ces qualités et traits de caractère incontournables :
Avec ces valeurs que je veux partager :  
Avec ce petit grain de folie auquel je ne peux pas résister :
N’hésitez pas à remettre à jour régulièrement votre profil idéal
"
              class="textarea-answer"
              @input="resetErrorMsg"
            ></textarea>
          </div>
        </section>
      </div>
      <div class="choices" :class="index === 1 ? 'left-simple' : 'left-double' ">
        <div v-if="index>1" class="choice" @click="previous">
          <i class="fas fa-angle-double-left icon" tabindex="49"></i>
          <p>Précédent</p>
        </div>
        <div v-if="index<questions.length" class="choice" @click="sendAnswer">
          <i
            ref="validate"
            class="fas fa-angle-double-right icon"
            tabindex="50"
            @keypress="$event.target.click()"
          ></i>
          <p>Suivant</p>
        </div>
        <div v-else class="choice" @click="sendAnswer">
          <i
            ref="validate"
            class="fas fa-angle-double-right icon"
            tabindex="50"
            @keypress="$event.target.click()"
          ></i>
          <p>Etape suivante</p>
        </div>
      </div>
    </no-ssr>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Question from "@/components/onboarding/personnality_questions/Question.vue";
import AnswersList from "@/components/onboarding/personnality_questions/AnswersList.vue";
import CustomMsg from "@/components/Custom_msg.vue";
@Component({
  name: "Test",
  layout: "onboarding",
  middleware: ["getPersonnalityQuestions", "checkPersonnalityStep"],
  components: {
    Question,
    CustomMsg,
    AnswersList
  }
})
class Personnality extends Vue {
  index: number = 1;
  get progressWidth() {
    return (this.index * 100) / this.questions.length;
  }
  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }
  msg: string = "";
  answer: string = "";
  id_user: number = this.$store.getters["user/getLoggedUser"].id;
  id_question: number | null = null;
  created() {
    const user = this.$store.getters["user/getLoggedUser"];
    this.index = Number(user.personnality_step);
  }
  get questions() {
    return this.$store.getters["personnality/getQuestions"];
  }
  setQuestionId(questionId) {
    this.id_question = questionId;
  }

  resetErrorMsg() {
    this.msg = "";
  }

  previous() {
    this.resetErrorMsg();
    this.answer = "";
    this.index--;
  }

  setAnswer(answer: string) {
    this.resetErrorMsg();
    this.answer = answer;
  }
  async checkAnswerExistence(payload) {
    const isAnswered = await this.$store.dispatch(
      "personnality/getOneAnswer",
      payload
    );
    if (isAnswered.length) {
      return true;
    }
    return false;
  }

  sendAnswer() {
    this.msg = "";
    const answer = this.answer;
    this.$validator.validateAll().then(res => {
      if (!answer || !answer.length) {
        return (this.msg = "Veuillez renseigner une réponse");
      }
      const id_user = this.id_user;
      const id_question = this.id_question;
      if (id_question === 44 && answer === "Oui") {
        return (this.msg = "Veuillez indiquer le ou les pays");
      }
      console.log(res, answer, id_user);
      let url = "";
      this.checkAnswerExistence({ id_user, id_question }).then(isAnswered => {
        if (isAnswered) {
          url = "personnality/updateAnswer";
        } else {
          url = "personnality/insertAnswer";
        }
        this.$store
          .dispatch(url, {
            id_user,
            answer,
            id_question
          })
          .then(() => {
            this.$store
              .dispatch("user/updateUser", {
                id: this.id_user,
                body: {
                  personnality_step:
                    this.index === this.questions.length
                      ? "done"
                      : this.index + 1
                }
              })
              .then(() => {
                if (this.index === this.questions.length) {
                  this.$router.push(`/profil/${id_user}`);
                } else {
                  this.answer = "";
                  this.index++;
                }
              });
          });
      });
    });
  }
}
export default Personnality;
</script>

<style lang="scss">
.personnality {
  .max-length {
    color: white;
    width: 75%;
    margin: auto;
    margin-top: 1%;
    text-align: right;
  }
  input[placeholder] {
    text-overflow: ellipsis;
  }
  .textarea-answer::-moz-placeholder {
    text-overflow: ellipsis;
  }
  input:-moz-placeholder {
    text-overflow: ellipsis;
  }
  font-family: "Quicksand";
  height: 100vh;
  width: 100%;
  background-image: url("~@/assets/BG/OnBoarding_BG.gif");
  background-size: cover;
  background-attachment: fixed;
  .barre {
    position: relative;
    width: 60%;
    margin: auto;
    margin-top: 2%;
    height: 5px;
    border-radius: 5px;
    background: #000;
    .current-question {
      position: absolute;
      top: -15px;
      font-size: 13px;
      width: 60px;
      color: #f50078;
    }
    .container {
      border-radius: 5px;
      height: 5px;
      background-color: $sweetPink;
      display: block;
      .progress {
        border-radius: 5px;
        display: block;
        height: 5px;
        width: 100%;
      }
    }
  }
  .question {
    width: 800px;
    margin: auto;
    margin-top: 2%;
  }
  .answer-container {
    width: 80%;
    height: 350px;
    margin: auto;
    display: flex;
    flex-direction: column;
    label {
      margin-top: 20%;
      margin-bottom: 4%;
      color: white;
    }
    .text-answer,
    .textarea-answer {
      margin-top: 20%;
      width: 60%;
      margin-left: auto;
      margin-right: auto;
      border-radius: 5px;
      padding: 5px;
      color: black;
    }
    .textarea-answer {
      margin-top: 10%;
      width: 95%;
      resize: none;
      overflow: auto;
      height: 80%;
    }
    .range-answer {
      width: 70%;
      margin-left: auto;
      margin-right: auto;
    }
  }
  input[type="range"] {
    -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
    width: 100%; /* Specific width is required for Firefox. */
    background: transparent; /* Otherwise white in Chrome */
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  input[type="range"]:focus {
    outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
  }

  input[type="range"]::-ms-track {
    width: 100%;
    cursor: pointer;

    /* Hides the slider so custom styles can be added */
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  /* Special styling for WebKit/Blink */
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 1px solid #000000;
    height: 28px;
    width: 10px;
    border-radius: 3px;
    background: $sweetPink;
    cursor: pointer;
    margin-top: -11.2px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
  }

  /* All the same stuff for Firefox */
  input[type="range"]::-moz-range-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 28px;
    width: 10px;
    border-radius: 3px;
    background: $sweetPink;
    cursor: pointer;
  }

  /* All the same stuff for IE */
  input[type="range"]::-ms-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 28px;
    width: 10px;
    border-radius: 3px;
    background: $sweetPink;
    cursor: pointer;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: white;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }

  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: white;
  }

  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: white;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }

  input[type="range"]::-ms-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }
  input[type="range"]::-ms-fill-lower {
    background: #2a6495;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
  input[type="range"]:focus::-ms-fill-lower {
    background: #3071a9;
  }
  input[type="range"]::-ms-fill-upper {
    background: #3071a9;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: white;
  }
  .choices {
    width: 400px;
    margin: auto;
    position: absolute;
    bottom: 50px;
    display: flex;
    justify-content: space-between;
    .choice {
      color: white;
      cursor: pointer;
      .icon {
        font-size: 50px;
      }
      &:hover {
        color: $sweetPink;
      }
    }
  }

  @media screen and (max-width: $tablet - 1px) {
    .personnality {
      height: auto;
    }
    .question {
      width: 100%;
      height: auto;
    }

    .range-answer-container,
    .text-answer-container {
      width: 100%;
    }
    .choices {
      width: 70%;
    }
    .left-simple {
      left: calc(50% - 25px);
    }
    .left-double {
      left: 15%;
    }
  }
}
.left-simple {
  left: calc(50% - 25px);
}
.left-double {
  left: calc(50% - 200px);
}
</style>

