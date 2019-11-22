<template>
  <section ref="document_uploader" class="document-uploader docUp-close-info">
    <modal v-show="modalData.isModalVisible" @close="closeModal">
      <template v-slot:body class="text-align-center">
        <p class="text-align-center">{{modalData.message}}</p>
      </template>
    </modal>
    <article ref="docUp_label" class="docUp-label label-white" tabindex="0" role="button" aria-pressed="false|true" @click="open_close_infos" @keydown.enter="open_close_infos" @keydown.space="open_close_infos">
     <h3>{{label}}</h3>
     <a v-if="certification_state === false" ref="open_close_info" class="fas fa-plus"></a>
     <span v-if="certification_state === true" class="certified">Certifé <i class="fas fa-check"></i></span>
    </article>
    <article v-if="certification_state === false" ref="info" class="wrapper open-info">
      <slot name="description" class="description">{{ description }}</slot>
      <!-- <form v-if="certif_id === '2'"
        id="linkedin_form"
        ref="linkedin_form"
        role="form"
        @submit="$event.preventDefault()">
        <label for="url_linkedin">Votre lien LinkedIn :</label>
        <input id="url_linkedin" name="url_linkedin" type="url"
        placeholder="https://fr.linkedin.com/in/monnom"
        pattern="https://fr.linkedin.com/in/.*" size="30"
        required
        />
        <button @click="submitLink">Envoyer votre lien</button>
        </form> -->
      <form v-if="formular === false" 
        id="uploader"
        ref="uploader"
        enctype="multipart/form-data"
        role="form"
        @submit="$event.preventDefault()">
        <button v-if="userDocument.file == null" class="btn_gold" @click="postUpload">T&eacute;l&eacute;charger votre document</button>
        <input
            ref="upload_document"
            v-validate
            :data-vv-rules="
              `mimes:${mimes}|size:${userDocument.maxFilesize}`
            "
            type="file"
            name="upload_document"
            class="upload_document"
            :accept="mimes"
            @change="
              getLocalFiles(
                $event.target.files[0] || $event.srcElement.files[0] || null
              )
            "
          >
          <span class="error">{{ errors.first('upload_document') }}</span>
        <p v-if="userDocument.file != null" class="docUp-inProgress-desc">Votre document a bien été envoyé. Il va être analysé par notre service client.</p>
        <span v-if="userDocument.file != null" class="docUp-inProgress">Envoyé</span>
        <div class="container">
          <button v-if="userDocument.file != null" class="edit_btn" @click="editUpload">modifier</button>
          <button v-if="userDocument.file != null" class="del_btn" @click="deleteUpload">supprimer</button>
        </div>
        <p>Formats acceptés : jpeg, jpg, png, pdf.</p>
      </form>
      <div v-if="formular === true">
        <div v-show="userDocument.statementSend === false" ref="formular">
          <hr>
          <p>Veuillez remplir l'attestation d'honneur ci-dessous et cocher la case pour confirmer la veracité de son contenu.</p>
          <h4>Attestation sur l'honneur</h4>
          <textarea v-model="userDocument.sworn_statement" v-validate="{ required: true, regex: textareaRegex }" name="sworn_statement" class="sworn_statement">
          </textarea>
          <span class="error">{{ errors.first('sworn_statement') }}</span>
          <span class="error">{{ errors.first('statement_confirmation') }}</span>
          <input id="statement_confirmation" ref="statement_confirmation" v-model="userDocument.statementCheck" v-validate="{ required: true }" name="statement_confirmation" type="checkbox">
          <label for="statement_confirmation">Je reconnais et confirme que les renseignements indiqu&eacute;s ci-dessus sont exacts.</label>
        </div>
        <button v-if="userDocument.statementSend === false" class="btn_gold" @click="sendStatement">Envoyez votre attestation</button>
        <p v-if="userDocument.statementSend === true" class="docUp-inProgress-desc">Votre document a bien été envoyé. Il va être analysé par notre service client.</p>
        <span v-if="userDocument.statementSend === true" class="docUp-inProgress">Envoyé</span>
        <div v-if="userDocument.statementSend === true" class="container">
          <button class="edit_btn" @click="editStatement">modifier</button>
        </div>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Modal from "@/components/Modal.vue";

