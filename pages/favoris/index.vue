<template>
  <section class="favoris">
    <section class="bandeau">
      <article class="bandeau-container">
        <article class="getBack" role="button" tabindex="0" @click="$router.back()" @keydown.enter="$router.back()" @keydown.space="$router.back()">
          <i class="fas fa-chevron-left getBack-arrow"></i>
          <span>Retour</span>
        </article>
        <article class="title-favorites">
          <i class="fas fa-heart title-favorites-heart"></i>
          <h1>Mes Favoris</h1>
        </article>
      </article>
    </section>
    <article class="menu-choice">
      <input id="myFavorites" name="favorites" type="radio" value="myFavorites" checked="checked"/>
      <label for="myFavorites" class="border-separation" role="button" tabindex="0" @click="showMyFavorites" @keydown.enter="showMyFavorites" @keydown.space="showMyFavorites">{{myFavorites}}</label>
      <input id="meFavorited" name="favorites" type="radio" value="meFavorited"/>
      <label for="meFavorited" role="button" tabindex="0" @click="showWhoFavoritedMe" @keydown.enter="showWhoFavoritedMe" @keydown.space="showWhoFavoritedMe">{{meFavorited}}</label>
    </article>
    <article class="list">
      <component :is="isComponent"></component>
      <nuxt-link to="/" tag="button" role="button" tabindex="0" class="pink_btn">Plein de personnes attendent votre visite</nuxt-link>
    </article>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import MyFavorites from "@/components/favorites/MyFavorites.vue";
import MeFavorited from "@/components/favorites/MeFavorited.vue";
@Component({
  name: "favoris",
  components: {
    MyFavorites,
    MeFavorited
  },
  middleware: "isLoggedIn"
})
class Favorites extends Vue {
  isComponent: string | null = 'MyFavorites';
  myFavorites: string | null = "Je les ai ajoutées";
  meFavorited: string | null = "Elles m'ont ajouté";

  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }
  created() {
    if(this.user.sex === 'F') {
      this.myFavorites = "Je les ai ajoutés";
      this.meFavorited = "Ils m'ont ajoutées";
    }
  }
  showMyFavorites() {
    this.isComponent = 'MyFavorites';
  }
  showWhoFavoritedMe() {
    this.isComponent = 'MeFavorited';
  }
}
export default Favorites;
</script>

<style lang="scss">
// Decktop
@media screen and (min-width: $tablet) {
  .favoris {
    background: $blueGreen;
    min-height: 100vh;
    & .bandeau {
      position: fixed;
      z-index: 1;
      width: 100%;
      height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background: #fff;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.33);
      & .bandeau-container {
        max-width: 1280px;
        width: 100%;
      }
      & article {
        font-family: $paragraphFont_Q;
        font-weight: 700;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
      }
      & .title-favorites {
        font-size: 25px;
        width: 90%;
        padding-right: 10%;
        & .title-favorites-heart {
          color: $sweetPink;
          margin: 5px 10px;
        }
      }
      & .getBack{
        font-size: 22px;
        width: 10%;
        cursor: pointer;
        & .getBack-arrow {
          margin: 5px 15px 5px 0px;
        }
      }
    }
  }
  .menu-choice {
    display: inline-block;
    margin: 70px auto 0px;
    font-size: 0;
    & .border-separation{
      border-right: 2px solid;
      border-image: linear-gradient(to bottom, transparent 10%, $gray 12% 88%, transparent 90%) 1 100%;
    }
    & label {
      display: inline-block;
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 18px;
      padding: 10px 20px;
      cursor: pointer;
    }
    & input[type="radio"]{
      display: none;
      &:checked + label{
        color: $sweetPink;
      }
    }
  }
  .list {
    background: #fff;
    width: 80%;
    min-height: 72vh;
    margin: 10px auto;
    padding: 20px 30px;
    border-radius: 20px;
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
}
// Mobile
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .favoris {
    background: $blueGreen;
    min-height: 100vh;
    & .bandeau {
      position: fixed;
      z-index: 1;
      width: 100%;
      height: 40px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background: #fff;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.33);
      & .bandeau-container {
        max-width: 1280px;
        width: 100%;
      }
      & article {
        font-family: $paragraphFont_Q;
        font-weight: 700;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
      }
      & .title-favorites {
        font-size: 16px;
        width: 80%;
        padding-right: 20%;
        & .title-favorites-heart {
          color: $sweetPink;
          margin: 5px 10px;
        }
      }
      & .getBack{
        font-size: 18px;
        width: 20%;
        padding-left: 15px;
        justify-content: flex-start;
        cursor: pointer;
        & .getBack-arrow {
          margin: 5px 8px;
        }
      }
    }
  }
  .menu-choice {
    display: inline-block;
    margin: 50px auto 0px;
    font-size: 0;
    & .border-separation{
      border-right: 2px solid;
      border-image: linear-gradient(to bottom, transparent 10%, $gray 12% 88%, transparent 90%) 1 100%;
    }
    & label {
      display: inline-block;
      font-family: $paragraphFont_Q;
      font-weight: 700;
      font-size: 18px;
      padding: 10px 7px;
      cursor: pointer;
    }
    & input[type="radio"]{
      display: none;
      &:checked + label{
        color: $sweetPink;
      }
    }
  }
  .list {
    background: #fff;
    width: 100%;
    min-height: 72vh;
    margin: 10px auto;
    padding: 15px;
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
}
</style>
