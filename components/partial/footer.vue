<template>
  <footer class="foot">
    <article class="foot-content">
      <figure class="foot-logo">
        <img src="@/assets/logo/logo-footer.png" alt="logo matrimonline">
      </figure>
      <PlanDuSite class="plan-du-site"/>
      <article class="foot-mobile">
        <h3>Suivez-nous</h3>
        <SocialNetwork/>
      </article>
    </article>
  </footer>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PlanDuSite from "./plan_du_site.vue"
import SocialNetwork from "./social_network.vue"
@Component({
  components:{
    PlanDuSite,
    SocialNetwork
  }
})
class partialFooter extends Vue {
  isMobile() {
    if(/Android|webOS|iPhone||iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
     return true
    } else {
      return false
    }
   }
}
export default partialFooter;
</script>

<style lang="scss">
.foot {
  z-index: 10;
  height: auto;
  width: 100%;
  background: $darkBlack;
  .foot-content {
    width: 100%;
    max-width: $screen_max_width;
    margin: auto;
  }
  .foot-logo {
    float: left;
    height: auto;
    width: 20%;
    margin-top: 15px;
  }
  .foot-mobile {
    display: none;
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .foot{
    height: 110px;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
    .plan-du-site {
      display: none;
    }
    .foot-logo {
      float: left;
      margin-left: 15px;
      width: 20%;
      img{
        height: 80px;
      }
    }
    .foot-mobile {
      display: block;
      float: right;
      margin-top: 12px;
      margin-right: 15px;
    & h3{
    color: #fff;
    text-transform: uppercase;
    font-family: $titleFont;
    font-weight: 700;
    letter-spacing: 1.2px;
    font-size: 18px;
    text-align: left;
    margin-bottom: 5px;
    }
  }
  }
}
</style>
