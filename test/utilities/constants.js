const environment = process.env.SF_ENV; // Get the environment variable value
let exportedConstants;

switch (environment) {
  case 'prod':
    exportedConstants = {
      CONTROL_ORG: `AppOps QA 15`,
      CANVAS_IFRAME_TITLE: 'Canvas IFrame for application Prodly.',
      IFRAME_TITLE: 'Prodly',
      DATASET_VIEW_LINK: 'https://appopsqa15.my.salesforce.com/lightning/r/PDRI__DataSet__c/',
      DATASET_TAB_LINK: 'https://appopsqa15.my.salesforce.com/lightning/o/PDRI__DataSet__c/list',
      PLAN_VIEW_LINK: 'https://appopsqa15.my.salesforce.com/lightning/r/PDRI__Deployment_Plan__c/',
      PLAN_TAB_LINK: 'https://appopsqa15.my.salesforce.com/lightning/o/PDRI__Deployment_Plan__c/list',
      SB1_URL: 'https://appopsqa15--SB1.sandbox.my.salesforce.com',
      SB2_URL: 'https://appopsqa15--SB2.sandbox.my.salesforce.com',
      SB3_URL: 'https://appopsqa15--sb3.sandbox.my.salesforce.com',
      SB4_URL: 'https://appopsqa15--sb4.sandbox.my.salesforce.com',
      VERIFY_S1_URL_ED: 'appopsqa15--SB1.sandbox.my.salesforce.com'
    }
    break;
  case 'qa-4':
    // QA4 Specific const
    exportedConstants = {
      CONTROL_ORG: `AppOps QA 4`,
      DATASET_VIEW_LINK: 'https://appopsqa4.my.salesforce.com/lightning/r/PDRI__DataSet__c/a054x00000BdiLyAAJ/view',
      DATASET_TAB_LINK: 'https://appopsqa4.my.salesforce.com/lightning/o/PDRI__DataSet__c/list',
      PLAN_VIEW_LINK: 'https://appopsqa4.my.salesforce.com/lightning/r/PDRI__Deployment_Plan__c/a0H4x00000fD9OGEA0/view',
      PLAN_TAB_LINK: 'https://appopsqa4.my.salesforce.com/lightning/o/PDRI__Deployment_Plan__c/list',
      CANVAS_IFRAME_TITLE: 'Canvas IFrame for application Prodly QA4.',
      IFRAME_TITLE: 'Prodly QA4',
      SB1_URL: 'https://appopsqa4--SB1.sandbox.my.salesforce.com',
      SB2_URL: 'https://appopsqa4--SB2.sandbox.my.salesforce.com',
      SB3_URL: 'https://appopsqa4--sb3.sandbox.my.salesforce.com',
      SB4_URL: 'https://appopsqa4--sb4.sandbox.my.salesforce.com',
      VERIFY_S1_URL_ED: 'appopsqa4--SB1.sandbox.my.salesforce.com'
    }
    break;
  default:
    console.log('No environment found');
    exit(1);
    break;
}
export const { CONTROL_ORG, DATASET_VIEW_LINK, DATASET_TAB_LINK, PLAN_VIEW_LINK, PLAN_TAB_LINK, IFRAME_TITLE, CANVAS_IFRAME_TITLE, VERIFY_S1_URL_ED, SB1_URL, SB2_URL, SB3_URL, SB4_URL } = exportedConstants;
export const DATASET = `Automation Dataset`
export const DEPLOYMENTPLAN = `Automation Deployment Plan`
export const CHECKIN_LAUNCHED_MESSAGE = 'Checkin launched'