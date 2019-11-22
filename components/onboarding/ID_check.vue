<template>
  <section id="idCheck" ref="idCheck" class="idCheck" @scroll="handleScroll">
    <section class="intro-idcheck">
      <h2>VÉRIFIER VOTRE IDENTITÉ :</h2>
      <hr class="line-title">
      <article class="instructions">
        <h3>Instructions :</h3>
        <ul>
          <li>Vous devez <span v-if="clientWidth < 768">prendre en photo</span><span v-if="clientWidth > 768">télécharger une photo</span> (au choix) votre carte d’identité, votre passeport ou votre titre de séjour.</li>
          <li>Veuillez à ce que l’écriture soit claire et lisible.</li>
          <li>Toutes les informations de votre pièce d’identité doivent apparaître.</li>
          <li>Vos informations seront vérifiées dans un délai de 48h.</li>
          <li>Uniquement au format image (jpg, jpeg, png).</li>
        </ul>
      </article>
      <a ref="scroll_down" v-smooth-scroll="{ duration: 1000 }" href="#uploading" class="scroll-down-animation"><i class="fas fa-angle-double-down fa-2x"></i></a>
    </section>
    <section id="uploading" ref="uploading" class="uploading">
      <hr>
      <h3>S&eacute;l&eacute;ctionner un document :</h3>
      <section class="upload">
        <article class="choice_type">
          <input id="carte_identite" v-model="choice_type" type="radio" value="carte_identite"/>
          <label for="carte_identite" class="btn-border-white">Carte d’identité</label>
          <input id="passeport" v-model="choice_type" type="radio" value="passeport"/>
          <label for="passeport" class="btn-border-white">Passeport</label>
          <input id="titre_sejour" v-model="choice_type" type="radio" value="titre_sejour"/>
          <label for="titre_sejour" class="btn-border-white">Titre de séjour</label>
        </article>
        <article class="picture">
          <h4>Recto</h4>
          <div class="form">
            <i v-show="userPicture.imgData_recto === null" class="fas fa-camera fa-2x"></i>
            <i v-show="userPicture.imgData_recto != null" class="fas fa-check fa-2x" style="color:#1AD616"></i>
            <form
              id="uploader"
              ref="uploader"
              enctype="multipart/form-data"
              role="form"
              @submit="$event.preventDefault()"
            >
              <button v-show="userPicture.imgData_recto === null" class="photo" role="button" @click="$refs.upload_picture_recto.click()">Ajouter votre fichier</button>
              <figure
                ref="preview_BG_recto"
              >
                <img
                  v-show="userPicture.imgData_recto != null"
                  :src="userPicture.imgData_recto"
                  alt="identite_recto"
                >
              </figure>
              <button v-show="userPicture.imgData_recto != null" class="edit_file" @click="$refs.upload_picture_recto.click()">Modifier une photo</button>
              <input
                ref="upload_picture_recto"
                v-validate
                :data-vv-rules="
                  `mimes:${userPicture.mimes}|size:${userPicture.maxFilesize}`
                "
                type="file"
                name="upload_picture_recto"
                class="upload_picture"
                accept="image/png, image/jpeg, image/jpg"
                @change="
                  getLocalFiles(
                    $event.target.files[0] || $event.srcElement.files[0] || null, 'recto'
                  )
                "
              >
              <span class="error">{{ errors.first('upload_picture_recto') }}</span>
            </form>
          </div>
        </article>
        <article v-show="choice_type != 'passeport'" class="picture">
          <h4>Verso</h4>
          <div class="form">
            <i v-show="userPicture.imgData_verso === null" class="fas fa-camera fa-2x"></i>
            <i v-show="userPicture.imgData_verso != null" class="fas fa-check fa-2x" style="color:#1AD616"></i>
            <form
              id="uploader"
              ref="uploader"
              enctype="multipart/form-data"
              role="form"
              @submit="$event.preventDefault()"
            >
              <button v-show="userPicture.imgData_verso === null" class="photo" role="button" @click="$refs.upload_picture_verso.click()">Ajouter votre fichier</button>
              <figure
                ref="preview_BG_verso"
              >
                <img
                  v-show="userPicture.imgData_verso != null"
                  :src="userPicture.imgData_verso"
                  alt="identite_verso"
                >
              </figure>
              <button v-show="userPicture.imgData_verso != null" class="edit_file" @click="$refs.upload_picture_verso.click()">Modifier une photo</button>
              <input
                ref="upload_picture_verso"
                v-validate
                :data-vv-rules="
                  `mimes:${userPicture.mimes}|size:${userPicture.maxFilesize}`
                "
                type="file"
                name="upload_picture_verso"
                class="upload_picture"
                accept="image/png, image/jpeg, image/jpg"
                @change="
                  getLocalFiles(
                    $event.target.files[0] || $event.srcElement.files[0] || null, 'verso'
                  )
                "
              >
              <span class="error">{{ errors.first('upload_picture_verso') }}</span>
            </form>
          </div>
        </article>
        <span v-show="userPicture.errorRequired" class="error idCheck_error">{{ userPicture.errorRequired_message }}</span>
        <button class="pink_btn" @click="validate">Valider</button>
        <a v-show="false" ref="scroll_up" v-smooth-scroll="{ duration: 1000 }" href="#idCheck" class="scroll_up">cdscsdc</a>
      </section>
    </section>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

