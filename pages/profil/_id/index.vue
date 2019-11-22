<template>
  <div v-if="user && answers.length === 39" class="profil">
    <FixedMenu />
    <section class="presentation">
      <section class="blured hide">
        <UserPicture
          :img="user.img"
          :name="user.name"
          :width="'100%'"
          :height="'100%'"
          :filter="'grayscale(1) blur(5px)'"
        />
        <section class="infos">
          <p class="top-info name">{{user.name}}</p>
          <p class="top-info">
            <i class="fas fa-birthday-cake"></i>
            {{user.age}} ans
          </p>
          <p class="top-info">
            <i class="fas fa-map-marker-alt"></i>
            {{user.cedex}}
          </p>
          <p class="top-info situation">
            <i class="fas fa-heart"></i>
            {{ user.situation.charAt(0).toUpperCase() + user.situation.slice(1)}}
          </p>
        </section>
      </section>
      <section class="hide-blur">
        <p class="pres">“ {{me.answer}} “</p>
      </section>
      <section class="picture">
        <p class="back" @click="back">
          <i class="fas fa-chevron-left"></i> Précédent
        </p>
        <UserPicture
          :img="user.img"
          :name="user.name"
          :width="'100%'"
          :height="'58%'"
          :filter="'grayscale(1)'"
          class="profil-picture"
        />
        <div class="quad">
          <UserPicture
            :img="user.img"
            :name="user.name"
            :width="'50%'"
            :height="'50%'"
            :filter="'grayscale(1)'"
            :color-filter="'green'"
          />
          <UserPicture
            :img="user.img"
            :name="user.name"
            :width="'50%'"
            :height="'50%'"
            :filter="'grayscale(1)'"
            :color-filter="'yellow'"
          />
          <UserPicture
            :img="user.img"
            :name="user.name"
            :width="'50%'"
            :height="'50%'"
            :filter="'grayscale(1)'"
            :color-filter="'blue'"
          />
          <UserPicture
            :img="user.img"
            :name="user.name"
            :width="'50%'"
            :height="'50%'"
            :filter="'grayscale(1)'"
            :color-filter="'red'"
          />
        </div>
        <section class="picture-infos mobile">
          <p class="top-info name">{{user.name}}</p>
          <p class="top-info">
            <i class="fas fa-birthday-cake"></i>
            {{user.age}} ans
          </p>
          <p class="top-info">
            <i class="fas fa-map-marker-alt"></i>
            {{user.cedex}}
          </p>
          <p class="top-info situation">
            <i class="fas fa-heart"></i>
            {{ user.situation.charAt(0).toUpperCase() + user.situation.slice(1)}}
          </p>
        </section>
      </section>
      <section class="quote mobile">
        <p class="pres">“ {{me.answer || '-'}} “</p>
      </section>
    </section>
    <section class="answers">
      <section class="left">
        <UserGroupAnswers class="personnality answer" :category="'Personnalité'" :answers="perso" />
        <UserGroupAnswers class="couple answer" :category="'Vision du couple'" :answers="couple" />
        <UserGroupAnswers
          class="interest answer"
          :category="`centres d'intérêts`"
          :answers="interest"
        />
      </section>
      <section class="right">
        <UserGroupAnswers class="reveal answer" :category="'Je me dévoile'" :answers="reveal" />
        <UserGroupAnswers
          class="about answer"
          :column="true"
          :category="'A propos de moi'"
          :answers="about"
        />
        <UserGroupAnswers
          class="lifestyle answer"
          :column="true"
          :category="'style de vie'"
          :answers="lifestyle"
        />
        <UserGroupAnswers
          class="physic answer"
          :column="true"
          :category="'allure'"
          :answers="physic"
        />
      </section>
    </section>
  </div>
  <div v-else-if="user" class="profil">Cet utilisateur n'as pas finis de compléter son profil</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import UserPicture from "@/components/profil/UserImg.vue";
import UserGroupAnswers from "@/components/profil/UserGroupAnswers.vue";
import FixedMenu from "@/components/profil/FixedMenu.vue";
@Component({
  name: "Profil",
  middleware: ["isLoggedIn", "getOneUser", "getPersonnalityAnswers"],
  components: { UserPicture, UserGroupAnswers, FixedMenu }
})
class Profil extends Vue {
  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }
  get loggedUser() {
    return this.$store.getters["user/getLoggedUser"];
  }
  get answers() {
    return this.$store.getters["personnality/getUserAnswers"];
  }

  get perso() {
    return this.answers.filter(answer => answer.category === "perso");
  }
  get me() {
    return this.answers.filter(answer => answer.category === "me")[0];
  }
  get reveal() {
    return this.answers.filter(answer => answer.category === "reveal");
  }
  get couple() {
    return this.answers.filter(answer => answer.category === "couple");
  }
  get about() {
    return this.answers.filter(answer => answer.category === "about");
  }
  get interest() {
    return this.answers.filter(answer => answer.category === "interest");
  }
  get lifestyle() {
    return this.answers.filter(answer => answer.category === "lifestyle");
  }
  get physic() {
    return this.answers.filter(answer => answer.category === "physic");
  }

  back() {
    window.history.back();
  }

  created() {}
}
export default Profil;
</script>

