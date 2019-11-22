<template>
  <button v-if="!disabled">
    <slot />
  </button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class PaginationArrows extends Vue {
  @Prop() disabled!: boolean;
}
</script>
