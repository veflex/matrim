<template>
  <section
    v-if="message"
    class="message-container"
    :class="isMessageSent ? 'flex-end': 'flex-start'"
  >
    <img
      v-if="!isMessageSent"
      class="img-from"
      :src="`/img/profils/${message.img_from}`"
      :alt="'image de profil de '+message.name"
    />
    <div class="message" :class="isMessageSent ? 'sent': 'received'">
      <p>{{message.message}}</p>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component
class Message extends Vue {
  @Prop() message: any;
  @Prop() isMessageSent;
}

export default Message;
</script>

<style lang="scss">
.message-container {
  width: 100%;
  display: flex;
  margin-bottom: 15px !important;
}

.flex-end {
  justify-content: flex-end;
}

.flex-start {
  justify-content: flex-start;
}

.img-from {
  width: 32px;
  height: 32px;
  border-radius: 100%;
  align-self: flex-end;
  margin-right: 20px;
}
.message {
  border-radius: 15px;
  padding: 15px;
  text-align: left;
  max-width: 85%;
  align-self: flex-end;
}

.sent {
  background: #f1eeee;
}
.received {
  background: $blueGround;
}
</style>
