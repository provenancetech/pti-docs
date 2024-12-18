---
title: "Transaction Assessment"
slug: "transaction-monitoring"
excerpt: ""
hidden: false
createdAt: "Fri Dec 13 2024 14:10:24 GMT+0000 (Coordinated Universal Time)"
updatedAt: "Fri Dec 13 2024 14:10:26 GMT+0000 (Coordinated Universal Time)"
---
When you initiate financial transactions, this step is automatically run. However, you can also just ask for an assessment to see if it would pass our rules.

[Assess Transaction](https://fiant.readme.io/reference/assesstransaction)

```java
 DepositTransaction depositTransaction = DepositTransaction.builder().
   type(TransactionTypeEnum.DEPOSIT).usdValue(100).amount(100).
   date(new Date().toString()).initiator(initiator).
   destinationMethod(OneOfPaymentMethod.wallet(walletPaymentMethod)).
   sourceMethod(OneOfPaymentMethod.creditCard(CreditCardPaymentMethod.builder().
   paymentInformation(OneOfFiatPaymentInformation.
   encryptedCreditCard(EncryptedCreditCardPaymentInformation.builder().id("your_pi_id").
   build())).build())).build();

AssessTransactionRequest assessTransactionRequest = AssessTransactionRequest.builder().
	ptiRequestId(UUID.randomUUID().toString()).ptiScenarioId("acme_deposit").
  body(OneOfTransactionSubTypes.of(depositTransaction)).build();

sdk.transactionAssessment().assessTransaction(assessTransactionRequest);
```

<br />

Or simply ask if you would need to collect more information and run an assessment for your user.

[Validate Transaction](https://fiant.readme.io/reference/transactioninformationassessment)

```java
TransactionInformationAssessmentRequest transactionInformationAssessmentRequest = 
  TransactionInformationAssessmentRequest.builder().
  ptiRequestId(UUID.randomUUID().toString()).ptiScenarioId("acme_deposit").
  body(OneOfTransactionSubTypes.of(depositTransaction)).build();

MissingInformationError error = (MissingInformationError) sdk.transactionAssessment().
  transactionInformationAssessment(transactionInformationAssessmentRequest).get();
error.getFields(); // [{"FULL_NAME", "EMAIL_ADDRESS"}]
```
