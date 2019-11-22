<template>
  <section class="picture-capture">
    <h2>Photo instantanée</h2>
    <div class="instructions">
      <h3>Instructions</h3>
      <p class="instruction">Gardez le visage centré.</p>
      <p class="instruction">La pancarte avec écrit MatriMonline doit être visible.</p>
      <p class="instruction">Restez naturel</p>
    </div>
    <span class="line"></span>
    <div class="container">
      <div class="app">
        <a
          id="start-camera"
          ref="startCam"
          href="#"
          class="visible"
        >Cliquez ici pour commencer à prendre votre photo.</a>
        <video id="camera-stream" ref="cStream"></video>
        <img id="snap" ref="snap" />

        <p id="error-message" ref="errorMessage"></p>

        <div ref="controls" class="controls">
          <a id="delete-photo" ref="deletePic" href="#" title="Delete Photo" class="disabled">
            <i class="fas fa-trash"></i>
          </a>
          <a id="take-photo" ref="takePic" href="#" title="Take Photo" @click="takePicture">
            <i class="fas fa-camera"></i>
          </a>
          <span id="download-photo" ref="downloadPic" class="disabled" @click="next">
            <!-- <a
            id="download-photo"
            ref="downloadPic"
            href="#"
            download="selfie.png"
            title="Save Photo"
            class="disabled"
            >-->
            <i class="fas fa-check"></i>
          </span>
          <!-- </a> -->
        </div>

        <!-- Hidden canvas element. Used for taking snapshot of video. -->
        <canvas></canvas>
      </div>
    </div>
    <nuxt-link to="/camExplications" class="btn_link blocked" target="_blank">Bloqué ?</nuxt-link>
  </section>
</template>
<script lang="js">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "PictureCapture",
  components: {
  }
})

class PictureCapture extends Vue {
  file = null
  id = null
  track = null
  modalData = {
    isModalVisible: false,
    isComponent: null
  };
  created(){
    this.id = this.$store.getters['user/getLoggedUser'].id
  }
  mounted() {
    const video = this.$refs.cStream;
    const image = this.$refs.snap;
    const start_camera = this.$refs.startCam;
    const controls = this.$refs.controls;
    // const take_photo_btn = this.$refs.takePic;
    const delete_photo_btn = this.$refs.deletePic;
    const download_photo_btn = this.$refs.downloadPic;
    const error_message = this.$refs.errorMessage;

    navigator.getMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;


    if (!navigator.getMedia) {
      displayErrorMessage(
        "Your browser doesn't have support for the navigator.getUserMedia interface."
      );
    } else {
      // Request the camera.
      navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then((stream) => {
          /* use the stream */
          // Create an object URL for the video stream and
          // set it as src of our HTLM video element.
          video.srcObject = stream;
          this.track = stream.getTracks()[0];  // if only one media track
          // Play the video element to start the stream.
          video.play();
          video.onplay = function() {
            showVideo();
          };
        })
        .catch(function(err) {
          /* handle the error */
          displayErrorMessage(
            "There was an error with accessing the camera stream: " + err.name,
            err
          );
        });
    }

    // Mobile browsers cannot play video without user input,
    // so here we're using a button to start it manually.
    start_camera.addEventListener("click", function(e) {
      e.preventDefault();
      // Start video playback manually.
      video.play();
      showVideo();
    });

    delete_photo_btn.addEventListener("click", function(e) {
      e.preventDefault();
      // Hide image.
      image.setAttribute("src", "");
      image.classList.remove("visible");
      // Disable delete and save buttons
      delete_photo_btn.classList.add("disabled");
      download_photo_btn.classList.add("disabled");
      // Resume playback of stream.
      video.play();
    });

    function showVideo() {
      // Display the video stream and the controls.
      hideUI();
      video.classList.add("visible");
      controls.classList.add("visible");
    }


    function displayErrorMessage(error_msg, error) {
      error = error || "";
      if (error) {
        console.log(error);
      }
      error_message.innerText = error_msg;
      hideUI();
      error_message.classList.add("visible");
    }

    function hideUI() {
      // Helper function for clearing the app UI.
      controls.classList.remove("visible");
      start_camera.classList.remove("visible");
      video.classList.remove("visible");
      image.classList.remove("visible");
      if(error_message){
        error_message.classList.remove("visible");
      }
    }
  }
  takeSnapshot() {
    const video = this.$refs.cStream
      // Here we're using a trick that involves a hidden canvas element.
      const hidden_canvas = document.querySelector("canvas");
      const context = hidden_canvas.getContext("2d");
      const width = video.videoWidth;
      const height = video.videoHeight;
      if (width && height) {
        // Setup a canvas with the same dimensions as the video.
        hidden_canvas.width = width;
        hidden_canvas.height = height;
        // Make a copy of the current frame in the video on the canvas.
        context.drawImage(video, 0, 0, width, height);
        // Turn the canvas image into a dataURL that can be used as a src for our photo.
        return hidden_canvas.toDataURL("image/png");
      }
    }
    dataURLtoBlob(dataurl) {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
   takePicture(e) {
      e.preventDefault();
      const video = this.$refs.cStream;
      const image = this.$refs.snap;
      const delete_photo_btn = this.$refs.deletePic;
      const download_photo_btn = this.$refs.downloadPic;
      const snap = this.takeSnapshot();
      const blob = this.dataURLtoBlob(snap);
      this.file = blob
      // Show image.
      image.setAttribute("src", snap);
      image.classList.add("visible");
      // Enable delete and save buttons
      delete_photo_btn.classList.remove("disabled");
      download_photo_btn.classList.remove("disabled");
      // Set the href attribute of the download button to the snap url.
      download_photo_btn.href = snap;
      // Pause video playback of stream.
      video.pause();
    }
  next(){
    const fd = new FormData();
    const name = this.file.type.split('/')
      fd.append("uploaderImgProfil", this.file, `profil-pic.${name[1]}`);
    this.$store.dispatch("user/updateImgProfilUser", {
        id: this.id,
        file: fd
      }).then(() => {
        this.track.stop()
        this.$parent.$emit('next')
      })
  }
}
export default PictureCapture;
</script>

<style lang="scss">
.picture-capture {
  width: 600px;
  margin: auto;
  margin-top: 0;
  color: white;
  .z-index {
    z-index: 1000;
  }
  .blocked {
    text-decoration: underline;
    cursor: pointer;
    color: white;
  }
  & h2 {
    font-size: 46px;
    letter-spacing: 1.8px;
    margin: 20px auto;
  }

  .instructions {
    padding-left: 40px;
    h3 {
      text-align: left;
      font-size: 20px;
      margin-bottom: 10px;
      text-transform: uppercase;
      text-decoration: underline;
    }
    .instruction {
      text-align: left;
    }
  }

  .container {
    max-width: 550px;
    margin: 30px auto 0 auto;
    padding: 20px;
    background-color: #efefef;

    background: linear-gradient(to right, white 4px, transparent 4px) 0 0,
      linear-gradient(to right, white 4px, transparent 4px) 0 100%,
      linear-gradient(to left, white 4px, transparent 4px) 100% 0,
      linear-gradient(to left, white 4px, transparent 4px) 100% 100%,
      linear-gradient(to bottom, white 4px, transparent 4px) 0 0,
      linear-gradient(to bottom, white 4px, transparent 4px) 100% 0,
      linear-gradient(to top, white 4px, transparent 4px) 0 100%,
      linear-gradient(to top, white 4px, transparent 4px) 100% 100%;

    background-repeat: no-repeat;
    background-size: 20px 20px;
  }

  .app {
    width: 100%;
    position: relative;
  }

  .app #start-camera {
    display: none;
    border-radius: 3px;
    max-width: 400px;
    color: #fff;
    background-color: #448aff;
    text-decoration: none;
    padding: 15px;
    opacity: 0.8;
    margin: 50px auto;
    text-align: center;
  }

