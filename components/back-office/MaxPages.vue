<template>
  <section class="maxPages">
    <p>{{ maxPages }}</p>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'MaxPages'
})
class MaxPages extends Vue {
  @Prop() maxPages: number | undefined;
}

export default MaxPages;
</script>
