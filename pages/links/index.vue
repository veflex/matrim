<template>
  <div class="links">
    <h1>Informations pratiques</h1>
    <PartialPlanDuSite/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PartialPlanDuSite from "@/components/partial/plan_du_site.vue"
@Component({
  name: "Links",
  components: {
    PartialPlanDuSite
  }
})
class Links extends Vue {
  created() {}
}
export default Links;
</script>

<style lang="scss">
.links {
  padding: 100px 0px;
  & h1 {
    font-family: $titleFont;
    font-weight: 700;
    font-size: 46px;
    color: $kakiGold;
    margin: 15px auto 30px !important;
  }
  & h3, & article.foot-categorie a, & article.foot-categorie p{
    color: $darkBlack;
  }
}
</style>