// defining types
type FileExtension = { errors: boolean; log: string[] };

interface HTMLElement {
  [key: string]: any;
}
// interface for input file
interface UserPicture {
  user_id: number | undefined;
  file_recto: File | null;
  file_verso: File | null;
  mimes: string[];
  maxFilesize: number;
  fd_recto: FormData | string | null;
  fd_verso: FormData | string | null;
  imgData_recto: string | null;
  imgData_verso: string | null;
  errorRequired: boolean;
  errorRequired_message: string | null;
}

@Component({
  name: "idCheck"
})
class IdCheck extends Vue {
  // initialising the object that file, mimes, message errors, image size and dimensions
  userPicture: UserPicture = {
    user_id: undefined,
    file_recto: null,
    file_verso: null,
    mimes: ["image/jpg", "image/png", "image/jpeg"],
    maxFilesize: 5120,
    fd_recto: null,
    fd_verso: null,
    imgData_recto: null,
    imgData_verso: null,
    errorRequired: false,
    errorRequired_message: "Veuillez télécharger une image avant de poursuivre."
  };
  clientWidth: number = 0;
  choice_type: string = "carte_identite";
  mounted () {
    this.userPicture.user_id = this.$store.getters["user/getLoggedUser"].id;
    this.clientWidth = document.documentElement.clientWidth
    if (this.clientWidth < 768) {
      window.addEventListener('scroll', this.handleScroll);
    }  
  }
  destroyed () {
    if (this.clientWidth < 768) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
  handleScroll() {
    if (this.$route.hash === "#idCheck" && window.scrollY < document.body.offsetHeight && window.scrollY > 50 ) {
      const scroll_down: any = this.$refs.scroll_down;
      scroll_down.click();
    }
    const uploading: any = this.$refs.uploading;
    if (this.$route.hash === "#uploading" && window.scrollY < uploading.offsetHeight) {
      const scroll_up: any = this.$refs.scroll_up;
      scroll_up.click();
    }
  }
  checkFileExtensions(file: File): FileExtension {
    let errors: number = 0;
    const log: string[] = [];
    if (!this.userPicture.mimes.includes(file.type)) {
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
  getLocalFiles(file: File, face: string): void {
    if(file){
      const check: FileExtension = this.checkFileExtensions(file);
      if (!check.errors) {
        this.userPicture.errorRequired = false;
        const fd = new FormData();
        console.log(file.name);
        if(face === 'recto') {
          this.userPicture.file_recto = file;
          fd.append("uploaderDocProfil", file, file.name);
          this.userPicture.fd_recto = fd;
          this.previewImage(this.userPicture.file_recto, face);
        }
        if(face === 'verso') {
          this.userPicture.file_verso = file;
          fd.append("uploaderDocProfil", file, file.name);
          this.userPicture.fd_verso = fd;
          this.previewImage(this.userPicture.file_verso, face);
        }
      } else {
        if(face === 'recto') {
          this.userPicture.fd_recto = "err";
        }
        if(face === 'verso') {
          this.userPicture.fd_verso = "err";
        }
      }
    }
  }
  previewImage(file: File, face: string): void {
    if(face === 'recto') {
      const preview_BG_recto: any = this.$refs.preview_BG_recto;
      if (file && file.size <= this.userPicture.maxFilesize * 1000) {
        preview_BG_recto.className = "preview";
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.userPicture.imgData_recto = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
    if(face === 'verso') {
      const preview_BG_verso: any = this.$refs.preview_BG_verso;
      if (file && file.size <= this.userPicture.maxFilesize * 1000) {
        preview_BG_verso.className = "preview";
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.userPicture.imgData_verso = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }
  reset(face: string): void {
    if(face === 'recto') {
      const upload_picture: HTMLElement = this.$refs.upload_picture_recto;
      upload_picture.value = "";
      this.userPicture.imgData_recto = null;
      console.log(this.userPicture.imgData_recto);
      this.userPicture.errorRequired = false;
    }
    if(face === 'verso') {
      const upload_picture: HTMLElement = this.$refs.upload_picture_verso;
      upload_picture.value = "";
      this.userPicture.imgData_verso = null;
      console.log(this.userPicture.imgData_verso);
      this.userPicture.errorRequired = false;
    }
  }
  validate(): void {
      const user = this.$store.getters["user/getLoggedUser"];
      if(this.choice_type !== "passeport" ){
        if (this.userPicture.imgData_recto == null || this.userPicture.imgData_verso == null) {
          this.userPicture.errorRequired = true;
          this.userPicture.errorRequired_message =
            "Veuillez télécharger vos photos avant de poursuivre.";
        } else {
          this.userPicture.errorRequired = false;
          this.$store.dispatch("certification/postIDcheckProfilUser", {
            id_user: this.userPicture.user_id,
            file: this.userPicture.fd_recto,
            id_certif: 7,
            doc_name: this.choice_type + '_recto',
            page: 'recto'
          });
          this.$store.dispatch("certification/postIDcheckProfilUser", {
            id_user: this.userPicture.user_id,
            file: this.userPicture.fd_verso,
            id_certif: 5,
            doc_name: this.choice_type + '_verso',
            page: 'verso'
          });
          this.$store.dispatch("notif/sendNewIDCheckNotif", {id: user.id, email: user.email, name: user.name, certif_type: 'IDCheck', docType: this.choice_type});
          this.$parent.$emit("next");
      }
    } else {
      console.log('test');
        if(this.userPicture.imgData_recto == null){
            this.userPicture.errorRequired = true;
            this.userPicture.errorRequired_message = "Veuillez télécharger vos photos avant de poursuivre.";
          } else {
            this.userPicture.errorRequired = false;
            console.log('else');
            this.$store.dispatch("certification/postIDcheckProfilUser", {
              id_user: this.userPicture.user_id,
              file: this.userPicture.fd_recto,
              id_certif: 7,
              doc_name: this.choice_type,
              page: 'recto'
            });
            this.$store.dispatch("notif/sendNewIDCheckNotif", {id: user.id, email: user.email, name: user.name, certif_type: 'IDCheck', docType: this.choice_type});
            this.$parent.$emit("next");
        }
    }
  }
}
export default IdCheck;
</script>

<style lang="scss">
@media screen and (min-width: $tablet) {
  .idCheck {
    width: 90%;
    height: 85%;
    margin: auto;
    max-width: $screen_max_width;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    & .intro-idcheck{
      & i {
        display: none;
      }
    }
    & h2{
      font-size: 30px;
      letter-spacing: 1.8px;
      margin-bottom: 15px;
    }
    & h3{
      color: #fff;
      font-family: $titleFont;
      font-weight: 700;
      letter-spacing: 1.8px;
      font-size: 20px;
      margin-bottom: 30px;
    }
    & hr{
      margin: 25px auto;
      width: 80%;
      border: 0;
      height: 1px;
      background: #ffffff61;
      background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 225, 255, 0.75), rgba(0, 0, 0, 0));
      &.line-title{
        display: none;
      }
    }
    & .idCheck_error {
      position: absolute;
      bottom: 15px;
      left: 0px;
      right: 0px;
    }
    & .form {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      & i {
        flex: 1;
      }
      & form {
        max-height: 160px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        flex: 2;
        padding: 0px 10px 5px 0px;
          .upload_picture {
            display: none;
          }
          // Apercu de l'image à uploader
          .preview {
            width: 60%;
            min-width: 150px;
            min-height: 100px;
            max-height: 100px;
            margin: 15px auto 0px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-content: center;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.5);
            img {
              max-height: 100%;
              max-width: 100%;
              align-self: center;
            }
          }
          .edit_file {
            background: none;
            border: none;
            color: #fff;
            text-decoration: underline;
            text-underline-position: under;
            font-family: $paragraphFont_Q;
            font-weight: 400;
          }
        }
    }
  }
  .btn-border-white {
    border: 2px solid #fff;
    background: none;
    color: #fff;
    border-radius: 10px;
    padding: 5px;
    text-align: center;
    font-family: $paragraphFont_Q;
    font-size: 23px;
    font-weight: 500;
    width: 100%;
    &:hover {
      color: $darkBlack;
      background: #fff;
    }
  }
  
  .upload {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    & .picture {
      border: 2px solid #fff;
      border-radius: 10px;
      overflow: hidden;
      text-align: center;
      align-self: stretch;
      width: 25%;
      max-width: 280px;
      & i {
        color: #fff;
        margin: 10px;
      }
      & h4{
        background: #fff;
        padding: 4px 2px 6px;
        font-family: $paragraphFont_Q;
        font-weight: 700;
        font-size: 18px;
      }
      & .photo {
        background: none;
        border: none;
        width: 60%;
        min-width: 150px;
        min-height: 100px;
        margin: 15px auto;
        position: relative;
        color: #fff;
        font-family: $paragraphFont_Q;
        font-weight: 500;
        margin-right: 10px;
        &::before {
          position: absolute;
          content: "";
          border: 5px solid #fff;
          top: 0px;
          left: 0px;
          right: 0px;
          bottom: 0px;
          border-radius: 18px;
          clip-path: polygon(0% 70%, 30% 70%, 30% 30%, 0% 30%, 0% 0%, 30% 0%, 30% 70%, 70% 70%, 70% 0%, 100% 0%, 100% 30%, 70% 30%, 70% 30%, 70% 70%, 100% 70%, 100% 100%, 70% 100%, 70% 70%, 30% 70%, 30% 100%, 0% 100%);
        }
      }
    }
  }
  .choice_type {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 230px;
    align-self: stretch;
    & input[type="radio"]:checked + label{
      color: #fff;
      border-color: $sweetPink;
      background: $sweetPink;
    }
  }
  .instructions {
    & ul {
      color: #fff;
      font-size: 16px;
      font-family: $paragraphFont_Q;
      & li {
        list-style-position: inside;
        margin-bottom: 5px;
      }
    }
  }
}
@media screen and (min-width: $phone) and (max-width: $tablet - 1px) {
  .idCheck {
    width: 100%;
    height: 100%;
    margin: auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    scroll-behavior: smooth;
    & .intro-idcheck{
      height: calc(100vh - 30px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      & i {
        color: #fff;
        transform: scaleX(1.2);
        margin-top: 15px;
      }
    }
    & .uploading{
      height: 100vh;
    }
    & h2{
      font-size: 24px;
      letter-spacing: 1.8px;
    }
    & h3{
      color: #fff;
      font-family: $titleFont;
      font-weight: 700;
      letter-spacing: 1.8px;
      font-size: 18px;
      margin-bottom: 30px;
    }
    & hr{
      margin: 16px auto;
      width: 60%;
      border: 0;
      height: 1px;
      background: #ffffff8f;
      background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 225, 255, 0.75), rgba(0, 0, 0, 0));
      &.line-title{
        display: block;
      }
    }
    & .form {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      & i {
        flex: 1;
      }
      & form {
        height: 160px;
        max-height: 160px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        flex: 2;
        padding: 5px 10px;
          .upload_picture {
            display: none;
          }
          // Apercu de l'image à uploader
          .preview {
            width: 60%;
            min-width: 130px;
            min-height: 100px;
            max-height: 100px;
            margin: 15px auto 0px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-content: center;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.5);
            img {
              max-height: 100%;
              max-width: 100%;
              align-self: center;
            }
          }
          .edit_file {
            background: none;
            border: none;
            color: #fff;
            text-decoration: underline;
            text-underline-position: under;
            font-family: $paragraphFont_Q;
            font-weight: 400;
          }
        }
    }
  }
  .btn-border-white {
    border: 2px solid #fff;
    background: none;
    color: #fff;
    border-radius: 10px;
    padding: 5px;
    font-family: $paragraphFont_Q;
    font-size: 23px;
    font-weight: 500;
    width: 100%;
    margin-bottom: 8px;
  &:hover {
      color: $darkBlack;
      background: #fff;
    }
  }
  input[type="radio"]:checked + label{
    color: #fff;
    border-color: $sweetPink;
    background: $sweetPink;
  }
  
  .upload {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    & .picture {
      border: 2px solid #fff;
      border-radius: 10px;
      overflow: hidden;
      text-align: center;
      width: 80%;
      min-width: 270px;
      margin-bottom: 15px;
      & i {
        color: #fff;
        margin: 10px;
      }
      & h4{
        background: #fff;
        padding: 4px 2px 6px;
        font-family: $paragraphFont_Q;
        font-weight: 700;
        font-size: 18px;
      }
      & .photo {
        background: none;
        border: none;
        width: 60%;
        min-width: 130px;
        min-height: 100px;
        position: relative;
        color: #fff;
        font-family: $paragraphFont_Q;
        font-weight: 500;
        align-self: center;
        &::before {
          position: absolute;
          content: "";
          border: 5px solid #fff;
          top: 0px;
          left: 0px;
          right: 0px;
          bottom: 0px;
          border-radius: 18px;
          clip-path: polygon(0% 70%, 30% 70%, 30% 30%, 0% 30%, 0% 0%, 30% 0%, 30% 70%, 70% 70%, 70% 0%, 100% 0%, 100% 30%, 70% 30%, 70% 30%, 70% 70%, 100% 70%, 100% 100%, 70% 100%, 70% 70%, 30% 70%, 30% 100%, 0% 100%);
        }
      }
    }
  }
  .choice_type {
    display: flex;
    flex-direction: column;
    width: 80%;
    min-width: 230px;
    margin-bottom: 15px;
  }
  .instructions {
    & ul {
      color: #fff;
      font-size: 16px;
      font-family: $paragraphFont_Q;
      text-align: left;
      margin-left: 1em;
      & li {
        margin-bottom: 20px;
      }
    }
  }
}
</style>

