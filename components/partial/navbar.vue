<template>
  <nav class="navbar" role="navigation" aria-label="navigation principale">
    <div class="nav-brand">
      <nuxt-link :to="user ? '/navigation' : '/'" class="brand">
        <img
          class="nav-img-desktop"
          src="@/assets/logo/matrimonline_CMJN_blanc.png"
          alt="matrimonline-logo"
        />
        <img class="nav-img-mobile" src="@/assets/logo/logo-footer.png" alt="matrimonline-logo" />
      </nuxt-link>
    </div>
    <div v-if="user" class="nav-menu-short">
      <div class="chat" @click="toggleChat">
        <i class="fas fa-envelope bounce-small"></i>
        <span class="nav-menu-subtitle">Messagerie</span>
      </div>
      <!-- <nuxt-link to="/">
      </nuxt-link>-->
      <nuxt-link to="/favoris">
        <i class="fas fa-heart bounce-small"></i>
        <span class="nav-menu-subtitle">Favoris</span>
      </nuxt-link>
      <!-- <nuxt-link to="/alerte">
        <i class="fas fa-bell bounce-small"></i>
        <span class="nav-menu-subtitle">Alerte</span>
      </nuxt-link>-->
      <button
        class="nav-menu-profil"
        role="button"
        tabindex="0"
        @keydown.enter="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
        @keydown.space="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
      >
        <figure>
          <img
            ref="profilPicture"
            :src="`/img/profils/${user.img}`"
            alt="menu"
            @error="defaultPicture"
          />
        </figure>
        <span class="nav-menu-subtitle">Menu</span>
        <ul v-if="user" ref="nav_menu_long" class="nav-menu-long">
          <li>
            <nuxt-link
              :to="`/profil/${user.id}`"
              class="nav-menu-item"
              @keydown.enter="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
              @keydown.space="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
            >Profil</nuxt-link>
          </li>
          <!-- <li>
            <nuxt-link
              to="/"
              class="nav-menu-item"
              @keydown.enter="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
              @keydown.space="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
            >Modifier mon compte</nuxt-link>
          </li> -->
          <!-- <li>
            <nuxt-link
              to="/"
              class="nav-menu-item"
              @keydown.enter="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
              @keydown.space="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
            >Param&egrave;tres</nuxt-link>
          </li> -->
          <li>
            <nuxt-link
              to="/certification"
              class="nav-menu-item"
              @keydown.enter="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
              @keydown.space="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
            >Mes documents</nuxt-link>
          </li>
          <!-- <li>
            <nuxt-link
              to="/"
              class="nav-menu-item"
              @keydown.enter="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
              @keydown.space="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
            >Paiements</nuxt-link>
          </li> -->
          <li
            @click="logout"
            @focusout="$refs.nav_menu_long.classList.remove('nav-menu-profil-active')"
          >
            <nuxt-link
              to="/"
              class="nav-menu-item"
              @keydown.enter="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
              @keydown.space="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
            >D&eacute;connexion</nuxt-link>
          </li>
          <hr class="isMobile" />
          <li class="isMobile">
            <nuxt-link
              to="/links"
              class="nav-menu-item italic"
              @keydown.enter="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
              @keydown.space="$refs.nav_menu_long.classList.toggle('nav-menu-profil-active')"
            >Informations pratiques</nuxt-link>
          </li>
        </ul>
      </button>
    </div>
    <div v-else class="nav-connexion">
      <nuxt-link to="/login">Connexion</nuxt-link>
      <nuxt-link to="/onboarding">Inscription</nuxt-link>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
// import auth from "./../../utils/auth";
interface HTMLElement {
  [key: string]: any;
}
@Component
class partialNavbar extends Vue {
  // isLogged: boolean = false;
  defaultImage: string | null = require("~/assets/logo/logo-icon.png");
  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }
  created() {}
  toggleChat() {
    this.$store.commit("chat/toggleChat");
  }
  logout() {
    this.$store.dispatch("user/logout");
  }
  defaultPicture(event) {
    const source = event.target || event.srcElement;
    source.onerror = null;
    source.src = this.defaultImage;
  }
  // deepFocus(element, cls) {
  //   cls = cls || 'deep-focus';

  //   element
  //       .on('focusin', function() {
  //           element.addClass(cls);
  //       })
  //       .on('focusout', function() {
  //           var value = !!element.find(':focus').length;
  //           element.toggleClass(cls, value);
  //       });
  // };
  // checkIfIsLogged() {
  //   const logged = auth.isLoggedIn();
  //   if (logged === true) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // this.$store
  //   .dispatch('user/initAuth', this.req)
  //   .then(res => {
  //     // console.log(res)
  //     if (res) {
  //       this.isLogged = true;
  //     }
  //     resolve()
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     this.isLogged = false;
  //     resolve()
  //   })
  // }
  // isMobile() {
  //   if (
  //     /Android|webOS|iPhone||iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //       navigator.userAgent
  //     )
  //   ) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}
export default partialNavbar;
</script>


