<template>
  <div class="home">
    <h1>This is Home Page</h1>
    <h2 style="font-size: 50px;">Redirection Wordpress!</h2>
    <Logout/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Logout from "@/components/Logout.vue";
@Component({
  name: "Home",
  layout: "default",
  components: {
    Logout
  }
})
class Home extends Vue {}
export default Home;
</script>

<style lang="scss">
.home {
  min-height: calc(100vh - #{$footer_height_mobile + $navbar_height_desktop});
}
</style>

