<template>
  <div class="navigation-page">
    <section class="np-container">
      <h2>Les profils à découvrir :</h2>
      <section class="np-container-list">
        <UserList :users="users_discover"/>
        <nuxt-link to="/recherche" class="link-search-more">
          Découvrir d'autres profils
          <i class="fas fa-chevron-right"></i>
        </nuxt-link>
      </section>
    </section>
    <section v-show="users_certified && users_certified.length > 0 " class="np-container certified">
      <h2>Les profils certifiés :</h2>
      <section class="np-container-list">
        <article ref="slider" class="slider">
          <UserList id="user_list_certified" :users="users_certified"></UserList>
          <span
            v-show="scroll_limit_left === false"
            tabindex="0"
            role="button"
            aria-label="Voir plus de profils"
            class="slider-move-left"
            @click="move_left"
          >
            <i class="fas fa-chevron-left"></i>
          </span>
          <span
            v-show="scroll_limit_right === false"
            tabindex="0"
            role="button"
            aria-label="Revoir les profils"
            class="slider-move-right"
            @click="move_right"
          >
            <i class="fas fa-chevron-right"></i>
          </span>
        </article>
        <!-- <nuxt-link to="/recherche" class="link-search-more">Voir plus de profils <i class="fas fa-chevron-down"></i></nuxt-link> -->
      </section>
    </section>
    <section class="np-container">
      <h2>Notre actualité :</h2>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import UserList from "@/components/user/UserList.vue";

interface HTMLElement {
  [key: string]: any;
}

@Component({
  name: "UserSearch",
  layout: "searchWidget",
  components: {
    UserList: UserList
  },
  middleware: ["initWithToken", "getAllUsers"]
})
class NavigationPage extends Vue {
  scroll_move_horizontal: number = 0;
  move_step: number = 210;
  scroll_limit_right: boolean = false;
  scroll_limit_left: boolean = true;
  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }
  get users_certified() {
    return this.$store.getters["user/getUsersCertified"];
  }
  get users_discover() {
    return this.$store.getters["user/getUsersDiscover"];
  }
  created() {
    let sex;
    if (this.user.sex === "M") {
      sex = "F";
    } else {
      sex = "M";
    }
    this.$store.dispatch("user/getUsersCertified", { sex: sex, limit: 8 });
    this.$store.dispatch("user/getUsersDiscover", {sex: sex, limit: 8})
  }
  move_right() {
    const slider: HTMLElement = this.$refs.slider;
    const user_list_certified = document.getElementById("user_list_certified");
    this.scroll_move_horizontal -= this.move_step;
    if (user_list_certified !== null) {
      const limit_translate =
        user_list_certified.offsetWidth - slider.offsetWidth;
      if (this.scroll_move_horizontal > -limit_translate) {
        user_list_certified.style.transform = `translateX(${
          this.scroll_move_horizontal
        }px)`;
        this.scroll_limit_right = false;
        this.scroll_limit_left = false;
      } else {
        this.scroll_move_horizontal = -limit_translate;
        user_list_certified.style.transform = `translateX(${
          this.scroll_move_horizontal
        }px)`;
        this.scroll_limit_right = true;
        this.scroll_limit_left = false;
      }
    }
  }
  move_left() {
    const user_list_certified = document.getElementById("user_list_certified");
    this.scroll_move_horizontal += this.move_step;
    if (user_list_certified !== null) {
      if (this.scroll_move_horizontal < 0) {
        user_list_certified.style.transform = `translateX(${
          this.scroll_move_horizontal
        }px)`;
        this.scroll_limit_left = false;
        this.scroll_limit_right = false;
      } else {
        this.scroll_move_horizontal = 0;
        user_list_certified.style.transform = `translateX(${
          this.scroll_move_horizontal
        }px)`;
        this.scroll_limit_left = true;
        this.scroll_limit_right = false;
      }
    }
  }
}
export default NavigationPage;
</script>

<style lang="scss">
// Decktop
@media screen and (min-width: $tablet) {
  .navigation-page {
    background: $blueGreen;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    // align-items: center;
    & h2 {
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 24px;
      text-align: left;
      width: 80%;
      // margin: auto;
      margin-left: auto;
      margin-right: auto;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
    & .np-container {
      min-height: 33vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &.certified {
        background: #fff;
        box-shadow: 0 1px 20px rgba(0, 0, 0, 0.15);
        & .user-list {
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-start;
          width: fit-content;
          // overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          position: relative;
          transition: all 0.25s ease-in-out;
          &::-webkit-scrollbar {
            display: none;
          }
          & .user-item {
            min-width: 210px;
            margin-right: 1rem;
          }
        }
        & .slider {
          position: relative;
          touch-action: pan-y;
          overflow: hidden;
          &:hover .slider-move-right,
          &:hover .slider-move-left {
            visibility: visible;
            opacity: 1;
          }
          & .slider-move-right,
          & .slider-move-left {
            position: absolute;
            top: 0;
            bottom: 16px;
            z-index: 4;
            width: 4%;
            text-align: center;
            justify-content: center;
            align-items: center;
            display: flex;
            color: #fff;
            background: rgba(20, 20, 20, 0.5);
            cursor: pointer;
            visibility: hidden;
            opacity: 0;
            transition: all 0.25s ease-in-out;
          }
          & .slider-move-right {
            right: 0;
          }
          & .slider-move-left {
            left: 0;
          }
        }
      }
    }
    & .np-container-list {
      max-width: 1280px;
      width: 80%;
      // border: 1px solid red;
      // margin: auto;
      margin-left: auto;
      margin-right: auto;
    }
    & .link-search-more {
      color: $kakiGold;
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 20px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 15px;
      & i {
        margin-left: 5px;
      }
    }
  }
}
// Mobile
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .navigation-page {
    background: $blueGreen;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    // align-items: center;
    & h2 {
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 24px;
      text-align: left;
      width: 80%;
      // margin: auto;
      margin-left: auto;
      margin-right: auto;
      padding-top: 1rem;
    }
    & .np-container {
      min-height: 33vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &.certified {
        background: #fff;
        box-shadow: 0 1px 20px rgba(0, 0, 0, 0.15);
        & .user-list {
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-start;
          // width: fit-content;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          position: relative;
          transition: all 0.25s ease-in-out;
          &::-webkit-scrollbar {
            display: none;
          }
          & .user-item {
            min-width: 210px;
            margin-right: 1rem;
          }
        }
        & .slider {
          position: relative;
          touch-action: pan-y;
          // overflow: hidden;
          // &:hover .slider-move-right, &:hover .slider-move-left{
          //   display: flex;
          // }
          & .slider-move-right,
          & .slider-move-left {
            position: absolute;
            top: 0;
            bottom: 16px;
            z-index: 20;
            width: 4%;
            text-align: center;
            justify-content: center;
            align-items: center;
            display: none;
            color: #fff;
            background: rgba(20, 20, 20, 0.5);
            cursor: pointer;
          }
          & .slider-move-right {
            right: 0;
          }
          & .slider-move-left {
            left: 0;
          }
        }
      }
    }
    & .np-container-list {
      max-width: 1280px;
      width: 80%;
      // border: 1px solid red;
      // margin: auto;
      margin-left: auto;
      margin-right: auto;
    }
    & .link-search-more {
      color: $kakiGold;
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 20px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 15px;
      & i {
        margin-left: 5px;
      }
    }
  }
}
</style>

