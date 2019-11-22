<template>
  <section class="custom-msg">
    <p>{{ msg }}</p>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
class CustomMsg extends Vue {
  @Prop() msg: string | undefined;
  @Prop() css: string | undefined;
}

export default CustomMsg;
</script>
