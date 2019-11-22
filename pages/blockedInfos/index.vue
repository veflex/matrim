<template>
  <section class="blockedInfos">
    <div class="container">
      <h1>Vous avez &eacute;t&eacute; bloqu&eacute;</h1>
      <p>
        Pour toute explication suppl&eacute;mentaire, nous sommes &agrave; votre
        disposition sur
        <a
          class="link"
          href="mailto:contact@matrimonline.fr"
        >contact@matrimonline.fr</a>
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({
  name: "BlockedInfos",
  layout: "blocked"
})
class BlockedInfos extends Vue {}
export default BlockedInfos;
</script>


<style lang="scss">
.blockedInfos {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: lightgrey;
}
</style>

