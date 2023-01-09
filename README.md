# Miro-SignUp

## Description
Test Automation Script for Miro Signup Page using Cypress V12 test framework and Typescript programming language.

Contains 3 spec files as mentioned below,

signup-email - Sign with new email account created using Mailslurp - Working

signup-plugin - Sign with social accounts using Cypress Social Plugin - Not working

signup-social - Sign with social accounts - Not working

##Approach

Signup via Direct Email :

Current Implementation - Create a New Email Address using Mailslurp every time and perform signup - Working

Future Implementation - Delete the Email Address in Miro Database and Use the same Email Address for Signup in next test run.


Signup via Social Account :

Current Implementaton1 - Sign up with social accounts using Cypress - Not working

Current Implementation2 - Sign up with social accounts using Cypress Social Plugin - Not working

Future Implementation - 
1. Get Client ID and Client Secret from Miro
2. Generate Refresh Token and Access Token
For more info, please refer below offical Cy doc
https://docs.cypress.io/guides/end-to-end-testing/google-authentication


## Installation
npm i

## Test Run Command
npx cypress open --env MAILSLURP_API_KEY=458f90ce8d787bcea4ce592a389fb3a6f45858647c88912b7e1dfea495009886

## Issues
Issues faced during development are described within the test script 

## Authors
Zabi

