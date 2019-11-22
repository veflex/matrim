<template>
  <section class="send-message">
    <input v-model="msg" class="input" type="text" placeholder="Tapez votre texte ici" />
    <button class="send" @click="send">Envoyer</button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import socket from "~/plugins/socket-io.js";
@Component({})
class SendMessage extends Vue {
  @Prop() socket: any;
  @Prop() from: number | undefined;
  @Prop() to: number | undefined;
  @Prop() conv: number | undefined;
  msg = "";

  updateConvOnWrite(id_conv, from_user) {
    return this.$store.dispatch("chat/updateConv", {
      id_conv,
      from_user,
      write: true
    });
  }

  send() {
    if (!this.msg) {
      return;
    }
    const payload = {
      id_conversation: this.conv,
      from_user: this.from,
      to_user: this.to,
      message: this.msg
    };
    const payload2 = {
      user_id: payload.to_user,
      id_conv: payload.id_conversation,
      isRead: true
    };
    this.$store.dispatch("chat/sendMessage", payload).then(() => {
      this.updateConvOnWrite(this.conv, this.from).then(() => {
        socket.emit("conversation", payload2);
        this.$root.$emit("sent");
        this.$emit("sent", payload2);
        this.msg = "";
      });
    });
  }
}

export default SendMessage;
</script>

<style lang="scss" scoped>
.send-message {
  width: 100%;
  height: 45px;
  padding: 10px;
  display: flex;
  justify-content: space-around;
  background: #f1eeee;
  .input {
    width: 80%;
    border: none;
    border-radius: 20px;
    font-family: $paragraphFont_Q;
    padding-left: 10px;
  }
  .send {
    width: 10%;
    min-width: 70px;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 20px;
    background: $sweetPink;
  }
}
</style>
