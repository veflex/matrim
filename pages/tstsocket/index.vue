<template>
  <h1>salut</h1>
</template>


<script lang="js">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import socket from '~/plugins/socket-io.js'
import ConversationThumbnail from '@/components/chat/ConversationThumbnail.vue'
import MessageList from '@/components/chat/MessageList.vue'
import SendMessage from '@/components/chat/SendMessage.vue'

@Component({
  name: "TstSocket",
  layout: "test",
  middleware: 'initWithToken',
  components: {
    ConversationThumbnail,
    MessageList,
    SendMessage
  }
})
class TstSocket extends Vue {
  msg = ''
  user = ''
  selectedUser= null
  selectedConv= null
  convActive = null

  @Watch('selectedConv')
  onSelectedConvChange(value){
     console.log('valuuuu selecteed', value);
  }

  get unRead(){
    const unread = this.conversations.filter((conv)=>{
      return !conv.isRead
    })
    return unread.length
  }

  
  mounted() {
    socket.on("private", this.receive);
    socket.emit('storeSocket', this.$store.getters['user/getLoggedUser'].id)
    socket.emit('join', this.currentUser.id)
      
    this.getConversations().then(() => {
      this.selectFirstConv()
    })
  }

  selectUser(id){
    this.selectedUser = id
  }

  selectFirstConv(){
    const firstConv = this.conversations[0]
      this.convActive = 'conversation' + firstConv.id_conv
      this.getMessagesFromConversation(firstConv)
  }

  get conversations(){
    return this.$store.getters['chat/getConversations']
  }

  get currentUser(){
    return this.$store.getters['user/getLoggedUser']
  }

  get messages(){
    return this.$store.getters['chat/getMessages']
  }

  updateConvOnRead(id_conv, from_user){
    return this.$store.dispatch('chat/updateConv', {id_conv, from_user, read:true})
  }

  refreshMessage(data){
    data.isRead = true
    this.getMessagesFromConversation(data)
  }
  getMessagesFromConversation(conversation){
    this.convActive = 'conversation'+conversation.id_conv
    this.selectedUser = conversation.user_id;
    this.selectedConv = conversation.id_conv
    socket.emit('join', conversation.user_id)
    if(!conversation.isRead){
      this.updateConvOnRead(this.selectedConv, this.currentUser.id)
      .then(()=>{
        this.$store.commit('chat/updateStoreIsRead', this.selectedConv)
        this.$store.dispatch('chat/getMessages', this.selectedConv).then(()=>{
          this.$root.$emit("scrollBot");
        })
      })
    } else {
      this.$store.dispatch('chat/getMessages', this.selectedConv).then(()=>{
          this.$root.$emit("scrollBot");
        })
    }
  }

  getConversations(){
    return this.$store.dispatch('chat/getConversations', this.$store.getters['user/getLoggedUser'].id)
  }

  receive(data){
    if(this.selectedConv === data.id_conv){
      data.isRead = false
      this.getMessagesFromConversation(data)
    }
    this.getConversations().then(()=>{
      this.$root.$emit('scrollBot');
    })
  }
}
export default TstSocket;
</script>


<style lang="scss">
.tst-socket {
  min-height: calc(100vh - 91px);
  height: 500px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  font-family: $paragraphFont_Q !important;
  background: white;
  .top-infos {
    width: 100%;
    display: flex;
    border-bottom: 1px solid lightgray;
    height: 10%;
    .left,
    .right {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .left {
      i {
        margin-right: 5px;
      }
      border-right: 1px solid lightgrey;
      width: 35%;
      height: 100%;
    }
    .right {
      width: 65%;
    }
  }
  .thumbnails {
    width: 35%;
    height: 90%;
    border-right: 1px solid lightgrey;
    box-sizing: border-box;
    .thumbnail {
      width: 100%;
      height: 100px;
      cursor: pointer;
    }
  }
  .messages {
    height: 90%;
    width: 65%;
    padding-bottom: 45px;
    position: relative;
  }
}
</style>

