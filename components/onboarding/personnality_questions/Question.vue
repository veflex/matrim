<template>
  <section class="question">
    <h1 class="title">
      {{question}}
      <!-- <span v-if="max > 1">({{max}} réponses max)</span> -->
    </h1>
    <h2 class="subtext">Bonjour je suis subtext</h2>
    <div class="line"></div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component
class Question extends Vue {
  @Prop() question;
  @Prop() subtext;
  @Prop() max;
  @Prop() id;
  created() {
    this.$emit("questionId", this.id);
  }
}

export default Question;
</script>

<style lang="scss" scoped>
.question {
  font-family: "Quicksand";
  .title {
    width: 80%;
    font-size: 40px;
    color: white;
    margin: auto;
    margin-bottom: 1%;
  }
  .line {
    width: 60%;
    height: 2px;
    background: $kakiGold;
    margin: auto;
  }
  .subtext {
    width: 70%;
    margin: auto;
    color: white;
    font-size: 20px;
    font-style: italic;
    margin-bottom: 1%;
  }
}
</style>
