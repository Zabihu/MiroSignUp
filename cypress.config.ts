import { defineConfig } from "cypress";
const { GoogleSocialLogin } = require("cypress-social-logins").plugins;

export default defineConfig({
  experimentalModifyObstructiveThirdPartyCode: true,
  defaultCommandTimeout: 60000,
  responseTimeout: 60000,
  requestTimeout: 60000,
  e2e: {
    baseUrl: "https://miro.com/signup/",
    setupNodeEvents(on, config) {
      on("task", {
        GoogleSocialLogin: GoogleSocialLogin,
      });
    },
  },
});
