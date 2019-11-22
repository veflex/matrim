<template>
  <section v-if="conversation" ref="infos" class="informations">
    <section class="left-infos">
      <img
        :src="`/img/profils/${conversation.user_img}`"
        :alt="`photo de profil de ${conversation.name}`"
        class="infos-img"
      />
      <section class="user-infos">
        <p class="name">{{conversation.name}}</p>
        <p>{{conversation.age}} ans</p>
        <p class="link" @click="closeAndGo">Voir son profil</p>
      </section>
    </section>
    <section class="right-infos">
      <p @click="close"><i class="fas fa-times"></i></p>
    </section>
    <!-- <h1>{{conversation}}</h1> -->
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component
class Infos extends Vue {
  @Prop() conversation: any;

  closeAndGo() {
    this.close();
    this.$router.push(`/profil/${this.conversation.user_id}`);
  }
  close() {
    this.$store.commit("chat/toggleChat");
    const view = document.querySelector('.views');
    if (view) view.classList.remove('blur')
  }
}

export default Infos;
</script>

<style lang="scss">
.informations {
  display: flex;
  justify-content: space-between;
  padding: 5px 20px;
  width: 100%;
  .infos-img {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    margin-right: 15px;
  }
  .left-infos {
    font-size: 15px;
    text-align: left;
    display: flex;
    align-items: center;
    .user-infos {
      color: black;
      .name {
        color: $kakiGold;
      }
      .link {
        color: black;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}
</style>
