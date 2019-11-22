<template>
  <div class="userSearch">
    <section class="container">
      <h1>Les r&eacute;sultats de votre recherche :</h1>
      <UserList :users="users_filtered"/>
      <!-- <Pagination
        :current-page="currentPage"
        :max-pages="maxPages"
        @nextPage="pageChangeHandle('next')"
        @previousPage="pageChangeHandle('previous')"
        @loadPage="pageChangeHandle"
      /> -->
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import UserList from "@/components/user/UserList.vue";
import Pagination from "@/components/pagination/Pagination.vue";
@Component({
  name: "UserSearch",
  layout: 'searchWidget',
  components: {
    UserList,
    Pagination
  },
  middleware: ["initWithToken", "getAllUsers"]
})
class Profil extends Vue {
  currentPage: number = 1;
  get users() {
    return this.$store.getters["user/getUsers"];
  }
  get users_filtered() {
    return this.$store.getters["user/getUsersFiltered"];
  }
  get maxPages() {
    return this.$store.getters["user/getMaxPages"];
  }
  pageChangeHandle(value: any) {
    switch (value) {
      case "next":
        this.currentPage += 1;
        this.getUsers();
        break;
      case "previous":
        this.currentPage -= 1;
        this.getUsers();
        break;
      default:
        this.currentPage = value;
        this.getUsers();
    }
  }
  getUsers() {
    this.$store
      .dispatch("user/getAllUsers", { page: this.currentPage })
      .then(() => {
        this.$router.push({
          name: "recherche",
          query: { page: `${this.currentPage}` }
        });
      });
  }
  created() {
    const queryPage = this.$route.query.page;
    if (queryPage) this.currentPage = Number(queryPage);
    // this.$store.dispatch("user/getUsersFiltered", {sex: 'F', cedex: [38360, 97401, 75019], certified: 1, min_age:24, max_age: 47})
    // this.$store.dispatch("user/getUsersFiltered", {sex: 'F', cedex: [38360, 97401, 75019], min_age:24, max_age: 47})
    console.log('fe', this.users_filtered)
  }
}
export default Profil;
</script>

<style lang="scss">
.userSearch {
  font-family: "Quicksand";
  background: rgba(211, 211, 211, 0.466);
  min-height: 100vh;
  .container {
    max-width: 900px;
    margin: auto;
  }
  & h1 {
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
}
</style>

