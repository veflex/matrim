<template>
  <section class="user-item">
    <figure class="img-container" role="button" tabindex="0" @click="goToUser(user.id)" @keydown.enter="goToUser(user.id)" @keydown.space="goToUser(user.id)">
    <IconBase v-show="user.certified === 1" width="32" height="32" view-box="0 0 19.08 18.95" icon-color="#C6AC52" icon-name="Certification" class="user-certification"><IconCertif /></IconBase>
      <img
        v-if="user.img"
        class="profil-pic"
        :src="'/img/profils/' + user.img || ''"
        :alt="'photo de profil de' + user.name "
      >
    </figure>
    <div class="container-infos">
      <article class="interactivity">
        <i v-show="favorites_state === true" class="fas fa-heart favorites" role="button" tabindex="0" @click="delFromFavorites" @keydown.enter="delFromFavorites" @keydown.space="delFromFavorites"></i>
        <i v-show="favorites_state === false" class="far fa-heart favorites" role="button" tabindex="0" @click="addToFavorites" @keydown.enter="addToFavorites" @keydown.space="addToFavorites"></i>
        <i v-show="favorites_state === 'match'" class="favorites" role="button" tabindex="0" @click="delFromFavorites" @keydown.enter="delFromFavorites" @keydown.space="delFromFavorites">
        <IconBase width="22" height="22" view-box="0 0 129 104.65" icon-color="#C6AC52" icon-name="coup-de-coeur"><HeartMatch /></IconBase>
        </i>
        <i class="far fa-comment-dots mailbox" role="button" tabindex="0"></i>
      </article>
      <article class="infos" role="button" tabindex="0" @click="goToUser(user.id)" @keydown.enter="goToUser(user.id)" @keydown.space="goToUser(user.id)">
        <p class="name">{{user.name}}</p>
        <p>{{user.age}} ans</p>
        <p>{{user.cedex}}</p>
        <p>{{user.department_name}} ({{user.department_code}})</p>
        <!-- <p class="job">ouioui</p> -->
        <!-- <p class="situation">{{user.situation}}</p> -->
      </article>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import IconBase from '@/components/icons/icon_base.vue';
import IconCertif from '@/components/icons/svg/certification.vue';
import IconCheckCertif from '@/components/icons/svg/certification_check.vue';
import HeartMatch from '@/components/icons/svg/match.vue';

@Component({
  components: {
    IconBase,
    IconCertif,
    IconCheckCertif,
    HeartMatch
  }
})
export default class UserList extends Vue {
  @Prop() user: any;
  @Prop() goToUser: any;
  favorites_state: boolean | string = false;
  favorite: boolean = false;
  favoritedMe: boolean = false;

  get user_id() {
    return this.$store.getters["user/getLoggedUser"].id;
  }

  created () {
    // getfavorite
    this.$store.dispatch('user/getFavorite', { user_id: this.user_id , user_favorited: this.$props.user.id }).then((res) => {
      if(res.users.length > 0){
        this.favorite = true;
      }
      this.checkMatch();
    })
    // getfavoritedMe
    this.$store.dispatch('user/getFavorite', { user_id: this.$props.user.id , user_favorited: this.user_id }).then((res) => {
      if(res.users.length > 0){
        this.favoritedMe = true;
      }
      this.checkMatch();
    })
  }
  checkMatch() {
    if(this.favoritedMe === true && this.favorite === true){
      this.favorites_state = 'match';
    } else if(this.favoritedMe === false && this.favorite === true) {
      this.favorites_state = true;
    } else {
      this.favorites_state = false;
    }
  }
  addToFavorites() {
    this.$store.dispatch('user/postFavorite', { user_id: this.user_id , user_favorited: this.$props.user.id }).then(() => {
      this.favorite = true;
      this.checkMatch();
    })
  }
  delFromFavorites() {
    this.$store.dispatch('user/deleteFavorite', { user_id: this.user_id , user_favorited: this.$props.user.id }).then(() => {
      this.favorite = false;
      this.checkMatch();
    })
  }
}
</script>

<style lang="scss">
.user-item {
  width: 210px;
  background: white;
  height: 300px;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.33);
  overflow: hidden;
  &:hover{
    box-shadow: 1px 3px 8px rgba(0, 0, 0, 0.43)
  }
  cursor: pointer;
  .img-container {
    width: 100%;
    height: 70%;
    margin-bottom: auto;
    position: relative;
    background: $gray;
    .profil-pic {
      width: 100%;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      height: 100%;
      object-fit: cover;
    }
    .user-certification {
      position: absolute;
      top: 12px;
      right: 10px;
    }
  }
  .container-infos {
    width: 100%;
    height: 30%;
    text-align: left;
    padding-top: 12px;
    padding-bottom: 8px;
    padding-left: 10px;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    position: relative;
    .infos {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      font-family: $paragraphFont_Q;
      font-size: 16px;
      font-weight: 700;
    }
    .name {
      color: $kakiGold;
      font-weight: 700;
      &:first-letter {
          text-transform: uppercase;
      }
    }
    .situation {
      color: $blueGround;
    }
    & .interactivity {
      position: absolute;
      top: -20px;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-end;
      & i {
        background: #fff;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.33);
        height: 40px;
        width: 40px;
        border-radius: 50%;
        margin-right: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.25s ease-in-out;
        &.favorites{
          color: $sweetPink;
        }
        &.mailbox{
          color: #fff;
          background: $blueGround;
        }
        &:hover {
          transform: scale(0.9);
        }
      }
    }
  }
}
</style>
