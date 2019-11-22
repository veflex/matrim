<template>
  <section v-if="user" class="certification">
    <h2>Mes documents</h2>
    <h1>Faites vous certifier !</h1>
    <p>Quels documents dois-je fournir ?</p>
    <p>Vous devrez nous faire parvenir un certain nombre de documents afin de nous permettre de valider votre profil et ainsi pouvoir accéder à la certification de votre profil par notre équipe</p>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Upload_documents from "@/components/account-management/upload_documents.vue";

@Component({
  name: "documents",
  middleware: "getOneUser",
  components: {
    Upload_documents
  }
})
class Certification extends Vue {
  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }

  created() {}
}
export default Certification;
</script>

<style lang="scss">
.certification{

}
</style>

