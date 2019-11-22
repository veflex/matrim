<template>
  <section class="certification">
    <article v-if="certification_state === false"  class="page-details">
      <h1>Faites-vous certifier !</h1>
      <p class="bold font-quicksand">Quels documents dois-je fournir ?</p>
      <p class="font-quicksand">Vous devrez nous faire parvenir un certain nombre de documents afin de nous permettre de valider votre profil et ainsi pouvoir accéder à la certification de votre profil par notre équipe.</p>
    </article>
    <article v-if="certification_state === false" class="upload">
      <DocumentUploader class="doc_upload" label="Votre situation matrimoniale" :mimes="['image/jpg', 'image/png', 'image/jpeg', 'application/pdf']" doc_name="Situ_matrim" :formular="user.situation === 'célibataire'" certif_id="1">
        <template v-slot:description>
          <div  v-if="user.situation != 'célibataire'">
            <p v-if="user.sex === 'M'" class="underline bold font-quicksand text-align-left">Divorcé :</p>
            <p v-if="user.sex === 'F'" class="underline bold font-quicksand text-align-left">Divorcée :</p>
          <p class="font-quicksand text-align-left">Au choix : Un extrait d'acte de naissance récent (moins de 3 mois), soit une copie livret de famille, soit l'acte de jugement de divorce.</p>
          <p v-if="user.sex === 'M'" class="underline bold font-quicksand text-align-left">Veuf :</p>
          <p v-if="user.sex === 'F'" class="underline bold font-quicksand text-align-left">Veuve :</p>
          <p class="font-quicksand text-align-left">Au choix : Un extrait d'acte de naissance récent (moins de 3 mois), soit une copie de votre livret de famille.</p>
          <p class="underline bold font-quicksand text-align-left">En instance de divorce :</p>
          <p class="font-quicksand text-align-left">Au choix : Une attestation d'avocat ou une attestation CAF.</p>
          <p class="underline bold font-quicksand text-align-left">Ancien partenaire de PACS :</p>
          <p class="font-quicksand text-align-left">Attestation de dissolution du PACS.</p>
          </div>
          <div  v-if="user.situation === 'célibataire'">
            <p class="underline bold font-quicksand text-align-left">C&eacute;libataire :</p>
            <p class="font-quicksand text-align-left">Une Attestation sur l'honneur, de ne pas avoir de vie conjugale.</p>
          </div>
        </template>
      </DocumentUploader>
      <DocumentUploader class="doc_upload" label="Votre lieu d'habituation" :mimes="['image/jpg', 'image/png', 'image/jpeg', 'application/pdf']" doc_name="Lieu" :formular="false" certif_id="3">
        <template v-slot:description>
          <p class="font-quicksand text-align-left">Justificatif de domicile de moins de trois mois (EDF, GDF, Eau, Boxe internet ou Telephone fixe) ou attestation d'hébergement.</p>
        </template>
      </DocumentUploader>
      <DocumentUploader class="doc_upload" label="Votre profession" :mimes="['image/jpg', 'image/png', 'image/jpeg', 'application/pdf']" doc_name="Profession" :formular="false" certif_id="2">
        <template v-slot:description>
          <p v-if="user.sex === 'M'" class="underline bold font-quicksand text-align-left">Vous êtes salarié :</p>
          <p v-if="user.sex === 'F'" class="underline bold font-quicksand text-align-left">Vous êtes salariée :</p>
          <p class="font-quicksand text-align-left">Votre bulletin de salaire.</p>
          <p class="underline bold font-quicksand text-align-left">Vous êtes indépendant / chef d'entrepise :</p>
          <p class="font-quicksand text-align-left">Un extrait récent du Kbis de votre entreprise.</p>
          <p v-if="user.sex === 'M'" class="underline bold font-quicksand text-align-left">Vous êtes retraité :</p>
          <p v-if="user.sex === 'F'" class="underline bold font-quicksand text-align-left">Vous êtes retraitée :</p>
          <p class="font-quicksand text-align-left">Justificatif de versement de votre / vos pensions de retraite.</p>
          <p class="underline bold font-quicksand text-align-left">Vous êtes au chômage :</p>
          <p class="font-quicksand text-align-left">Justificatif de versement de la part de Pôle Emploi et ancien bulletin de salaire.</p>
          <p class="underline bold font-quicksand text-align-left">Vous êtes sans activité :</p>
          <p class="font-quicksand text-align-left">Justificatif de vos revenus.</p>
          <p class="font-quicksand text-align-left">Si vous n'êtes en mesure de nous fournir aucun de ces documents, merci de nous fournir votre avis d'imposition.</p>
        </template>
      </DocumentUploader>
      <p>Si vous ne disposez pas d'imprimante, vous pouvez les prendre en photo via votre mobile. Une fois vos documents téléchargés, ils seront analysés sous peu et une une fois certifié ils seront détruits. Si vous avez une question ou si vous rencontrez un problème, vous pouvez <a href="https://www.m.matrimonline.fr/contact/" class="link" onclick="window.open(this.href); return false;" role=”link”>nous contacter</a>.</p>
    </article>
    <section v-if="certification_state === true" class="certified">
      <article class="certified">
        <p v-if="user.sex === 'M'" class="certified">Félicitations vous-êtes certifié !</p>
        <p v-if="user.sex === 'F'" class="certified">Félicitations vous-êtes certifiée !</p>
        <IconBase width="150" height="150" icon-color="#C6AC52" icon-name="certification_check"><IconCheckcertif /></IconBase>
      </article>
      <button class="pink_btn" @click="$router.back()">Retour</button>
    </section>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import DocumentUploader from "@/components/document_uploader.vue";
import IconBase from '@/components/icons/icon_base.vue';
import IconCheckcertif from '@/components/icons/svg/certification_check.vue';
@Component({
  name: "certification",
  middleware: "initWithToken",
  components: {
    DocumentUploader,
    IconBase,
    IconCheckcertif
  }
})
class Certification extends Vue {
  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }
  get certification_state() {
    return this.$store.getters["certification/getCertification_validation"];
  }
  created() {
    this.$store.dispatch('certification/getCertification_type');
    this.$store.dispatch('certification/validationCertificationUser', this.user.id);
  }
}
export default Certification;
</script>

<style lang="scss">
.certification {
  background: $white_gray;
  min-height: 100vh;
  & h1 {
    max-width: $screen_max_width;
    color: $kakiGold;
    font-family: $titleFont;
    font-size: 36px;
    font-weight: 700;
    margin: 15px auto;
  }
  & p {
    max-width: $screen_max_width;
    margin: 15px auto;
    font-family: $paragraphFont_Q;
  }
  .doc_upload {
    margin: 15px auto;
    max-width: $screen_max_width;
  }
  & article.certified {
    margin: 0 auto 50px;
    padding: 5px;
    display: flex;
    width: 100%;
    max-width: 700px;
    min-width: 300px;
    flex-direction: column;
    justify-content: space-evenly;
    align-items:center;
    background: rgb(255,255,255);
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    height: 60vh;
    max-height: 400px;
  }
  & p.certified{
    font-family: $titleFont;
    color: $darkBlack;
    font-size: 36px;
    font-weight: 700;
    border-left: none;
    border-right: none;
  }
  & .pink_btn {
    margin: auto;
  }
}
// Decktop
@media screen and (min-width: $tablet) {
  .certification {
    padding-left: 15%;
    padding-right: 15%;
     & section.certified {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%,25%);
  }
  }
// Mobile
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .certification {
    padding-left: 5%;
    padding-right: 5%;
     & section.certified {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%,10%);
  }
  }
}
</style>

