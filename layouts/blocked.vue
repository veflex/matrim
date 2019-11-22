<template>
  <div id="app">
    <nuxt class="views" />
  </div>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
class blockedLayout extends Vue {}
export default blockedLayout;
</script>


<style lang="scss" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $darkBlack;
  height: 100vh;
  min-width: 320px;
  .views {
    scroll-behavior: smooth;
    padding-top: 30px;
    & > * {
      max-width: $screen_max_width;
      margin: auto;
      // border: 1px solid red;
    }
  }
}
</style>


