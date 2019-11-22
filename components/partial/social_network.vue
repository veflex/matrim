<template>
  <article class="social">
    <a href="https://www.linkedin.com/company/matrimonline/">
      <img src="@/assets/icons/linkedin.png" alt="linkedin">
    </a>
    <a href="https://www.facebook.com/MatriMonline/">
      <img src="@/assets/icons/facebook.png" alt="facebook">
    </a>
    <a href="https://twitter.com/MatriMonline">
      <img src="@/assets/icons/twitter.png" alt="twitter">
    </a>
    <a href="https://www.youtube.com/channel/UCN8ujD-V6Eev_bOL8HdLvAA?view_as=subscriber">
      <img src="@/assets/icons/youtube.png" alt="youtube">
    </a>
  </article>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component
class partialSocialNetwork extends Vue {}
export default partialSocialNetwork;
</script>

<style lang="scss">
.social {
  display: flex;
  flex-direction: row;
  & img {
    height: 30px;
    margin-right: 5px;
  }
}
</style>

