import * as testData from "../fixtures/testData.json";

describe("Miro Sign Up Using Cypress Social Plugin", () => {
  //For information on this plugin, please refer https://www.npmjs.com/package/cypress-social-logins
  it("should be able to Signup with Google account", () => {
    // Google doesnt allow login through automation, sometimes 403 error page is shown, sometimes OTP is required.
    // Can achieve obtaining OTP through Mailslurp Premium Account. Hope Google doesnt show Captcha after entering OTP.
    const username = testData.registeredEmail1;
    const password = testData.registeredPassword1;
    const loginUrl = "https://miro.com/signup/";
    const cookieName = "abc";
    const socialLoginOptions = {
      username: username,
      password: password,
      loginUrl: loginUrl,
      headless: false,
      logs: false,
      preLoginSelector: "#kmq-google-button",
      loginSelector: "#tos-signup-terms",
    };

    return cy
      .task("GoogleSocialLogin", socialLoginOptions)
      .then(({ cookies }) => {
        cy.clearCookies();
        const cookie = cookies
          .filter((cookie) => cookie.name === cookieName)
          .pop();
        if (cookie) {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
          });
        }
      });
  });
});
