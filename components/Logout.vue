<template>
  <div class="logout">
    <h2 @click="logout">Logout</h2>
  </div>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "Logout"
})
class Logout extends Vue {
  logout() {
    console.log("logout");
    this.$store.dispatch("user/logout");
  }
}
export default Logout;
</script>

<style>
</style>