  .app video#camera-stream {
    display: none;
    width: 100%;
  }

  .app img#snap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    display: none;
  }

  .app #error-message {
    width: 100%;
    background-color: #ccc;
    color: #9b9b9b;
    font-size: 28px;
    padding: 200px 100px;
    text-align: center;
    display: none;
  }

  .app .controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20;

    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 30px;
    display: none;
  }

  .app .controls a,
  .app .controls span {
    border-radius: 50%;
    color: #fff;
    background-color: #111;
    text-decoration: none;
    padding: 15px;
    line-height: 0;
    opacity: 0.7;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .app .controls a:hover,
  .app .controls span:hover {
    opacity: 1;
  }

  .app .controls a.disabled,
  .app .controls span.disabled {
    background-color: #555;
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }

  .app .controls a i,
  .app .controls span i {
    font-size: 18px;
  }

  .app .controls #take-photo i {
    font-size: 32px;
  }

  .app canvas {
    display: none;
  }

  .app video#camera-stream.visible,
  .app img#snap.visible,
  .app #error-message.visible {
    display: block;
  }

  .app .controls.visible {
    display: flex;
  }

  @media (max-width: 600px) {
    .container {
      margin: 40px;
    }

    .app #start-camera.visible {
      display: block;
    }

    .app .controls a i,
    .app .controls span i {
      font-size: 16px;
    }

    .app .controls #take-photo i {
      font-size: 24px;
    }
  }

  @media (max-width: 400px) {
    .container {
      margin: 10px;
    }

    .app #error-message {
      padding: 80px 50px;
      font-size: 18px;
    }

    .app .controls a i,
    .app .controls span i {
      font-size: 12px;
    }

    .app .controls #take-photo i {
      font-size: 18px;
    }
  }
}
</style>
