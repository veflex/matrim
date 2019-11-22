<template v-if="maxPages">
  <section class="pagination">
    <PaginationArrow :disabled="isPreviousButtonDisabled" @click.native="previousPage">←</PaginationArrow>
    <PaginationNumber
      v-for="page in maxPages"
      :key="page"
      :page-number="page"
      :class="{
        'pagination__description--current': page === currentPage
      }"
      @loadPage="onLoadPage"
    />
    <PaginationArrow :disabled="isNextButtonDisabled" @click.native="nextPage">→</PaginationArrow>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import PaginationArrow from "@/components/pagination/PaginationArrow.vue";
import PaginationNumber from "@/components/pagination/PaginationNumber.vue";

@Component({
  components: {
    PaginationArrow,
    PaginationNumber
  }
})
export default class Pagination extends Vue {
  @Prop() currentPage!: number;
  @Prop() maxPages!: number;
  get isPreviousButtonDisabled() {
    return this.currentPage === 1;
  }
  get isNextButtonDisabled() {
    return this.currentPage === this.maxPages;
  }
  nextPage() {
    this.$emit("nextPage");
  }
  previousPage() {
    this.$emit("previousPage");
  }
  onLoadPage(value: number) {
    this.$emit("loadPage", value);
  }
}
</script>

<style lang="scss">
$c-primary-accent: #ff9a57;

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;

  &__description {
    display: flex;
    margin: 0 17px;
    font-size: 16px;
    font-weight: 600;

    &--current {
      color: $c-primary-accent;
    }
  }

  .arrow-left {
    transform: rotateZ(180deg);
  }
}
</style>
