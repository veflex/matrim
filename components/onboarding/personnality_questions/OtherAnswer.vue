<template>
  <section class="other">
    <label for="other">{{other}}</label>
    <input id="other" v-model="otherAnswer" type="text" @change="sendOtherAnswer">
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
@Component
class Question extends Vue {
  @Prop() other;
  @Prop() reset;
  otherAnswer: string = "";
  @Watch("reset")
  onReset(value: boolean) {
    if (value) {
      this.otherAnswer = "";
    }
  }
  sendOtherAnswer() {
    this.$emit("otherInput", this.otherAnswer);
  }
}

export default Question;
</script>

<style lang="scss" scoped>
.other {
  color: white;
  font-family: "Quicksand";
}
</style>
