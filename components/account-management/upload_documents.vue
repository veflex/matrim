<template>
  <section class="picture_uploader">
      <form
        id="uploader"
        ref="uploader"
        enctype="multipart/form-data"
        role="form"
        @submit="$event.preventDefault()"
      >
        <button v-if="userDocs.fd == null"
          class="upload_btn"
          role="button"
          @click="$refs.upload_docs.click()"
        >T&eacute;l&eacute;charger</button>
        <button v-if="userDocs.fd != null" class="edit_btn" @click="$refs.upload_docs.click()"><i class="far fa-edit"></i>modifier</button>
        <button v-if="userDocs.fd != null" class="del_btn" @click="reset"><i class="fas fa-trash-alt"></i>supprimer</button>
        <span class="format_accept">Formats accept&eacute;s : JPG/JPEG ou PNG</span>
        <input
          ref="upload_docs"
          v-validate
          :data-vv-rules="
            `mimes:${userDocs.mimes}|size:${userDocs.maxFilesize}`
          "
          type="file"
          name="upload_docs"
          class="upload_docs"
          accept="image/png, image/jpeg, image/jpg"
          @change="
            getLocalFiles(
              $event.target.files[0] || $event.srcElement.files[0] || null
            )
          "
        >
        <span class="error">{{ errors.first('upload_docs') }}</span>
        <span
          v-show="userDocs.errorRequired"
          class="error"
        >{{ userDocs.errorRequired_message }}</span>
      </form>
    <button id="validate_btn" class="validate_btn" @click="validate">Je valide</button>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
// eslint-disable-next-line
import { Validator } from "vee-validate";

// defining types
type FileExtension = { errors: boolean; log: string[] };

interface HTMLElement {
  [key: string]: any;
}
// interface for input file
interface UserDocs {
  user_id: number | undefined;
  file: File | null;
  mimes: string[];
  maxFilesize: number;
  fd: FormData | string | null;
  errorRequired: boolean;
  errorRequired_message: string | null;
}
@Component({
  name: "picture_uploader"
})
class Upload_documents extends Vue {
  // initialising the object that file, mimes, message errors, document size
  userDocs: UserDocs = {
    user_id: undefined,
    file: null,
    mimes: ["image/jpg", "image/png", "image/jpeg"],
    maxFilesize: 5120,
    fd: null,
    errorRequired: false,
    errorRequired_message: "Veuillez télécharger une image avant de poursuivre."
  };

  userSex: string | null = null;

  created() {
    this.userDocs.user_id = this.$store.getters["user/getLoggedUser"].id;
    this.userSex = this.$store.getters["user/getLoggedUser"].sex;
  }
  checkFileExtensions(file: File): FileExtension {
    let errors: number = 0;
    const log: string[] = [];
    if (!this.userDocs.mimes.includes(file.type)) {
      errors += 1;
      if (!log.includes(file.type)) {
        log.push(file.type);
      }
    }
    return {
      errors: errors !== 0,
      log: log
    };
  }
  getLocalFiles(file: File): void {
    const check: FileExtension = this.checkFileExtensions(file);
    if (!check.errors) {
      this.userDocs.errorRequired = false;
      this.userDocs.file = file;
      const fd = new FormData();
      fd.append("uploaderImgProfil", file, file.name);
      this.userDocs.fd = fd;
    } else {
      this.userDocs.fd = "err";
    }
  }
  reset(): void {
    const preview_BG: any = this.$refs.preview_BG;
    const upload_docs: HTMLElement = this.$refs.upload_docs;
    upload_docs.value = "";
    this.userDocs.file = null;
    this.userDocs.errorRequired = false;
    if (this.userSex === "M") {
      preview_BG.className = "preview pict_homme";
    } else {
      preview_BG.className = "preview pict_femme";
    }
  }
  validate(): void {
    if (this.userDocs.file == null) {
      this.userDocs.errorRequired = true;
      this.userDocs.errorRequired_message =
        "Veuillez télécharger une image avant de poursuivre.";
    } else {
      this.userDocs.errorRequired = false;
      this.$store.dispatch("user/updateImgProfilUser", {
        id: this.userDocs.user_id,
        file: this.userDocs.fd
      });
      this.$parent.$emit("next");
    }
  }
}
export default Upload_documents;
</script>

