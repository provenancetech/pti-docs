### Manage your users

#### Add your user to the system
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

#### Add user informations
```java
Person personUpdate = Person.builder().id(person.getId()).addresses(
  List.of(address)).dateOfBirth("2000-12-12").build();
sdk.collectUserData().mergeUserInfo(OneOfUserSubTypes.person(personUpdate));
```

```curl
curl --location --request PATCH 'https://api.staging.fiant.io/v1/users' \
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

#### Get your user
```java
sdk.collectUserData().getUser(person.getId());
```

```curl
curl --location 'https://api.staging.fiant.io/v1/users/22232f61-91cc-4204-ab1e-1f308676f603' \
--header 'x-pti-client-id: 9857ef90-22f7-4904-9085-df76ecbce59c' \
--header 'Accept: application/json' \
--header 'Date;' \
--header 'x-pti-signature;'
```