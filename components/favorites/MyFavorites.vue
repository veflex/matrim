<template>
    <UserList v-if="users != null" :users="users"></UserList>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import UserList from "@/components/user/UserList.vue";

@Component({
  name: "myFavorites",
  components: {
    UserList
  }
})
class MyFavorites extends Vue {
  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }
  get users() {
    return this.$store.getters["user/getMyFavoriteUsers"];
  }
  created() {
    let sex;
    if(this.user.sex === 'M') {
      sex = 'F'
    } else {
      sex = 'M'
    }
    this.$store.dispatch('user/getMyFavoriteUsers', { user_id: this.user.id , sex: sex }).then(() => {
      // console.log(this.users)
    })
  }
}

export default MyFavorites;
</script>

<style lang="scss">
</style>