<style lang="scss">
.profil {
  font-family: "Quicksand";
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: rgba(211, 211, 211, 0.493);
  .presentation {
    height: calc(100vh - 91px);
    position: relative;
    font-family: "Quicksand";
    .blured {
      position: absolute;
      width: 100%;
      height: 60%;
      z-index: 2;
      display: flex;
      .blured-container {
        height: 100%;
      }
      .blured-pic {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(1) blur(4px);
      }
    }
    .hide-blur {
      background: rgb(211, 211, 211);
      position: absolute;
      height: calc(50% - 45.5px);
      width: 100%;
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 0;
      padding-left: calc(20% + 130px);
      .pres {
        width: 70%;
      }
    }
    .picture {
      width: 18%;
      min-width: 260px;
      margin-left: 10%;
      height: 80vh;
      .back {
        color: white;
        cursor: pointer;
        position: relative;
        z-index: 2;
        height: 60px;
        text-align: left;
        line-height: 60px;
        &:hover {
          text-decoration: underline;
        }
      }
      .quad {
        height: 35%;
        display: flex;
        flex-wrap: wrap;
      }
    }
    .infos {
      position: absolute;
      z-index: 2;
      color: white;
      top: 60px;
      left: calc(20% + 260px);
      text-align: left;
      .top-info {
        i {
          width: 20px;
        }
      }

      .name {
        font-size: 30px;
        margin-bottom: 10px;
        font-weight: bold;
        &::first-letter {
          text-transform: capitalize;
        }
      }
      .situation {
        i {
          color: red;
        }
        &::first-letter {
          text-transform: capitalize;
        }
      }
    }
  }
  .sub {
    margin-bottom: 2%;
  }
  .answers {
    min-height: 100vh;
    background: rgb(211, 211, 211);
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .answer {
      margin-bottom: 30px;
    }
    .left {
      width: 25%;
      min-width: 240px;
      padding-top: 5%;
    }
    .right {
      width: 55%;
      min-width: 320px;
    }
  }
  .mobile {
    display: none;
  }
}
@media screen and (min-width: 380px) and (max-width: $tablet - 1px) {
  .profil {
    height: 100%;
    .answers {
      .left {
        width: 80%;
        min-width: 320px;
      }
      .right {
        width: 80%;
      }
    }
    .presentation {
      .picture {
        width: 100%;
        margin-left: 0;
        height: 80% !important;
        position: relative;
        .quad {
          display: none;
        }
        .profil-picture {
          height: calc(100% - 60px) !important;
        }
        .picture-infos {
          position: absolute;
          bottom: 0;
          z-index: 3;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          height: 80px;
          background: rgba(0, 0, 0, 0.4);
          color: white;
          p {
            width: 33%;
            font-size: 20px;
          }
          .name {
            font-size: 30px;
            margin-bottom: 10px;
            width: 100%;
            font-weight: bold;
            &::first-letter {
              text-transform: capitalize;
            }
          }
        }
        .back {
          background: $blueGround;
          font-size: 25px;
          font-weight: bold;
        }
      }
      .quote {
        height: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
      }

      .situation {
        i {
          color: red;
        }
        &::first-letter {
          text-transform: capitalize;
        }
      }
    }
  }
  .blured,
  .hide-blur {
    display: none !important;
  }

  .presentation {
    background: rgb(211, 211, 211);
  }
  .mobile {
    display: block;
  }
}
@media screen and (max-width: 379px) {
  .profil {
    height: 100%;
    .answers {
      .left {
        width: 80%;
        min-width: 320px;
      }
      .right {
        width: 80%;
      }
    }
    .presentation {
      .picture {
        width: 100%;
        margin-left: 0;
        height: 80% !important;
        position: relative;
        .quad {
          display: none;
        }
        .profil-picture {
          height: calc(100% - 60px) !important;
        }
        .picture-infos {
          position: absolute;
          bottom: 0;
          z-index: 3;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          height: 120px;
          background: rgba(0, 0, 0, 0.4);
          color: white;
          p {
            width: 50%;
            font-size: 20px;
          }
          .name {
            font-size: 30px;
            margin-bottom: 10px;
            width: 100%;
            font-weight: bold;
            &::first-letter {
              text-transform: capitalize;
            }
          }
        }
        .back {
          background: $blueGround;
          font-size: 25px;
          font-weight: bold;
        }
      }
      .quote {
        height: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
      }

      .situation {
        i {
          color: red;
        }
        &::first-letter {
          text-transform: capitalize;
        }
      }
    }
  }
  .blured,
  .hide-blur {
    display: none !important;
  }

  .presentation {
    background: rgb(211, 211, 211);
  }
  .mobile {
    display: block;
  }
}
</style>

