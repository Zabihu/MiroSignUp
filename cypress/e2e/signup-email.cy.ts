import { faker } from "@faker-js/faker";
import { Login } from "../support/login";
import * as testData from "../fixtures/testData.json";
const login = new Login();

//npx cypress open --env MAILSLURP_API_KEY=458f90ce8d787bcea4ce592a389fb3a6f45858647c88912b7e1dfea495009886
describe("Miro - Sign Up With Email Account", () => {
  context("Sign Up With New Email", () => {
    beforeEach(function () {
      cy.visit("https://miro.com/signup/");
      cy.get("#onetrust-accept-btn-handler").click(); //Accept Cookies
      return cy
        .mailslurp()
        .then((mailslurp) => mailslurp.createInbox())
        .then((inbox) => {
          cy.wrap(inbox.id).as("inboxId");
          cy.wrap(inbox.emailAddress).as("emailAddress");
        });
    });
    /**
     * 1. Create New Email Address using Mailslurp
     * 2. Enter Email & Click Continue
     * 3. Enter the randomly generated Name Using Faker & Click Continue
     * 3. Enter the randomly generated Password Using Faker & Click Continue
     * 5. Accept Terms & Click Continue
     * 6. Extract Confirmation Code from Email Subject using Regex
     * 7. Enter Confirmation Code
     * 8. Verify Welcome Screen Header Text
     */
    it("should be able to signup with Confirmation Code", function () {
      cy.get(login.email).type(this.emailAddress);
      cy.clickButtonByText("Continue");
      cy.get(login.name).type(faker.internet.userName());
      cy.clickButtonByText("Continue");
      cy.get(login.password).type(faker.internet.password());
      cy.get(login.signupTerms).click({ force: true });
      cy.clickButtonByText("Continue");
      cy.mailslurp().then((mailslurp) =>
        mailslurp.waitForLatestEmail(this.inboxId, 30000).then((email) => {
          Cypress.env("code", email.subject.match(/\d/g).join(""));
          cy.get(login.code).type(Cypress.env("code"));
          login.verifyMiroWelcomeHeaderText();
        })
      );
    });
    /**
     * 1. Create New Email Address using Mailslurp
     * 2. Enter Email & Click Continue
     * 3. Enter the randomly generated Name Using Faker & Click Continue
     * 3. Enter the randomly generated Password Using Faker & Click Continue
     * 5. Accept Terms & Click Continue
     * 6. Extract Confirmation Link from Email
     * 7. Visit Confirmation Link
     * 8. Verify Welcome Screen Header Text
     */
    it("should be able to signup with Confirmation Link", function () {
      cy.get(login.email).type(this.emailAddress);
      cy.clickButtonByText("Continue");
      cy.get(login.name).type(faker.internet.userName());
      cy.clickButtonByText("Continue");
      cy.get(login.password).type(faker.internet.password());
      cy.get(login.signupTerms).click({ force: true });
      cy.clickButtonByText("Continue");
      cy.mailslurp().then(async (mailslurp) => {
        await mailslurp
          .waitForLatestEmail(this.inboxId, 30000)
          .then(async (email) => {
            await mailslurp.emailController
              .getEmailLinks({ emailId: email.id })
              .then(async (linksResult) => {
                cy.visit(linksResult.links[0]).then(() => {
                  login.verifyMiroWelcomeHeaderText();
                });
              });
          });
      });
    });
  });

  //APPLICATION ISSUE : On entering Registered Email, sometimes Password screen is displayed, sometimes Name screen is displayed.
  //Either one of the it blocks will work as the application behaves differently each time.
  context("Sign Up With Registered Email", () => {
    beforeEach(function () {
      cy.visit("https://miro.com/signup/");
      cy.get("#onetrust-accept-btn-handler").click(); //Accept Cookies
    });
    /**
     * 1. Enter Registered Email & Click Continue
     * 2. Enter the randomly generated Name Using Faker & Click Continue
     * 3. Enter the randomly generated Password Using Faker & Click Continue
     * 5. Accept Terms & Click Continue
     * 6. Verify the error
     */
    it("should not be able to sign up with Registered email", function () {
      cy.get(login.email).type(testData.registeredEmail1);
      cy.clickButtonByText("Continue");
      cy.get(login.name).type(faker.internet.userName());
      cy.clickButtonByText("Continue");
      cy.get(login.password).type(testData.registeredPassword1);
      cy.get(login.signupTerms).click({ force: true });
      cy.clickButtonByText("Continue");
      cy.get("#emailError").should(
        "have.text",
        "Sorry, this email is already registered"
      );
    });

    /**
     * 1. Enter the Registered Email & Click Continue
     * 2. Enter the Password & Click Sign In
     * 3. Verify Miro Welcome Screen Header Text
     */
    it("should redirect to Sign In page for Registered email", function () {
      cy.get(login.email).type(testData.registeredEmail1);
      cy.clickButtonByText("Continue");
      cy.get(login.password).should("be.visible");
      cy.get(login.password, { timeout: 5000 }).type(
        testData.registeredPassword1
      );
      cy.clickButtonByText("Sign in");
      login.verifyMiroWelcomeHeaderText();
    });
  });
});
