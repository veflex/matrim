<template>
  <section class="change-browser">
    <h1>Attention</h1>
    <p>Notre plateforme ne prend pas en charge Internet Explorer. Nous vous conseillons de continuer sur votre mobile ou sur les navigateurs suivants : google Chrome, Mozilla.</p>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({
  name: "change-browser"
})
class ChangeBrowser extends Vue {}
export default ChangeBrowser;
</script>

<style lang="scss">
.change-browser {
  h1 {
    color: $sweetPink;
    font-family: $paragraphFont_Q;
    font-weight: 700;
    font-size: 46px;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    margin: 20px auto;
    text-align: center;
    display: block;
  }
  p {
    font-size: 16px;
    line-height: 26px;
    letter-spacing: 1px;
    text-align: left;
  }
}
</style>
