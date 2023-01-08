export class Login {
  email = "#email";
  name = "#name";
  password = "#password";
  signupTerms = "#signup-terms";
  code = "#code";
  welcomeHeader = ".welcome-screen-slide__header";
  setupTeamText = "Set up your team";

  clickButtonByText(buttonText: string, index = 0) {
    cy.get(`button:contains(${buttonText})`).eq(index).click({ force: true });
  }
  verifyMiroWelcomeHeaderText() {
    cy.get(this.welcomeHeader, {
      timeout: 30000,
    }).should("have.text", this.setupTeamText);
  }
  navigateToSocialLoginPage(provider: string) {
    if (provider == "Google") {
      cy.get(`button:contains("Sign up with ${provider}")`).click();
    } else {
      cy.get(`[alt="Sign up with ${provider}"]`).click();
    }
    cy.get("#tos-signup-terms").click({ force: true });
    cy.get(`button:contains("Continue to sign up")`).click();
  }
}
