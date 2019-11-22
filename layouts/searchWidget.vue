<template>
  <div id="app" :class="isChatOpen ? 'no-scroll' : ''">
    <PartialHeader
      v-if="!$route.path.includes('/onboarding') && !$route.path.includes('/personnality')"
    />
    <SearchWidget :class="isChatOpen ? 'none' : ''"></SearchWidget>
    <ChatGlobal v-if="isChatOpen" />
    <nuxt class="views" :style="`padding-top: calc(91px + ${sw_height}px)`" />
    <PartialFooter
      v-if="!$route.path.includes('/onboarding') && !$route.path.includes('/personnality')"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PartialHeader from "../components/partial/header.vue";
import PartialFooter from "../components/partial/footer.vue";
import SearchWidget from "../components/partial/search.vue";

import ChatGlobal from "@/components/chat/Global.vue";
@Component({
  components: {
    PartialHeader,
    PartialFooter,
    SearchWidget,
    ChatGlobal
  }
})
class defaultLayout extends Vue {
  sw_height: number = 50;
  get isChatOpen() {
    return this.$store.getters["chat/isChatOpen"];
  }
  created() {
    this.$root.$on("sw_height", this.update_sw_height);
  }
  update_sw_height(res) {
    this.sw_height = res;
  }
}
export default defaultLayout;
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
    // padding-top: $navbar_height_desktop + $searchWidget_height_desktop;
    & > * {
      max-width: $screen_max_width;
      margin: auto;
      // border: 1px solid red;
    }
  }
}
.no-scroll {
  overflow: hidden;
}
.none {
  display: none;
}
</style>


