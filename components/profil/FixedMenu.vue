<template>
  <section class="fixed-menu">
    <i class="fas fa-heart heart box"></i>
    <i class="fas fa-envelope envelope box"></i>
    <i class="fas fa-camera camera box"></i>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component
class FixedMenu extends Vue {}

export default FixedMenu;
</script>

<style lang="scss">
.fixed-menu {
  position: fixed;
  top: 200px;
  right: 0;
  width: 60px;
  height: auto;
  display: flex;
  flex-direction: column;
  z-index: 40;
  .box {
    padding: 15px;
    width: 100%;
    height: 60px;
    cursor: pointer;
    font-size: 30px;
    border-radius: 15px;
    margin-bottom: 15px;
    color: white;
    &.heart {
      background: $sweetPink;
    }
    &.envelope {
      background: $blueGround;
    }
    &.camera {
      background: $kakiGold;
    }
  }
}

@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .fixed-menu {
    width: 40px;
    .box {
      height: 40px;
      padding: 10px;
      font-size: 20px;
    }
  }
}
</style>
