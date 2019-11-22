<template>
  <span class="pagination-number" @click="onClick">{{ pageNumber }}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class PaginationNumber extends Vue {
  @Prop() pageNumber!: number;
  onClick() {
    this.$parent.$emit('loadPage', this.pageNumber);
  }
}
</script>