<style lang="scss">
.no-scroll {
  overflow-x: hidden;
}
.blur {
  filter: blur(4px);
}
.chat {
  cursor: pointer;
}
.navbar {
  max-width: $screen_max_width;
  margin: auto;
  .nav-brand {
    display: block;
    float: left;
    margin: auto 15px;
    & a {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 320px;
    }
  }
  .nav-menu-short {
    // height: $navbar_height_desktop;
    float: right;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-right: 10px;
    margin-top: 24px;
    & i,
    & a,
    & .nav-menu-profil,
    & .chat {
      color: #ffffff;
      display: flex;
      flex-direction: column;
    }
    & i {
      font-size: 36px;
      margin-bottom: 4px;
    }
    & a {
      &:hover .bounce-small {
        animation: bounce-scale-small 1.5s infinite;
      }
    }
    & a,
    & .nav-menu-profil,
    & .chat {
      font-family: $paragraphFont_Q;
      font-size: 12px;
      margin: auto 10px;
      font-weight: 700;
      &:hover {
        & .nav-menu-subtitle {
          color: $kakiGold;
        }
        // & figure {
        //   border-color: $white_gray;
        // }
      }
    }
    & .nav-menu-profil {
      position: relative;
      background: none;
      // outline: none;
      border: none;
      margin-left: 18px;
      & figure {
        overflow: hidden;
        width: 40px;
        height: 40px;
        transform-origin: bottom;
        transform: scale(1.3) translate(-3px, 0px);
        position: relative;
        border: 1.5px solid $kakiGold;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        transition: all 0.25s ease-in;
        & img {
          height: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      &:hover .nav-menu-long {
        visibility: visible;
        opacity: 1;
        transform: scaleY(1);
      }
    }
  }
  .nav-menu-profil-active {
    visibility: visible !important;
    opacity: 1 !important;
    transform: scaleY(1) !important;
  }
  .nav-menu-long {
    visibility: hidden;
    opacity: 0;
    color: $blueGround;
    background: $white_gray;
    border: 1px solid $darkBlack;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    position: absolute;
    top: $navbar_height_desktop - 25px;
    right: 0px;
    width: 240px;
    transform-origin: top;
    transform: scaleY(0);
    transition: all 0.25s ease-in-out;
    padding-bottom: 10px;
    list-style: none;
    &::before {
      content: "";
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 8px solid $white_gray;
      position: absolute;
      top: -7px;
      right: 15px;
    }
    .nav-menu-item {
      color: $blueGround;
      margin-left: 20px;
      display: block;
      transition: 0.45s;
      margin-right: 20px;
      padding: 10px 0 0 0;
      text-align: left;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      &:hover {
        color: $darkBlack;
      }
    }
  }
  .nav-connexion {
    float: right;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
    & a {
      color: $sweetPink;
      background: #fff;
      font-family: $btnFont;
      font-weight: 700;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      width: fit-content;
      // outline: none;
      border: none;
      border-radius: 5px;
      padding: 10px 30px;
      margin: auto 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
      transition: 0.5s;
      -webkit-transition: 0.5s;
      -moz-transition: 0.5s;
      -ms-transition: 0.5s;
      -o-transition: 0.5s;
      &:hover {
        background: $sweetPink;
        color: #fff;
        box-shadow: 4px 4px 12px rgba($darkBlack, 0.4);
      }
    }
  }
}
@media screen and (min-width: $tablet) {
  .navbar {
    height: $navbar_height_desktop;
    .nav-brand {
      height: $navbar_height_desktop;
      & a {
        height: $navbar_height_desktop;
      }
      img {
        &.nav-img-desktop {
          width: 100%;
        }
        &.nav-img-mobile {
          display: none;
        }
      }
    }
    .nav-connexion {
      height: $navbar_height_desktop;
    }
    .isMobile {
      display: none;
    }
  }
}
@media screen and (min-width: 480px) and (max-width: $tablet - 1px) {
  .navbar {
    height: $navbar_height_mobile;
    .nav-brand {
      height: $navbar_height_mobile;
      width: 100px;
      margin-left: 15px;
      margin-right: 0px;
      & a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: $navbar_height_mobile;
      }
      img {
        &.nav-img-desktop {
          display: none;
        }
        &.nav-img-mobile {
          display: block;
          height: $navbar_height_mobile - 25px;
        }
      }
    }
    .nav-menu-short {
      width: 50%;
      // margin-right: 0px;
      & a {
        margin: auto 10px;
      }
      & .nav-menu-profil {
        margin-left: 15px;
        margin-right: 10px;
      }
    }
    .nav-connexion {
      width: calc(100% - 120px);
      padding: 10px 20px;
      height: $navbar_height_mobile;
    }
    .isMobile {
      display: block;
    }
  }
}
@media screen and (min-width: $phone) and (max-width: 479px) {
  .navbar {
    height: $navbar_height_mobile;
    .nav-brand {
      height: $navbar_height_mobile - 15px;
      width: 100px;
      margin-left: 0px;
      margin-right: 0px;
      & a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: $navbar_height_mobile;
      }
      img {
        &.nav-img-desktop {
          display: none;
        }
        &.nav-img-mobile {
          display: block;
          height: $navbar_height_mobile - 25px;
        }
      }
    }
    .nav-menu-short {
      width: calc(100% - 115px);
      // margin-right: 0px;
      & a {
        margin: auto 5px;
      }
      & i {
        font-size: 26px;
      }
      & .nav-menu-profil {
        margin-left: 5px;
        margin-right: 5px;
      }
    }
    .nav-connexion {
      display: flex;
      flex-direction: column;
      width: calc(100% - 130px);
      height: $navbar_height_mobile - 20px;
      margin-top: 4px;
      & a {
        padding: 6px 0px;
        width: 150px;
      }
    }
    .isMobile {
      display: block;
    }
  }
}
</style>
