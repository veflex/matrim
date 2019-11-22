<template>
  <section class="custom-msg">
    <p :class="css">{{ msg }}</p>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component
class CustomMsg extends Vue {
  @Prop() msg: string | undefined;
  @Prop() css: string | undefined;
}

export default CustomMsg;
</script>

<style lang="scss" scoped>
.custom-msg {
  width: 100%;
}
</style>