<style lang="scss">
// Decktop
@media screen and (min-width: $tablet) {
  .picture_uploader {
    height: 100%;
    width: 80%;
    margin: auto;
    // Ajustement du boutton validé
    & #validate_btn.validate_btn {
      margin: 46px auto 10px;
      display: block;
    }
    // Titre
    & h2 {
      font-family: $titleFont;
      font-size: 46px;
      font-weight: 700;
      text-transform: uppercase;
      color: $kakiGold;
      letter-spacing: 3.4px;
      margin: 20px auto 40px;
    }
    // Section d'encadrement
    section.profil_picture {
      width: 60vw;
      height: 60vh;
      min-height: 460px;
      min-width: 750px;
      max-width: 800px;
      padding: 10px;
      background: #fff;
      outline: 16px solid rgba($color: #fff, $alpha: 0.5);
      margin: auto;
      display: flex;
      flex-direction: row;
      // Bloc de texte pour les conseils
      & article.conseils {
        flex: 1 65%;
        padding-right: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-content: center;
        .scroll-down {
          display: none;
        }
        h3,
        p {
          width: 100%;
          float: left;
        }
        // Titre conseil
        h3 {
          font-size: 18px;
          font-family: $titleFont;
          font-weight: 700;
          letter-spacing: 3.6px;
          text-transform: uppercase;
          margin: 10px auto;
        }
        // Bloc de texte pour la marche à suivre avec icones
        .correct_tutorial {
          margin: 5px auto;
          width: 70%;
          max-width: 450px;
          min-width: 415px;
          ul {
            float: left;
            width: 50%;
            list-style: none;
            li {
              margin: 8px auto;
              text-align: left;
              display: flex;
              flex-wrap: nowrap;
              &:not(:first-child):before {
                content: "- ";
                padding-right: 5px;
              }
              &:first-child {
                color: $kakiGold;
                text-align: center;
                display: block;
              }
            }
          }
        }
      }
      p,
      li,
      span:not(.error) {
        font-family: $paragraphFont_Q;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.8px;
        line-height: 22px;
        width: 100%;
        display: block;
        text-align: justify;
        text-justify: inter-character;
        padding: 0 15px;
        // Phrase pour les formats acceptés
        &.format_accept {
          font-size: 12px;
          letter-spacing: 0.8px;
          margin: 0px auto;
          width: 100%;
          display: block;
          text-align: center;
          padding: 0;
        }
      }
      & form {
        flex: 1 35%;
        .upload_docs {
          display: none;
        }
        // Apercu de l'image à uploader
        .preview {
          width: 36vh;
          height: 38vh;
          min-width: 270px;
          min-height: 290px;
          overflow: hidden;
          margin: auto;
          display: flex;
          justify-content: center;
          align-content: center;
          border: 1px solid $kakiGold;
          img {
            max-height: 100%;
            max-width: 100%;
            align-self: center;
          }
        }
        .pict_homme {
          background-image: url($defaultProfile_PictureM);
          background-size: cover;
          filter: contrast(27%) brightness(150%);
        }
        .pict_femme {
          background-image: url($defaultProfile_PictureF);
          background-size: cover;
          filter: contrast(27%) brightness(150%);
        }
      }
    }
  }
}
// Mobile
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .picture_uploader {
    height: 100%;
    margin: auto;
    .validate_btn {
      margin-bottom: 10vh;
    }
    section.profil_picture {
      p,
      li,
      span:not(.error) {
        font-family: $paragraphFont_Q;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 1.2px;
        line-height: 18px;
        width: 100%;
        display: block;
        // Phrase pour les formats acceptés
        &.format_accept {
          width: 100%;
          display: block;
        }
      }
      & form {
        width: 80vw;
        height: 60vh;
        padding: 10px;
        margin: 15vh auto 16px;
        background: #fff;
        outline: 16px solid rgba($color: #fff, $alpha: 0.5);
        display: flex;
        flex-direction: column;
        .upload_docs {
          display: none;
        }
        // Apercu de l'image à uploader
        .preview {
          width: calc(36vh * 0.7628205128205128);
          height: calc(38vh* 0.7628205128205128);
          overflow: hidden;
          margin: auto;
          display: flex;
          justify-content: center;
          align-content: center;
          border: 1px solid $kakiGold;
          img {
            max-height: 100%;
            max-width: 100%;
            align-self: center;
          }
        }
        .pict_homme {
          background-image: url($defaultProfile_PictureM);
          background-size: cover;
          filter: contrast(27%) brightness(150%);
        }
        .pict_femme {
          background-image: url($defaultProfile_PictureF);
          background-size: cover;
          filter: contrast(27%) brightness(150%);
        }
      }
      // Bloc de texte pour les conseils
      & article.conseils {
        color: #fff;
        display: block;
        text-align: center;
        h3 {
          font-size: 18px;
          font-family: $titleFont;
          font-weight: 700;
          letter-spacing: 3.6px;
          text-transform: uppercase;
          margin: 10px auto;
          text-align: center;
        }
        p {
          margin: 10px auto;
          line-height: 22px;
        }
        // Bloc de texte pour la marche à suivre avec icones
        .correct_tutorial {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin: auto;
          width: 72%;
          min-width: 320px;
          max-width: 400px;
          ul {
            float: left;
            width: 50%;
            list-style: none;
            padding: 0 5px;
            text-align: left;
            li {
              margin: 8px auto;
              float: left;
              width: 100%;
              &:not(:first-child):before {
                content: "- ";
              }
              &:first-child {
                color: $kakiGold;
                text-align: center;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