// defining types
type FileExtension = { errors: boolean; log: string[] };

// interface for input email and password
interface modalData {
  isModalVisible: boolean | null;
  isComponent: string | null;
  message: string | null;
}

interface HTMLElement {
  [key: string]: any;
}
// interface for input file
interface UserDocument {
  file: File | string | null;
  old_file: string | null;
  maxFilesize: number;
  fd: FormData | string | null;
  sworn_statement: string | null;
  sworn_statement_F: string | null;
  sworn_statement_M: string | null;
  statementCheck: boolean | null;
  statementSend: boolean | null;
  methodUploadFile: string | null;
}
@Component({
  name: "document_uploader",
  components: {
    Modal
  }
})
class DocumentUploader extends Vue {
  @Prop() label: string | undefined;
  @Prop() description: any | undefined;
  @Prop() mimes: string[] | undefined;
  @Prop() doc_name: string | undefined;
  @Prop() formular: boolean | undefined;
  @Prop() certif_id: number | undefined;

  // RegExp that will be injected in veevalidate to verify if the password contains 240 characters or more with minimum 1 uppercase, 1 lowercase and 1 number
  textareaRegex: RegExp = new RegExp(
    "^([a-zÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿæœA-Z 0-9?$@()'!,+-_:.&€\\s/n/r\\R\\n]{10,})+$"
  );

  get user() {
    return this.$store.getters["user/getLoggedUser"];
  }
  get cetification_type() {
    return this.$store.getters['certification/getCertification_type'];
  }
  
  userDocument: UserDocument = {
    file: null,
    old_file: null,
    maxFilesize: 5120,
    fd: null,
    sworn_statement: "Nom : \nPrénom : \nDate de naissance : \nVille de naissance : \nDépartement de naissance : \nAdresse : \nC.P. Commune : \nAtteste sur l'honneur, vivre seul(e), être séparé(e) de mon ou ma conjoint(e) / compagne, être libre de tout engagement de vie commune. \nFait à \nLe ",
    sworn_statement_F: "Nom : \nPrénom : \nDate de naissance : \nVille de naissance : \nDépartement de naissance : \nAdresse : \nC.P. Commune : \nAtteste sur l'honneur, vivre seule, être séparée de mon conjoint / compagnon, être libre de tout engagement de vie commune. \nFait à \nLe ",
    sworn_statement_M: "Nom : \nPrénom : \nDate de naissance : \nVille de naissance : \nDépartement de naissance : \nAdresse : \nC.P. Commune : \nAtteste sur l'honneur, vivre seul, être séparé de ma conjointe / compagne, être libre de tout engagement de vie commune. \nFait à \nLe ",
    statementCheck: false,
    statementSend: false,
    methodUploadFile: 'post'
  };
  modalData: modalData = {
    isModalVisible: false,
    isComponent: null,
    message: null
  };
  certification_state: boolean = false;

