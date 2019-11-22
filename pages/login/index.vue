<template>
  <section class="loginView">
    <h1>Se connecter</h1>
    <Login />
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Login from "@/components/Login.vue";
@Component({
  name: "LoginView",
  components: {
    Login
  },
  middleware: "isAlreadyLogged"
})
class LoginView extends Vue {}
export default LoginView;
</script>

<style lang="scss">
@media screen and (min-width: $tablet) {
  .loginView {
    height: 100vh;
    min-height: 600px;
    // Background image
    &::after {
      content: "";
      position: fixed;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      z-index: -2;
      background-image: url("~@/assets/BG/Login_Base.jpg");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    // Fond noir opaque
    &::before {
      content: "";
      position: fixed;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      z-index: -1;
      // background: rgba($darkBlack, 0.6);
      background: radial-gradient(
        ellipse at top,
        rgba($darkBlack, 0.6) 50%,
        transparent
      );
    }
    // Titre se connecter
    & h1 {
      color: #fff;
      font-family: $titleFont;
      font-weight: 700;
      font-size: 46px;
      letter-spacing: 1.8px;
      text-transform: uppercase;
      margin: 20px auto;
      // text-shadow: 0 2px 6px rgba(0,0,0, 0.3);
    }
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .loginView {
    padding: 0 40px;
    // Background image
    &::after {
      content: "";
      position: fixed;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      z-index: -2;
      background-image: url("~@/assets/BG/Login_Base.jpg");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    // Background black filter
    &::before {
      content: "";
      position: fixed;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      z-index: -1;
      // background: rgba($darkBlack, 0.2);
      background: radial-gradient(
          ellipse at top,
          rgba($darkBlack, 0.6) 50%,
          transparent
        ),
        rgba(rgb(255, 255, 255), 0.25);
    }
  }
  // Titte se connecter
  & h1 {
    color: #fff;
    font-family: $titleFont;
    font-weight: 700;
    font-size: 26px;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    margin: 20px auto;
  }
}
</style>
