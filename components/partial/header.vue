<template>
    <section class="nav">
      <PartialNavbar/>
    </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PartialNavbar from "./navbar.vue"
@Component({
  components:{
    PartialNavbar
  }
})
class partialHeader extends Vue {}
export default partialHeader;
</script>


<style lang="scss">
.nav {
  z-index: 10;
  height: $navbar_height_desktop;
  position: fixed;
  width: 100%;
  background: $darkBlack;
}
</style>


