<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal relative"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <button
          type="button"
          class="fas fa-times sticky top__right btn-close"
          aria-label="Close modal"
          @click="close"
        ></button>
        <section id="modalTitle" class="modal-header">
          <slot name="header">{{ header }}</slot>
        </section>
        <section id="modalDescription" class="modal-body">
          <slot name="body">{{ body }}</slot>
        </section>
        <section class="modal-footer">
          <slot name="footer">
            {{ footer }}
            <button
              type="button"
              class="pink_btn margin-auto"
              aria-label="Close modal"
              @click="close"
            >Fermer</button>
          </slot>
        </section>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({
  name: "modal"
})
class ModalComponent extends Vue {
  @Prop() header: string | undefined;
  @Prop() body: any | undefined;
  @Prop() footer: string | undefined;

  close(): void {
    this.$emit("close");
  }
}
export default ModalComponent;
</script>

<style lang="scss">
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: left;
  z-index: 10;
}

.modal {
  background: #fff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  width: 80%;
  max-width: 1080px;
  max-height: 600px;
  padding: 10px;
  overflow-y: scroll;
}

.modal-header,
.modal-footer {
  display: flex;
  width: 100%;
}

.modal-header {
  color: $kakiGold;
  justify-content: space-between;
}

.modal-footer {
  display: block;
}

.modal-body {
  position: relative;
  padding: 20px 15px;
}

.btn-close {
  z-index: 2;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: $darkBlack;
  text-align: right;
  background: transparent;
  transition: 0.3s;
  &:hover {
    color: $kakiGold;
  }
}
</style>
