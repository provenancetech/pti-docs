### Handle User Assessment

#### Create a user
```java
Person person = Person.builder().id(UUID.randomUUID().toString()).name(Name.builder().
	lastName("Doe").firstName("John").build()).build();

sdk.collectUserData().addAUser(OneOfUserSubTypes.person(person));
```

```curl
curl --location 'https://api.staging.fiant.io/v1/users' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{
    "id": "22232f61-91cc-4204-ab1e-1f308676f603",
    "type": "PERSON",
    "name": {
        "firstName": "John",
        "lastName": "Doe"
    }
}'
```

#### Start user Assessment
```java
Address address = Address.builder().streetAddress("123 Main St").city("Anytown").
  stateCode("US-NY").postalCode("12345").country("US").build();

Person personKyc = Person.builder().id(person.getId()).
  addresses(List.of(address)).dateOfBirth("2000-12-12").build();

StartUserAssessmentRequest startUserAssessmentRequest = StartUserAssessmentRequest.
  builder().ptiRequestId(UUID.randomUUID().toString()).ptiScenarioId("acme_deposit").
  body(KycRequest.person(personKyc)).build();

sdk.userAssessment().startUserAssessment(startUserAssessmentRequest);
```

```curl
curl --location --request POST 'https://api.staging.fiant.io/v1/users/assessments' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;' \
--data '{
    "id": "22232f61-91cc-4204-ab1e-1f308676f603",
    "type": "PERSON",
    "addresses": [
        {
            "streetAddress": "123 Main St",
            "city": "Anytown",
            "postalCode": "12345",
            "stateCode": "US-NY",
            "country": "US"
        }
    ],
    "dateOfBirth": "1988-09-28"
}'
```

#### Receive webhook
```json
{
    "resourceType":"USER_ASSESSMENT",
    "requestId":"8457ef90-22f7-4904-9085-df76ecbce59c",
    "clientId":"9857ef90-22f7-4904-9085-df76ecbce59c",
    "userId":"USER_ID",
    "status":"ACCEPTED",
    "tier": "1"  
}
```

#### Get Assessment status(Poll)
```java
sdk.userAssessment().startUserAssessment(startUserAssessmentRequest);

UserAssessStatusObject userAssessStatusObject = sdk.userAssessment().
  getLastKyc(person.getId());

userAssessStatusObject.getAssessment().get(); //Accepted
```

```curl
curl --location 'https://api.staging.fiant.io/v1//users/22232f61-91cc-4204-ab1e-1f308676f603/assessments' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;'
```