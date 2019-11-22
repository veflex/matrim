<template>
  <section v-if="messages" ref="msg-list" class="msg-list">
    <Message
      v-for="message in messages"
      :key="message.id"
      :message="message"
      :is-message-sent="currentUser === message.id_from"
    />
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Message from "@/components/chat/Message.vue";
@Component({
  components: {
    Message
  }
})
class MessageList extends Vue {
  @Prop() messages: any;
  @Prop() currentUser: any;

  created() {
    this.$root.$on("scrollBot", this.scrollToBottom);
  }

  scrollToBottom() {
    const msgList = this.$refs["msg-list"];
    if (msgList) {
      (msgList as any).scrollTop = (msgList as any).scrollHeight;
    }
  }
}

export default MessageList;
</script>

<style lang="scss" scoped>
.msg-list {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-y: scroll;
  padding-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
}
</style>
