<template>
  <section class="user-img" :style="style">
    <div class="filter" :class="colorFilter"></div>
    <figure class="img-container">
      <img
        v-if="img"
        :style="`filter: ${filter}`"
        :src="`/img/profils/${img}`"
        :alt="`Photo MatriMonline de ${name}`"
        class="pic"
      />
    </figure>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component
class CustomMsg extends Vue {
  @Prop() img: string | undefined;
  @Prop() name: string | undefined;
  @Prop() width: string | undefined;
  @Prop() height: string | undefined;
  @Prop() filter: string | undefined;
  @Prop() colorFilter: string | undefined;
  @Prop() css: string | undefined;

  style: any = null;

  created() {
    this.style = {
      width: this.width,
      height: this.height
    };
  }
}

export default CustomMsg;
</script>

<style lang="scss" scoped>
.user-img {
  position: relative;
  z-index: 2;
  .filter {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
    opacity: 0.18;
  }
  .img-container {
    width: 100%;
    height: 100%;
    .pic {
      image-rendering: crisp-edges;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
}
.green {
  left: 0;
  top: 0;
  background: green;
}
.yellow {
  right: 0;
  top: 0;
  background: yellow;
}
.blue {
  left: 0;
  bottom: 0;
  background: blue;
}
.red {
  right: 0;
  bottom: 0;
  background: red;
}
</style>
