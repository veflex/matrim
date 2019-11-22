<template>
  <section class="group-answer">
    <h2 class="category">{{category.toUpperCase()}}</h2>
    <section v-if="!column" class="group-answers">
      <section v-for="answer in answers" :key="answer.id" class="user-answers">
        <p class="question">{{answer.answer_form}}</p>
        <p v-if="answer.isMultiple" class="user-answer">{{answer.answer.split(';').join(', ')}}</p>
        <p v-else class="user-answer">{{answer.answer}}</p>
      </section>
    </section>
    <section v-else class="group-answers group-column">
      <section class="group-left">
        <div v-for="answer in firstHalf" :key="answer.id" class="user-answers">
          <p class="question">{{answer.answer_form}}</p>
          <p v-if="answer.isMultiple" class="user-answer">{{answer.answer.split(';').join(', ')}}</p>
          <p v-else-if="answer.id === 21" class="user-answer">{{answer.answer}} cm</p>
          <p v-else-if="answer.id === 23" class="user-answer">{{answer.answer}} kg</p>
          <p v-else class="user-answer">{{answer.answer}}</p>
        </div>
      </section>
      <section class="group-right">
        <div v-for="answer in lastHalf" :key="answer.id" class="user-answers">
          <p class="question">{{answer.answer_form}}</p>
          <p v-if="answer.isMultiple" class="user-answer">{{answer.answer.split(';').join(', ')}}</p>
          <p v-else class="user-answer">{{answer.answer}}</p>
        </div>
      </section>
    </section>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component
class UserGroupAnswers extends Vue {
  @Prop() category: string | undefined;
  @Prop() answers: any;
  @Prop() column: boolean | undefined;

  get firstHalf() {
    return this.answers.slice(0, Math.round(this.answers.length / 2));
  }
  get lastHalf() {
    return this.answers.slice(
      Math.round(this.answers.length / 2),
      this.answers.length
    );
  }

  created() {
    // console.log("first", this.firstHalf);
    // console.log("last", this.lastHalf);
  }
}

export default UserGroupAnswers;
</script>

<style lang="scss">
.group-answer {
  font-family: $paragraphFont_Q;
  font-weight: 400;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  .category {
    width: 100%;
    font-weight: 700;
    background: $blueGround;
    color: white;
    padding: 5px;
  }
  .group-answers {
    background: white;
    height: auto;
    padding: 10px;
    .user-answers {
      .question {
        font-weight: 700;
      }
      .user-answer {
        margin-bottom: 20px;
        &::first-letter {
          text-transform: capitalize;
        }
      }
    }
  }
  .group-column {
    display: flex;
    justify-content: space-around;
    .group-left,
    .group-right {
      width: 50%;
    }
  }
}
@media screen and (min-width: $phone) and (max-width: 600px) {
  .group-answer {
    .category {
      font-size: 25px;
    }
    .group-answers {
      display: block;
      font-size: 20px;
      .group-left,
      .group-right {
        width: 100%;
      }
    }
  }
}
</style>
