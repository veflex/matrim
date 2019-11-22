<template>
  <section v-if="user" class="profil">
    <h2>INDEX</h2>
    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequuntur quidem deserunt doloribus, ipsa, suscipit consequatur modi, accusantium nisi corporis fugit sed expedita doloremque optio unde. Repellendus natus debitis dolorem officiis.</p>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "profil1",
  middleware: "getOneUser"
})
class Profil1 extends Vue {
  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }

  created() {}
}
export default Profil1;
</script>

<style lang="scss">
</style>
