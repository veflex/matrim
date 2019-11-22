<template>
  <section class="FastConnexion">
    <h1>REDIRECTIIIIIIIION</h1>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Cookie from "js-cookie";

@Component({
  name: "fastConnexion",
  middleware: "fastConnexion"
})
class FastConnexion extends Vue {
  created() {
    const token = this.$route.params.token;
    if (token) {
      Cookie.set("jwt", token);
      this.$router.replace({
        name: "onboarding",
        params: {
          token
        }
      });
    }
  }
}
export default FastConnexion;
</script>

<style lang="scss">
</style>
