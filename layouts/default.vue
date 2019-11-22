<template>
  <div id="app">
    <PartialHeader
      v-if="!$route.path.includes('/onboarding') && !$route.path.includes('/personnality')"
    />
    <!-- <div class="nav">
      <nuxt-link to="/">Home</nuxt-link>|
      <nuxt-link :to="{
          name: 'onboarding'
        }">Register</nuxt-link>|
      <nuxt-link to="/login">Login</nuxt-link>|
      <nuxt-link to="/blockedUser">blocked</nuxt-link>|
      <nuxt-link to="/userSearch">search</nuxt-link>|
      <nuxt-link to="/personnality">personnality</nuxt-link>
    </div>-->
    <ChatGlobal v-if="isChatOpen" />
    <nuxt class="views" :class="isChatOpen ? 'blur': ''" />
    <PartialFooter
      v-if="!$route.path.includes('/onboarding') && !$route.path.includes('/personnality')"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PartialHeader from "../components/partial/header";
import PartialFooter from "../components/partial/footer";
import ChatGlobal from "@/components/chat/Global";
@Component({
  components: {
    PartialHeader,
    PartialFooter,
    ChatGlobal
  },
  middleware: ["initWithToken", "isBlocked", "isOnboardingDone"]
})
class defaultLayout extends Vue {
  get isChatOpen() {
    return this.$store.getters["chat/isChatOpen"];
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
  width: 100%;
  min-width: 320px;
  .views {
    padding-top: $navbar_height_desktop;
    & > * {
      max-width: $screen_max_width;
      margin: auto;
      // border: 1px solid red;
    }
  }
}

.no-scroll {
  overflow-x: hidden;
}
</style>


