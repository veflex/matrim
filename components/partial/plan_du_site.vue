<template>
  <section class="plan-du-site">
    <article class="foot-categorie">
      <h3>A PROPOS</h3>
      <a href="https://m.matrimonline.fr/qui-sommes-nous/">Qui sommes-nous ?</a>
      <a href="https://m.matrimonline.fr/blog-homepage/">Blog</a>
      <a href="https://m.matrimonline.fr/le-concept/">Le concept</a>
      <a href="https://m.matrimonline.fr/certification/">Certification</a>
      <a href="https://m.matrimonline.fr/la-fondatrice/">La fondatrice</a>
      <a href="https://m.matrimonline.fr/professionnels/">Professionnels</a>
      <a href="https://m.matrimonline.fr/tarifs/">Tarifs</a>
      <a href="https://m.matrimonline.fr/recrutement/">Recrutement</a>
    </article>
    <article class="foot-categorie">
      <h3>INFOS LÉGALES</h3>
      <a href="https://m.matrimonline.fr/mentions-legales/">Mentions l&eacute;gales</a>
      <a href="https://m.matrimonline.fr/cguv/">CGUV</a>
      <a href="https://m.matrimonline.fr/politique-de-confidentialite/">Politique de confidentialité</a>
      <a href="https://m.matrimonline.fr/politique-de-cookies/">Politique de cookies</a>
      <a href="https://m.matrimonline.fr/faq/">FAQ</a>
    </article>
    <article>
      <article class="foot-categorie">
        <h3>SERVICE CLIENT</h3>
        <p>Du lundi au vendredi</p>
        <p>De 9h à 12h</p>
        <p>Et de 14h à 17h</p>
        <p>Tel : 01 48 19 36 34</p>
        <a href="https://m.matrimonline.fr/contact/">Nous contacter</a>
      </article>
      <article class="foot-categorie">
        <h3>SUIVEZ-NOUS</h3>
        <SocialNetwork/>
      </article>
    </article>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import SocialNetwork from "./social_network.vue"
@Component({
  components:{
    SocialNetwork
  }
})
class partialPlanDuSite extends Vue {}
export default partialPlanDuSite;
</script>

<style lang="scss">
.plan-du-site {
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
  & h3 {
    color: #fff;
    text-transform: uppercase;
    font-family: $titleFont;
    font-weight: 700;
    letter-spacing: 1.2px;
    font-size: 18px;
    margin: 15px 0px;
  }
  & article.foot-categorie {
    display: flex;
    flex-direction: column;
    & a, & p {
      color: #fff;
      font-size: 14px;
      margin-bottom: 5px;
      font-family: $paragraphFont_Q;
    }
    & a:hover {
      text-decoration: underline;
    }
  }
}
</style>
