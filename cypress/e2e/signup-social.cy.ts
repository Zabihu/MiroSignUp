import * as testData from "../fixtures/testData.json";
let email = testData.registeredEmail1;
let password = testData.registeredPassword1;
let args = { email, password };
import { Login } from "../support/login";
const login = new Login();

describe("Miro - Sign Up With Social Accounts", () => {
  /**
   * 1. Visit BaseURL and Accept Cookies
   * 2. Click on Google Signup button, Accept Terms & Click Continue
   * 3. Enter Email & Click Continue
   * 4. Enter Password & Click Continue
   * 5. Verify Welcome Header Text in Miro Website
   */
  // Google doesnt allow login through automation, sometimes 403 error page is shown, sometimes OTP is required.
  // Can achieve obtaining OTP through Mailslurp Premium Account. Hope Google doesnt show Captcha after entering OTP.
  it("should be able to Signup with Google account", () => {
    cy.visit("/");
    cy.get("#onetrust-accept-btn-handler").click();
    login.navigateToSocialLoginPage("Google");
    cy.origin("accounts.google.com", { args }, ({ email, password }) => {
      Cypress.on("uncaught:exception", (err, runnable) => {
        return false;
      });
      cy.get('[type="email"]').type(email);
      cy.get('button:contains("Volgende")').click();
      cy.get('[type="password"]').type(password);
      cy.get('button:contains("Volgende")').click();
    });
    login.verifyMiroWelcomeHeaderText();
  });

  it("should be able to Signup with Slack account", function () {
    /**
     * 1. Visit BaseURL and Accept Cookies
     * 2. Click on Slack Signup button, Accept Terms & Click Continue
     * 3. Enter Workspace URL & Click Sign In
     * 3. Enter Email & Click Continue
     * 4. Enter Verification Code & Click Continue
     */
    //APP NAVIGATION ISSUE : On Successful sign up manually through Slack, Miro welcome screen is not displayed instead system stays in Slack app screen
    //Slack requires Workspace URL to be entered first then the Email ID which has invite to the Workspace
    //For Gmail account, Verification code is getting sent, but not for Mailslurp account
    //The below code wont work as it uses Mailslurp account, leaving it here just to share the approach
    cy.session([Cypress.env("emailAddress"), Cypress.env("inboxID")], () => {
      cy.visit("/");
      cy.get("#onetrust-accept-btn-handler").click();
      login.navigateToSocialLoginPage("Slack");
      cy.origin(
        "slack.com",
        {
          args: {
            workspaceUrlSlack: testData.miroSlackWorkspaceURL,
          },
        },
        ({ workspaceUrlSlack }) => {
          Cypress.on("uncaught:exception", (err, runnable) => {
            return false;
          });
          cy.get("#onetrust-accept-btn-handler").click();
          cy.get("#domain").clear().type(workspaceUrlSlack);
          cy.get('button:contains("Continue")').click();
        }
      );
      cy.origin(
        testData.miroSlackWorkspaceURL,
        {
          args: {
            email: testData.registeredEmail2,
          },
        },
        ({ email }) => {
          cy.get('[type="email"]').type(email);
          cy.get('button:contains("Sign In With Email")').click();
          cy.wait(10000);
        }
      );
      cy.mailslurp().then((mailslurp) => {
        mailslurp
          .waitForLatestEmail("51e1d332-5cd5-4166-b530-6bb369d6124e", 30000)
          .then((email) => {
            Cypress.env("code", email.subject.match(/\d/g).join(""));
            console.log(Cypress.env("code"));
          });
      });
    });
  });

  it("should be able to Signup with Microsoft account", () => {
    /**
     * 1. Visit BaseURL and Accept Cookies
     * 2. Click on Microsoft Signup button, Accept Terms & Click Continue
     * 3. Enter Email & Click Next
     * 4. Enter Password & Click Sign In & Click Yes
     * 5. Verify Welcome Header Text in Miro Website
     */
    //Microsoft doesnt allow login through Automation as it simply redirects back to Miro signup page on successfull login
    const email = testData.registeredEmail2;
    const password = testData.registeredPassword2;
    const args = { email, password };
    cy.visit("/");
    cy.get("#onetrust-accept-btn-handler").click();
    login.navigateToSocialLoginPage("Office 365");
    cy.origin("login.microsoftonline.com", { args }, ({ email, password }) => {
      Cypress.on("uncaught:exception", (err, runnable) => {
        return false;
      });
      cy.get('[type="email"]').type(email);
      cy.get('[value="Next"]').click();
    });
    cy.origin("login.live.com", { args }, ({ email, password }) => {
      Cypress.on("uncaught:exception", (err, runnable) => {
        return false;
      });
      cy.get('[type="password"]').type(password);
      cy.get('[value="Sign in"]').click();
      cy.get('[value="Yes"]').click();
      cy.wait(10000);
    });
    login.verifyMiroWelcomeHeaderText();
  });
});
