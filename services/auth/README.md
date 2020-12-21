# @coffee-hmm/auth

An authentication microservice for [Coffee Hmm](https://coffee-hmm.inhibitor.io)

## Table of contents

- [API Documentation](#api_documentation)
  - [General](#general)
  - [User](#user)
  - [Policy](#policy)
- [Policy](#policy_doc)

<a name="api_documentation"></a>

## API Documentation

### Authorization

For endpoints not in [General](#general) section, an access token is needed to invoke the endpoint. The access token stores the core information about the user (user id, user policy, etc). Retrieve the access token using `GET /token`, then set the access token as **Bearer Token** at the header of HTTP request.

```
Authorization: Bearer <access token>
```

If access token is not provided or invalid, the endpoint will always throw `401 Unauthorized`.

<a name="general"></a>

## General

### `POST /register`

Creates an user with given profile.

**Required Rule**

```
(none)
```

**Query Parameters**

| **Name**   | **Type**     | **Required?** | **Description**                                                                                                                                                                                                      |
| ---------- | ------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id_token` | string (JWT) | yes           | This token will be used to verify and identify the user. By using `GET /token` endpoint, the user can retrieve an access token through the firebase identity **after** the user registered by calling this endpoint. |

**Request Example**

```
{
  "profile": {
    "name": "foo",
    "email": "foo@example.com"    // optional
  }
}
```

**Response Example**

```
{
  "user": {
    "id": "11111111-1111-1111-111111111111",
    "createdAt": "2020-01-01T00:00:00.000Z",
    "updatedAt": "2020-01-01T00:00:00.000Z",
    "lastSignedAt": "2020-01-01T00:00:00.000Z",           // nullable
    "userProfileId": "11111111-1111-1111-111111111111",
    "policyId": "11111111-1111-1111-111111111111",
    "state": "active",                                    // "active" | "deleted"
    "provider": "google",                                 // "google"
    "providerUserId": "<provider-id>"                     // a unique id from login provider.
    "providerUserEmail": "<provider-user-email>"          // nullable, an email address given by the login provider.
  }
}
```

### `GET /token`

Retrieve an access token, which the client can use for other services to access privileged API. The expiration time of given access token is 1 hour. The client should invoke this API again to refresh its access token.

**Required Rule**

```
(none)
```

**Query Parameters**

| **Name**   | **Type**     | **Required?** | **Description**                                                                                                                               |
| ---------- | ------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `id_token` | string (JWT) | yes           | This token will be used to verify and identify the user. The firebase user should have invoked `POST /register` endpoint to retrieve a token. |

**Request example**

```
(empty)
```

**Response example**

```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"    // This token is different with the firebase id token client provided
}
```

<a name="user"></a>

## User

### `GET /user/:userId`

Retrieve a general information about user.

**Required Rule**

```
{
  "operationType": "query",
  "operation": "*" | "auth.*" | "auth.user"
  "resource": "*" | userId
}
```

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "user": {
    "id": "11111111-1111-1111-111111111111",
    "createdAt": "2020-01-01T00:00:00.000Z",
    "updatedAt": "2020-01-01T00:00:00.000Z",
    "lastSignedAt": "2020-01-01T00:00:00.000Z",           // nullable
    "userProfileId": "11111111-1111-1111-111111111111",
    "policyId": "11111111-1111-1111-111111111111",
    "state": "active",                                    // "active" | "deleted"
    "provider": "google",                                 // "google"
    "providerUserId": "<provider-id>"                     // a unique id from login provider.
    "providerUserEmail": "<provider-user-email>"          // nullable, an email address given by the login provider.
  }
}
```

### `GET /user/count`

Retrieve how many users are registered to the service.

**Required Rule**

```
{
  "operationType": "query",
  "operation": "*" | "auth.*" | "auth.user"
  "resource": "*"
}
```

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "user": {
    "count": 42
  }
}
```

### `GET /user/list`

Retrieve a list of users registered to the service.

**Required Rule**

```
{
  "operationType": "query",
  "operation": "*" | "auth.*" | "auth.user"
  "resource": "*"
}
```

**Query Parameters**

| **Name**  | **Type**                                           | **Required?**                 | **Description**                                                                                                                                                                                                         |
| --------- | -------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `limit`   | `int`                                              | yes                           | Max number of items to retrieve by this query. Max value is 64.                                                                                                                                                         |
| `cursor`  | `string`                                           | no                            | If `cursor` is provided, this endpoint will fetch items after the item at `cursor`. Use `cursor` for pagination. Initially fetch list from this endpoint, then provide the cursor from last request to fetch next page. |
| `orderBy` | `"updatedAt"`, `"policy"`, `"provider"`, `"state"` | no (default is `"updatedAt"`) | Configures how the result will be sorted.                                                                                                                                                                               |
| `order`   | `"asc"`, `"desc"`                                  | no (default is `"asc"`)       | Configures how the result will be ordered. (`"asc"` meaning ascending and `"desc"` meaning descending)                                                                                                                  |

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "user": {
    "list": [
      {
        "id": "11111111-1111-1111-111111111111",
        "createdAt": "2020-01-01T00:00:00.000Z",
        "updatedAt": "2020-01-01T00:00:00.000Z",
        "lastSignedAt": "2020-01-01T00:00:00.000Z",           // nullable
        "userProfileId": "11111111-1111-1111-111111111111",
        "policyId": "11111111-1111-1111-111111111111",
        "state": "active",                                    // "active" | "deleted"
        "provider": "google",                                 // "google"
        "providerUserId": "<provider-id>"                     // a unique id from login provider.
        "providerUserEmail": "<provider-user-email>"          // nullable, an email address given by the login provider.
      }
    ]
  },
  "cursor": <cursor-string>                                   // set this as query parameter as query parameter to fetch next page
}
```

### `PUT /user/:userId/state`

Modifies the current state of given user.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "auth.*" | "auth.user"
  "resource": "*" | userId
}
```

**Request Example**

```
{
  "state": "deleted"            // "active" | "deleted"
}
```

**Response Example**

```
{
  "user": {
    "id": "11111111-1111-1111-111111111111",
    "createdAt": "2020-01-01T00:00:00.000Z",
    "updatedAt": "2020-01-01T00:00:00.000Z",
    "lastSignedAt": "2020-01-01T00:00:00.000Z",           // nullable
    "userProfileId": "11111111-1111-1111-111111111111",
    "policyId": "11111111-1111-1111-111111111111",
    "state": "deleted",                                   // "active" | "deleted"
    "provider": "google",                                 // "google"
    "providerUserId": "<provider-id>"                     // a unique id from login provider.
    "providerUserEmail": "<provider-user-email>"          // nullable, an email address given by the login provider.
  }
}
```

### `GET /user/:userId/profile`

Retrieves a profile of a user.

**Required Rule**

```
{
  "operationType": "query",
  "operation": "*" | "auth.*" | "auth.user.*" | "auth.user.profile"
  "resource": "*" | userId
}
```

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "user": {
    "profile": {
      "id": "11111111-1111-1111-111111111111",
      "createdAt": "2020-01-01T00:00:00.000Z",
      "updatedAt": "2020-01-01T00:00:00.000Z",
      "name": "inhibitor",
      "email": "foo@example.com"                  // nullable
    }
  }
}
```

### `PUT /user/:userId/profile`

Modifies the profile of given user.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "auth.*" | "auth.user.*" | "auth.user.profile"
  "resource": "*" | userId
}
```

**Request Example**

```
{
  "name": "inhibitor@new"                         // optional
  "email": "foofoo@example.com" | null            // optional, set to null to explicitly set profile.email to null
}
```

**Response Example**

```
{
  "user": {
    "profile": {
      "id": "11111111-1111-1111-111111111111",
      "createdAt": "2020-01-01T00:00:00.000Z",
      "updatedAt": "2020-01-01T00:00:00.000Z",
      "name": "inhibitor",
      "email": "foo@example.com"                  // nullable
    }
  }
}
```

### `GET /user/:userId/policy`

Retrieve the policy attached to given user.

**Required Rule**

```
{
  "operationType": "query",
  "operation": "*" | "auth.*" | "auth.user.*" | "auth.user.policy"
  "resource": "*" | userId
}
```

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "user": {
    "policy": {
      "id": "11111111-1111-1111-111111111111",
      "createdAt": "2020-01-01T00:00:00.000Z",
      "updatedAt": "2020-01-01T00:00:00.000Z",
      "name": "DefaultUserPolicy",
      "value": "{\"rules\":[{\"operationType\":\"query\",\"operation\":\"auth.*\",\"resource\":\"*\"}]}",
      "rules": [
        {
          "operationType": "query",
          "operation": "auth.*",
          "resource": "*"
        }
      ]
    }
  }
}
```

<a name="policy"></a>

## Policy

### `POST /policy`

Creates a new policy. The `value` field of the request must be a valid policy string.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "auth.*" | "auth.policy"
}
```

**Request Example**

```
{
  "name": "DefaultUserPolicy",
  "value": "{\"rules\":[{\"operationType\":\"query\",\"operation\":\"auth.*\",\"resource\":\"*\"}]}"
}
```

**Response Example**

```
{
  "policy": {
    "id": "11111111-1111-1111-111111111111",
    "createdAt": "2020-01-01T00:00:00.000Z",
    "updatedAt": "2020-01-01T00:00:00.000Z",
    "name": "DefaultUserPolicy",
    "value": "{\"rules\":[{\"operationType\":\"query\",\"operation\":\"auth.*\",\"resource\":\"*\"}]}",
    "rules": [
      {
        "operationType": "query",
        "operation": "auth.*",
        "resource": "*"
      }
    ]
  }
}
```

### `GET /policy/:policyId`

Retrieve a policy.

**Required Rule**

```
{
  "operationType": "query",
  "operation": "*" | "auth.*" | "auth.policy"
  "resource": "*" | policyId
}
```

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "policy": {
    "id": "11111111-1111-1111-111111111111",
    "createdAt": "2020-01-01T00:00:00.000Z",
    "updatedAt": "2020-01-01T00:00:00.000Z",
    "name": "DefaultUserPolicy",
    "value": "{\"rules\":[{\"operationType\":\"query\",\"operation\":\"auth.*\",\"resource\":\"*\"}]}",
    "rules": [
      {
        "operationType": "query",
        "operation": "auth.*",
        "resource": "*"
      }
    ]
  }
}
```

### `GET /policy/count`

Retrieves how many policies exist in this service.

**Required Rule**

```
{
  "operationType": "query",
  "operation": "*" | "auth.*" | "auth.policy"
  "resource": "*"
}
```

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "policy": {
    "count": 42
  }
}
```

### `GET /policy/list`

Retrieves a list of policies.

**Required Rule**

```
{
  "operationType": "query",
  "operation": "*" | "auth.*" | "auth.policy"
  "resource": "*"
}
```

**Query Parameters**

| **Name**  | **Type**                | **Required?**                 | **Description**                                                                                                                                                                                                         |
| --------- | ----------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `limit`   | `int`                   | yes                           | Max number of items to retrieve by this query. Max value is 64.                                                                                                                                                         |
| `cursor`  | `string`                | no                            | If `cursor` is provided, this endpoint will fetch items after the item at `cursor`. Use `cursor` for pagination. Initially fetch list from this endpoint, then provide the cursor from last request to fetch next page. |
| `orderBy` | `"updatedAt"`, `"name"` | no (default is `"updatedAt"`) | Configures how the result will be sorted.                                                                                                                                                                               |
| `order`   | `"asc"`, `"desc"`       | no (default is `"asc"`)       | Configures how the result will be ordered. (`"asc"` meaning ascending and `"desc"` meaning descending)                                                                                                                  |

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "policy": {
    "list": [
      "id": "11111111-1111-1111-111111111111",
      "createdAt": "2020-01-01T00:00:00.000Z",
      "updatedAt": "2020-01-01T00:00:00.000Z",
      "name": "DefaultUserPolicy",
      "value": "{\"rules\":[{\"operationType\":\"query\",\"operation\":\"auth.*\",\"resource\":\"*\"}]}",
      "rules": [
        {
          "operationType": "query",
          "operation": "auth.*",
          "resource": "*"
        }
      ]
    ]
  },
  "cursor": <cursor-string>    // set this as query parameter as query parameter to fetch next page
}
```

### `PUT /policy/:policyId`

Modify a policy using a policy string, or change its name.

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "auth.*" | "auth.policy"
  "resource": "*" | policyId
}
```

**Request Example**

```
{
  "name": "DefaultUserPolicy@New",              // optional
  "value": "{\"rules\":[{\"operationType\":\"query\",\"operation\":\"auth.*\",\"resource\":\"*\"}]}"                                             // optional
}
```

**Response Example**

```
{
  "policy": {
    "id": "11111111-1111-1111-111111111111",
    "createdAt": "2020-01-01T00:00:00.000Z",
    "updatedAt": "2020-01-01T00:00:00.000Z",
    "name": "DefaultUserPolicy@New",
    "value": "{\"rules\":[{\"operationType\":\"query\",\"operation\":\"auth.*\",\"resource\":\"*\"}]}",
    "rules": [
      {
        "operationType": "query",
        "operation": "auth.*",
        "resource": "*"
      }
    ]
  }
}
```

### `DELETE /policy/:policyId`

Delete a policy with given id. **There should be no users using this policy.**

**Required Rule**

```
{
  "operationType": "mutation",
  "operation": "*" | "auth.*" | "auth.policy"
  "resource": "*" | policyId
}
```

**Request Example**

```
(empty)
```

**Response Example**

```
{
  "policy": {
    "id": policyId
  }
}
```

<a name="policy_doc"></a>

## Policy

A policy is a definition of actions that a user can perform. A policy contains multiple rules, and a rule corresponds to single action (mostly implemented by a single endpoint). A policy can be attached to one or multiple users, and modifying such policy will affect all attached users.

A policy **object** is defined as follows.

```
{
  rules: [
    ...
    {
      operationType: "query" | "mutation",
      operation: <operation-name>,
      resource: "*" | <resource-id>
    }
    ...
  ]
}
```

- `operationType` field of a rule means if the operation is related to retrieval or mutation of certain data. Since most services are exposed by REST API, `GET` endpoints will require `operationType` of `query`. Likewise, `POST, PUT, DELETE` endpoints will require `operationType` of `mutation`.

- `operation` field specifies which operation the rule is granting permission of. Refer to each service's documentation to find which `operation` is required to invoke the endpoints..

- `resource` field is used to limit the permission to some resources which is _owned_ by a user: e.g. profiles, reviews, etc. For endpoints related to owned resources, in most cases `resource` field will be `"*" | ownerId`.

To define a policy specifically, serialize the policy object with format above using JSON format, then provide the serialized policy to appropriate API of `auth` service.
