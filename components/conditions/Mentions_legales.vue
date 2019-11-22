<template>
  <section class="mentions-legales">
    <h1>MENTIONS L&Eacute;GALES</h1>

    <h2 class ="title">1. &Eacute;diteur :</h2>



<p>Le site matrimonline.fr est &eacute;dit&eacute; par :</p>



<span class="bold">La Soci&eacute;t&eacute; Electre</span>

<p>SASU au capital de 8.000 euros</p>

<p>Immatricul&eacute;e au RCS de Bobigny sous le num&eacute;ro 838 310 092 00013</p>

<p>Ayant son si&egrave;ge social au 1 rue Auguste RENOIR 93600 AULNAY-SOUS-BOIS</p>

<p>T&eacute;l. : +33 (0)1 48 19 36 34</p>

<p>E-mail : <a href="mailto:contact@matrimonline.fr">contact@matrimonline.fr<a></p>





<h2 class ="title">2. Directeur de la publication :</h2>



<p>Madame Sarah RONCERAY</p>



<h2 class ="title">3. H&eacute;bergeurs :</h2>



<p>Le site matrimonline.fr est h&eacute;berg&eacute; par :</p>



<p>La Soci&eacute;t&eacute; OVH</p>

<p>SAS au capital de 10 059 500 &euro;</p>

<p>RCS Lille M&eacute;tropole 427 761 419 00045</p>

<p>Code APE 6202A</p>

<p>N&deg; TVA : FR 22 424 761 419</p>

<p>Si&egrave;ge social : 2 rue Kellermann &ndash; 59100 Roubaix &ndash; France.</p>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
@Component({
  name: 'mentions-legales',

})
class MentionsLegales extends Vue {

}
export default MentionsLegales
</script>



<style lang="scss">
.mentions-legales {
  & h1 {
    color: $sweetPink;
    font-family: $paragraphFont_Q;
    font-weight: 700;
    font-size: 46px;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    margin: 20px auto;
  }
  & h2.title {
    text-decoration: underline;
    margin: 20px auto 10px;
  }
  & .infos, & h1 {
    text-align: center;
    margin: 0 auto 15px;
    display: block;
  }
  & .infos {
    color: $gray;
  }
  & p, & span {
    font-size: 16px;
    line-height: 26px;
    letter-spacing: 1px;
    text-align: left;
  }
  & a {
    color: $sweetPink;
  }
}
</style>
