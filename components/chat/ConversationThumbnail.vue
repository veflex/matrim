<template>
  <section
    v-if="conversation && lastMessage"
    class="conversation-thumbnail"
    :class="isActive ? 'active-conv' : ''"
    @click="getMessages(conversation)"
  >
    <section class="left-thumbnail">
      <img
        :src="`/img/profils/${conversation.user_img}`"
        :alt="`photo de profil de ${conversation.name}`"
        class="thumbnail-picture"
      />
    </section>
    <section class="right-thumbnail">
      <p class="name">{{conversation.name}}</p>
      <p class="age">{{conversation.age}} ans</p>
      <p
        v-if="isNewMessageNotification()"
        class="unread-msg"
      >{{lastMessage.message.substring(0, 5)}}...</p>
      <p v-else-if="!isLastMessageSameDay()" class="last-msg">Dernier message: {{lastMessage.date}}</p>
      <p v-else>Dernier message: {{lastMessage.time}}</p>
    </section>
    <span v-if="isNewMessageNotification()" class="not-read"></span>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import socket from "~/plugins/socket-io.js";
@Component
class ConversatonThumbnail extends Vue {
  @Prop() conversation: any;
  @Prop() getMessages: any;
  @Prop() isActive: any;

  lastMessage = null;
  created() {
    this.getLastMsg();
    this.$root.$on("sent", this.getLastMsg);
    socket.on("private", this.getLastMsg);
  }

  getLastMsg() {
    this.$store
      .dispatch("chat/getLastMessage", this.conversation.id_conv)
      .then(lastMessage => {
        this.lastMessage = lastMessage[0];
      });
  }
  isNewMessageNotification() {
    const isRead = (this.conversation as any).isRead;
    if (!isRead) {
      return true;
    } else {
      return false;
    }
  }

  isLastMessageSameDay() {
    const today = new Date();
    const lastMessageDate = new Date((this.lastMessage as any).created_at);
    return (
      today.getFullYear() === lastMessageDate.getFullYear() &&
      today.getMonth() === lastMessageDate.getMonth() &&
      today.getDate() === lastMessageDate.getDate()
    );
  }
}

export default ConversatonThumbnail;
</script>

<style lang="scss">
.conversation-thumbnail {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  border-bottom: 1px solid lightgrey;
  .left-thumbnail {
    width: 30%;
    .thumbnail-picture {
      width: 70px;
      height: 70px;
      object-fit: cover;
      border-radius: 100%;
      border: 1px solid black;
    }
  }
  .right-thumbnail {
    width: 55%;
    text-align: left;
    .name {
      color: $kakiGold;
      font-weight: bold;
    }
    .unread-msg {
      font-weight: bold;
    }
  }
  .not-read {
    width: 10px;
    height: 10px;
    border-radius: 100%;
    background: $kakiGold;
    display: block;
    position: absolute;
    right: 10px;
    top: calc(50% - 5px);
  }
}
.active-conv {
  background: $kakiGold;
  .right-thumbnail {
    .name {
      color: white;
    }
  }
  color: white;
}
</style>
