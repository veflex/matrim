<template>
  <section class="user-list">
    <div v-if="isLoading">
      <div>Loading...</div>
    </div>
    <UserItem v-for="user in users" :key="user.id" :user="user" :go-to-user="goToUser"/>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import UserItem from "@/components/user/UserItem.vue";
import axios from 'axios'


@Component({
  name: 'user-list',
  components: {
    UserItem
  }
})
export default class UserList extends Vue {
  @Prop() users: any;

  get isLoading() {
    return this.$store.getters["user/getIsLoading"];
  }

  created() {
    axios.interceptors.request.use((config) => {
      console.log('loading true')
      this.$store.commit('user/loading', true);
      return config;
    }, (error) => {
      console.log('loading false')
      this.$store.commit('user/loading', false);
      return Promise.reject(error);
    });
  }

  goToUser(id) {
    this.$router.push(`/profil/${id}`);
  }
}
</script>

<style lang="scss">
.user-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
}
</style>