  async created() {
    await this.$store.dispatch('certification/getCertification_state', {id_user: this.user.id, id_certif: this.$props.certif_id});
    this.certification_state = this.$store.getters["certification/getCertification_state"];
    await this.$store.dispatch('certification/checkFileExistence', {id_user: this.user.id, id_certif: this.$props.certif_id});
    this.userDocument.old_file = this.$store.getters["certification/getCertification_file"];
    this.userDocument.file = this.userDocument.old_file;
    if (this.user.situation === 'célibataire' && this.$props.certif_id === "1") {
      await this.$store.dispatch('certification/getStatementUser', {id_user: this.user.id, id_certif: this.$props.certif_id});
      const statement = this.$store.getters["certification/getCertification_statement"];
      if (statement != null) {
        this.userDocument.sworn_statement = statement;
        this.userDocument.statementSend = true;
      } else {
        if(this.user.sex === 'F') {
          this.userDocument.sworn_statement = this.userDocument.sworn_statement_F;
        }
        if (this.user.sex === 'M') {
          this.userDocument.sworn_statement = this.userDocument.sworn_statement_M;
        }
      }
    }
  }
  async uploadFile() {
    // Cherche le label de l'id de certification
    const certif_label = this.cetification_type.filter(certif => {
        return certif.id === Number(this.$props.certif_id)
      })[0].label;

    // Post upload
    if(this.userDocument.methodUploadFile === 'post'){
      await this.$store.dispatch("certification/postDocProfilUser", {
        id_user: this.user.id,
        id_certif: this.$props.certif_id,
        file: this.userDocument.fd,
        name: this.user.name,
        doc_name: this.$props.doc_name
      });
      this.$store.dispatch("notif/sendNewCertificationNotif", {id: this.user.id, email: this.user.email, name: this.user.name, certif_type: certif_label});
      this.userDocument.file = this.$store.getters["certification/getCertification_file"];
    } 
    if(this.userDocument.methodUploadFile === 'put') {
      await this.$store.dispatch("certification/updateDocProfilUser", {
        id_user: this.user.id,
        id_certif: this.$props.certif_id,
        file: this.userDocument.fd,
        name: this.user.name,
        doc_name: this.$props.doc_name,
        old_file: this.userDocument.old_file
      }).then(res=> {
        if(res.affectedRows === 0) {
          this.showModal("Une erreur est survenue. Veuillez réessayer.")
        } else {
          this.showModal("Votre fichier a bien été modifié.")
          this.userDocument.file = this.userDocument.old_file;
        }
      });
    }
  }
  postUpload() {
    this.userDocument.methodUploadFile = 'post';
    const inputFile: HTMLElement = this.$refs.upload_document;
    inputFile.click();
  }
  editUpload() {
    this.userDocument.methodUploadFile = 'put';
    const inputFile: HTMLElement = this.$refs.upload_document;
    inputFile.click();
  }
  async deleteUpload() {
    await this.$store.dispatch('certification/checkFileExistence', {id_user: this.user.id, id_certif: this.$props.certif_id});
    this.$store.dispatch('certification/deleteFileUploded', {
        id_user: this.user.id,
        id_certif: this.$props.certif_id,
        doc_name: this.$store.getters["certification/getCertification_file"]
      }).then(res => {
        if(res.affectedRows === 0) {
          this.showModal("Une erreur est survenue. Veuillez réessayer.")
        } else {
          this.showModal("Votre fichier à bien été supprimé.")
        }
      })
    this.reset();
    this.userDocument.file = null;
  }
  reset(): void {
    const upload_document: HTMLElement = this.$refs.upload_document;
    upload_document.value = "";
  }
  open_close_infos() {
    const info: HTMLElement = this.$refs.info;
    const open_close_info: HTMLElement = this.$refs.open_close_info;
    const document_uploader: HTMLElement = this.$refs.document_uploader;
    const docUp_label: HTMLElement = this.$refs.docUp_label;
    if (info && open_close_info) {
      if (info.classList.contains("open-info")) {
        info.classList.replace("open-info", "close-info");
        open_close_info.classList.replace("fa-plus", "fa-minus");
        document_uploader.classList.replace("docUp-close-info", "docUp-open-info");
        docUp_label.classList.replace("label-white", "label-pink");
      } else {
        info.classList.replace("close-info", "open-info");
        open_close_info.classList.replace("fa-minus","fa-plus");
        document_uploader.classList.replace("docUp-open-info", "docUp-close-info");
        docUp_label.classList.replace("label-pink", "label-white");
      }
    }
  }
  checkFileExtensions(file: File): FileExtension {
    let errors: number = 0;
    const log: string[] = [];
    if (!this.$props.mimes.includes(file.type)) {
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
    if(file) {
      const check: FileExtension = this.checkFileExtensions(file);
      if (!check.errors) {
        this.userDocument.file = file;
        const fd = new FormData();
        fd.append("uploaderDocProfil", file, file.name);
        this.userDocument.fd = fd
        this.uploadFile();
      } else {
        this.userDocument.fd = "err";
        this.reset();
      }
    }
  }
  sendStatement() {
    this.$validator.validateAll().then(result => {
      if (result) {
        if(this.userDocument.statementSend === false) {
          this.userDocument.statementSend = true;
        } else {
          this.userDocument.statementSend = false;
        }
        // checks if the certification is already posted before post or update
        this.$store
          .dispatch("certification/checkStatementExistence", {id_user: this.user.id,
                id_certif: this.$props.certif_id})
          .then(res => {
            if(res.length !== 0) {
              this.$store.dispatch("certification/updateStatementUser", {
                id_user: this.user.id,
                id_certif: this.$props.certif_id,
                sworn_statement: this.userDocument.sworn_statement
              }).then(res => {
                if(res.affectedRows === 0) {
                  this.showModal("Une erreur est survenue. Veuillez réessayer.")
                } else {
                  this.showModal("Votre fichier a bien été modifié.")
                }
              });
            } else {
              this.$store.dispatch("certification/postStatementUser", {
                id_user: this.user.id,
                id_certif: this.$props.certif_id,
                sworn_statement: this.userDocument.sworn_statement
              });
            }
          })
          .catch(err => {console.error(err)});
      } else {
        console.log('validate false', result);
      }
    });
  }
  editStatement() {
    this.userDocument.statementSend = false;
  }
  // submitLink() {
  //   console.log('submit link')
  // }
  showModal(message: string | null) {
    this.modalData.isModalVisible = true;
    this.modalData.message = message;
  }
  closeModal() {
    this.modalData.isModalVisible = false;
  }
}
export default DocumentUploader;
</script>

<style lang="scss">
.document-uploader {
  width: 100%;
  height: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  border-radius: 2px;
  overflow: hidden;
  & h4 {
    font-family: $titleFont;
    font-weight: 700;
    letter-spacing: 1.2px;
    font-size: 20px;
    margin: 15px auto 0px;
    border: 1px solid $sweetPink;
    border-bottom: none;
  }
  & p {
    font-family: $paragraphFont_Q;
  }
  &.docUp-open-info {
    transition: all 0.25s ease-in-out;
    // height: auto;
  }
  &.docUp-close-info {
    // height: auto;
  }
  .docUp-label {
    text-align: left;
    padding: 5px 15px;
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    cursor: pointer;
    & h3{
      font-family: $titleFont;
      font-weight: 700;
      font-size: 18px;
      letter-spacing: 1.4px;
      height: auto;
    }
    & a, & i, & .certified {
      margin-top: 2px;
    }
    & .certified {
      font-family: $paragraphFont_Q;
      font-weight: 700;
      color: $kakiGold;
    }
  }
  .label-pink {
    background: $sweetPink;
    color: #fff;
  }
  .label-white {
    background: #fff;
    color: $sweetPink;
  }
  .wrapper {
    transform-origin: top;
    transition: all 0.25s ease-in-out;
    background: #fff;
    padding: 5px 15px;
  }
  .upload_document{
    display: none;
  }
  .open-info{
    opacity: 0;
    visibility: hidden;
    transform: scaleY(0);
    height: 0;
    padding-top: 0;
    padding-bottom: 0;
    overflow: hidden;
    transition: all 0.25s ease-in-out;
  }
  .close-info{
    opacity: 1;
    visibility: visible;
    transform: scaleY(1);
    height: 100%;
  }
  .btn_gold, .docUp-inProgress {
    text-transform: uppercase;
    color: #fff;
    font-family: $btnFont;
    font-weight: 700;
    letter-spacing: 1.2px;
    padding: 10px 30px;
    margin: 10px auto;
  }
  .btn_gold {
    // outline: none;
    border: none;
    background: linear-gradient(to top, $darkBlack -80%, $kakiGold);
    display: block;
  }
  .docUp-inProgress {
    display: block;
    width: fit-content;
    background: $gray;
    color: #fff;
    margin-bottom: 0px;
  }
  .docUp-inProgress-desc {
    font-weight: 700;
  }
  .sworn_statement {
    resize: none;
    width: 100%;
    box-sizing: border-box;
    min-height: 260px;
    font-family: $paragraphFont_Q;
    font-weight: 700;
    font-size: 14px;
    line-height : 20px;
    border: 1px solid $sweetPink;
    background: rgba($blueGround, 0.15);
    scrollbar-color: #010005 transparent;
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      border-radius: 2px;
      background: rgba($darkBlack, 0.5);
      transition: all 0.5s ease-in-out; 
      &:hover {
        background: rgba($darkBlack, 1);
      }
    }
  }
}
</style>
