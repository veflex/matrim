<template>
  <div class="get-mail">
    <section class="email">
      <input
        id="email"
        v-model="email"
        v-validate="'required|email|notAccount'"
        type="text"
        class="input"
        name="email"
        placeholder="Votre adresse email"
        data-vv-delay="1000"
        @change="sendInput"
      />
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Validator } from "vee-validate";

@Component({
  name: "GetMail"
})
class GetMail extends Vue {
  email = null;
  sendInput() {
    this.$validator.validateAll().then(res => {
      if (!res) {
        this.$emit("isEmailValid", {
          email: this.email,
          isEmailValid: false,
          errorMsg: this.$validator.errors.first("email")
        });
      } else {
        this.$emit("isEmailValid", {
          email: this.email,
          isEmailValid: true,
          errorMsg: ""
        });
      }
    });
    // this.$emit("input", this.email);
  }
  mounted() {
    const isEmailUnique = email => {
      return new Promise(resolve => {
        console.log("uiui");
        this.$store
          .dispatch("user/checkMailExistence", email)
          .then(res => {
            if (!res.valid) {
              console.log("ah nn nn");
              this.$emit("validMail");
            }
            return resolve(!res.valid);
          })
          .catch(err => console.error(err));
      });
    };

    // creating a new instance of veevalidator for our custom rule unique to check if a mail already exists
    const instance = new Validator();
    instance.extend("notAccount", {
      validate: isEmailUnique
    });
  }
}

export default GetMail;
</script>

<style>
input {
  color: black;
}
</style>
