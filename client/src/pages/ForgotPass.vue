<template>
  <div class="account-manager">
    <form @submit.prevent="sendResetPassword" class="form__forgotPass" method="POST">
      <div class="inputErrorContainer">
        <div class="inputErrorText"></div>
      </div>
      <div class="login-title">{{ $t("forgot.forgot-title") }}</div>
      <div
        class="subtitle__forgotPass"
      >{{ $t("forgot.forgot-help") }}</div>
      <input
        v-model="email"
        class="login-input"
        name="email"
        type="text"
        :placeholder="$t('forgot.email')"
        autocomplete="off"
      />
      <div class="submit">
        <input class="forgotPass-button" type="submit" value="Submit" />
      </div>
      <div v-if="message" class="successMessage">{{ message }}</div>
      <router-link class="accountExists__registerPage" to="/login">{{ $t("forgot.login-instead") }}</router-link>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ForgotPass",
  data() {
    return {
      email: "",
      message: ""
    };
  },
  methods: {
    async sendResetPassword() {
      try {
        await axios.post("/accounts/sendResetPass", { email: this.email });
        this.message =
          "A password reset link has been sent to the email address you entered.";
      } catch ({ response }) {
        this.mesage = response.data.message;
      }
    }
  }
};
</script>

<style>
/*! CSS Used from: https://www.eeter.tv/css/reset.css */
div,
a,
form {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/*! CSS Used from: https://www.eeter.tv/css/main.css */
* {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
input:focus {
  outline: none;
}
input {
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  border: none;
  border-radius: 0;
  background-color: #fff;
  font-family: "Trebuchet MS", sans-serif;
}
a {
  color: #333;
  text-decoration: none;
}
div {
  display: block;
}
/*! CSS Used from: https://www.eeter.tv/css/registration.css */
.forgotPass-button {
  height: 100%;
  background-color: transparent !important;
  color: #555 !important;
  border-radius: 40px;
  box-sizing: border-box;
  font-weight: 600;
  padding: 12px;
  font-size: 14px !important;
  cursor: pointer;
}
.forgotPass-button {
  color: #ffffff !important;
}
.form__forgotPass {
  margin: auto;
  width: 600px;
  text-align: center;
}
.form__forgotPass {
  margin-top: 150px;
}
.login-input {
  width: 200px;
  border-radius: 3px;
  border: 1px solid #eee;
  margin-right: 16px;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  width: 325px;
  padding: 15px !important;
  display: block !important;
  margin-bottom: 20px !important;
  font-size: 18px !important;
  box-shadow: 4px 5px 0px 0px #e6e6e6;
}
.login-input:focus {
  border-left: 3px solid black;
}
.forgotPass-button {
  width: 325px;
  font-size: 18px !important;
  transition: 0.2s ease-in-out !important;
  margin-top: 5px !important;
  padding: 10px !important;
  background-color: #120088 !important;
  box-shadow: 3px 3px 0px 0px #120088bf;
}
.forgotPass-button:hover {
  background-color: #100269 !important;
}
.login-title {
  font-size: 45px;
  text-align: left;
  width: 325px;
  margin: 0 auto;
  margin-bottom: 10px;
  color: #333;
  font-weight: 600;
}
.account-manager {
  background-color: #fff;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  flex-grow: 1;
}
.accountExists__registerPage {
  background-color: transparent;
  border: none;
  box-shadow: none;
  width: auto;
  padding: 0;
  font-size: 14px;
  color: #b1b1b1;
  margin-top: 20px;
  border-radius: 3px;
  display: inline-block;
  font-weight: 400;
  text-align: left;
  cursor: pointer;
  transition: 85ms ease;
}
.accountExists__registerPage:hover {
  text-decoration: underline;
  color: #ececec;
}
.subtitle__forgotPass {
  width: 325px;
  margin: 0 auto;
  text-align: left;
  font-size: 18px;
  margin-bottom: 30px;
  color: #666;
}
.inputErrorContainer {
  padding: 10px;
  color: red;
  background-color: transparent;
}
.successMessage {
  margin: 30px auto;
  font-size: 15px;
  max-width: 300px;
  color: #fff;
  background-color: #222;
  box-sizing: border-box;
  font-weight: 600;
  padding: 8px;
  border-radius: 3px;
  font-family: "Trebuchet MS", sans-serif;
}
</style>