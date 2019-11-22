<template>
  <section class="blocked">
    <article class="blocked_message">
      <p v-if="user" class="username">{{ user.name }},</p>
      <p>
        Compte tenu des informations que vous nous avez communiqu&eacute;es,
        nous ne sommes pas en mesure de valider votre profil.
      </p>
      <button class="pink_btn" @click="$router.push('/blockedInfos')">En savoir plus</button>
    </article>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({
  name: "blockedUser",
  layout: "blocked"
})
class BlockedUser extends Vue {
  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }
}
export default BlockedUser;
</script>

<style lang="scss">
@media screen and (min-width: $tablet) {
  .blocked {
    width: 100%;
    height: calc(100% - 55px);
    display: flex;
    justify-content: center;
    align-items: center;
    // Background image
    &::after {
      content: "";
      position: fixed;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      z-index: -2;
      background-image: url("~@/assets/BG/OnBoarding_BG.gif");
      background-size: cover;
      background-attachment: fixed;
    }
    // Article avec le contenu texte et image
    .blocked_message {
      background: rgba($darkBlack, 0.4);
      color: #fff;
      padding: 20px;
      text-align: center;
      width: 90%;
      max-width: 1080px;
      margin: 50px auto;
      font-family: $paragraphFont_G;
      font-size: 20px;
      line-height: 31px;
      font-weight: 400;
      letter-spacing: 1px;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.33);
      border-radius: 2px;

      // Image 'Stop'
      figure {
        width: 200px;
        height: 200px;
        display: block;
        overflow: hidden;
        border-radius: 100px;
        position: relative;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.33);
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-height: 100%;
        }
      }
      // Espacement vertical entre tous les blocs
      & > * {
        margin: 5px auto;
      }
      & button {
        margin: 30px auto 20px;
      }
    }
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .blocked {
    // Background image
    &::after {
      content: "";
      position: fixed;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
      z-index: -2;
      background-image: url("~@/assets/BG/OnBoarding_BG_phone.gif");
      background-size: cover;
      background-attachment: fixed;
    }
    // Article avec le contenu texte et image
    .blocked_message {
      background: rgba($darkBlack, 0.4);
      color: #fff;
      padding: 20px;
      text-align: center;
      width: 90%;
      max-width: 1080px;
      margin: 50px auto;
      font-family: $paragraphFont_G;
      font-size: 16px;
      line-height: 28px;
      font-weight: 400;
      letter-spacing: 1px;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.33);
      border-radius: 2px;

      // Image 'Stop'
      figure {
        width: 200px;
        height: 200px;
        display: block;
        overflow: hidden;
        border-radius: 100px;
        position: relative;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.33);
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-height: 100%;
        }
      }
      // Espacement vertical entre tous les blocs
      & > * {
        margin: 5px auto;
      }
      & button {
        margin: 20px auto;
      }
    }
  }
}
</style>
