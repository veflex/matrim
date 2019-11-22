<template>
  <section class="chat-container">
    <section class="exterior" @click="close"></section>
    <section v-if="conversations" ref="chat_global" class="chat-global">
      <section ref="left" class="left">
        <section class="top">
          <i class="fas fa-envelope"></i>
          <p>
            Messagerie
            <span>({{unRead}})</span>
          </p>
        </section>
        <section class="bottom">
          <div v-for="conversation in conversations" :key="conversation.id_conv">
            <ConversationThumbnail
              :ref="'conversation'+conversation.id_conv"
              :conversation="conversation"
              class="thumbnail"
              :is-active="convActive === 'conversation'+conversation.id_conv"
              :get-messages="getMessagesFromConversation"
              @select="selectUser"
            />
          </div>
        </section>
      </section>
      <section ref="right" class="right">
        <section class="top">
          <i class="fas fa-arrow-left back" @click="changeClassesForSlide"></i>

          <Infos :conversation="convInfos" />
        </section>
        <section class="bottom">
          <section v-if="selectedUser && selectedConv" ref="messages" class="messages">
            <MessageList :messages="messages" :current-user="currentUser.id" />
            <SendMessage
              :from="currentUser.id"
              :to="selectedUser"
              :conv="selectedConv"
              @sent="refreshMessage"
            />
          </section>
        </section>
      </section>
      <!-- </no-ssr> -->
    </section>
  </section>
</template>


<script lang="js">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import socket from '~/plugins/socket-io.js'
import ConversationThumbnail from '@/components/chat/ConversationThumbnail.vue'
import MessageList from '@/components/chat/MessageList.vue'
import SendMessage from '@/components/chat/SendMessage.vue'
import Infos from '@/components/chat/Infos.vue'

@Component({
  name: "ChatGlobal",
  components: {
    ConversationThumbnail,
    MessageList,
    SendMessage,
    Infos
  }
})
class ChatGlobal extends Vue {
  msg = ''
  user = ''
  selectedUser= null
  selectedConv= null
  convInfos = null
  convActive = null
  clientWidth =0

  close(){
    this.$store.commit("chat/toggleChat");
    const view = document.querySelector('.views');
    if (view) view.classList.remove('blur')
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
    this.clientWidth = document.documentElement.offsetWidth
    if(this.clientWidth <= 960){
      return
    }

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
  toggleClasses(elems, newClass){
    elems.forEach(elem => {
      elem.classList.toggle(newClass)
    });
  }
  changeClassesForSlide(){
    this.clientWidth = document.documentElement.offsetWidth
    if(this.clientWidth> 960) {
      return
    }
    const chat_global = this.$refs.chat_global
    this.toggleClasses([chat_global], 'translate')
    // const left = this.$refs.left
    // const right = this.$refs.right
    // const elems = [left, right]

    // this.toggleClasses(elems, 'translate')


  }
  getMessagesFromConversation(conversation){
    this.convInfos = conversation
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
          this.changeClassesForSlide()
        })
      })
    } else {
      this.$store.dispatch('chat/getMessages', this.selectedConv).then(()=>{
        this.$root.$emit("scrollBot");
          this.changeClassesForSlide()
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
export default ChatGlobal;
</script>


<style lang="scss">
.chat-container {
  display: flex;
  z-index: 5;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  top: 91px;
  position: absolute;
  width: 100%;
  height: calc(100vh - 91px);
  display: flex;
  justify-content: center;
  align-items: center;
  .exterior {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .chat-global {
    height: 500px;
    width: 80%;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    box-shadow: -5px 5px 10px lightgrey, 5px -5px 10px lightgrey,
      5px 5px 10px lightgrey, -5px -5px 10px lightgrey;
    font-family: $paragraphFont_Q !important;
    border-radius: 20px;
    background: white;
    z-index: 2;
    .left {
      width: 35%;
      height: 100%;
      .top {
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid lightgrey;
        i {
          margin-right: 5px;
        }
      }
      .bottom {
        border-right: 1px solid lightgrey;
        .thumbnail {
          width: 100%;
          height: 100px;
          cursor: pointer;
        }
      }
    }
    .right {
      width: 65%;
      height: 100%;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 10px;
        .back {
          display: none;
          color: $kakiGold;
          cursor: pointer;
          font-size: 40px;
        }
      }
    }
    .top,
    .bottom {
      width: 100%;
    }
    .top {
      height: 13%;
      border-bottom: 1px solid lightgray;
    }
    .bottom {
      height: 87%;
    }
    .messages {
      height: 100%;
      width: 100%;
      padding-bottom: 45px;
      position: relative;
    }
  }
}

@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .chat-container {
    width: 100vw;
    justify-content: left;
    .blured-chat {
      display: none;
    }
    .chat-global {
      min-width: 200vw;
      height: 100%;
      border-radius: 0;
      box-shadow: none;
      transition: 0.5s ease-in-out;
      .left,
      .right {
        width: 50%;
        transition: 0.5s ease-in-out;
      }
      .right {
        .top {
          .back {
            display: block;
          }
        }
      }
      // .top-infos {
      //   width: 100%;
      //   .left,
      //   .right {
      //     width: 50%;
      //     transition: 0.5s ease-in-out;
      //   }
      // }
      // .thumbnails,
      // .messages {
      //   width: 50%;
      //   transition: 0.5s ease-in-out;
      // }
    }
  }

  .translate {
    transform: translateX(-100vw);
  }
}
</style>

