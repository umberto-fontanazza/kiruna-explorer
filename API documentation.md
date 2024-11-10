# Kiruna eXplorer API Documentation

# Index

1. [Base URL](#base-url)
2. Collections  
   2.1. [Collection `documents`](#collection-documents)  
   2.2. [Collection `links`](#collection-links)  
   2.3. [Collection `sessions`](#collection-sessions)  
   2.4. [Collection `users`](#collection-users)

<br/>

# Base URL

The base URL for all API requests is:

`http://localhost:3000`

<br/>

# Collection `documents`

A collection of documents representing key nodes in the relocation process of Kiruna. Each document corresponds to agreements, conflicts, consultations, material effects, or other documents that directly influence the project. Documents are categorized by type, including informative, prescriptive, and original resources, and are connected through a network of direct and collateral consequences, projections, and updates.

### Supported requests

- [GET `/documents`](#get-documents)
- [GET `/documents/{id}`](#get-documentsid)
- [POST `/documents`](#post-documents)
- [PATCH `/documents/{id}`](#patch-documentsid)
- [DELETE `/documents/{id}`](#delete-documentsid)

## GET `/documents`

Retrieve all documents.

### Query parameters

TODO: filters

### Response body

```json
[
    {
        "id": 1,
        "title": "Kiruna plan",
        "description": "Document of Kiruna plan",
        "type": "informative",
        "scale": {
          "type": "RATEO",
          "rateo": 8000
        },
        "stakeholders": ["lkab", "kiruna_kommun"],
        "coordinates": {
          "latitude": 67.85624725739333,
          "longitude": 20.23857657264496
        },
        "issuanceDate": "2024-11-08T19:55:00+01:00",
        "links": [
            {
                "targetDocumentId": 2,
                "linkTypes": ["direct", "update"]
            },
            ...
        ]
    },
    ...
]
```

### Success status

- `200 Ok`

### Errors

This API can return the following error codes:

- `401 Unauthorized`: You are unauthorized.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## GET `/documents/{id}`

Retrieve a specific document by its unique identifier.

### Response body

```json
{
    "id": 1,
    "title": "Kiruna plan",
    "description": "Document of Kiruna plan",
    "type": "informative",
    "scale": {
      "type": "RATEO",
      "rateo": 8000
    },
    "stakeholders": ["lkab", "kiruna_kommun"],
    "coordinates": {
      "latitude": 67.85624725739333,
      "longitude": 20.23857657264496
    },
    "issuanceDate": "2024-11-08T19:55:00+01:00",
    "links": [
        {
            "targetDocumentId": 2,
            "linkTypes": ["direct", "update"]
        },
        ...
    ]
}
```

### Success status

- `200 Ok`

### Errors

This API can return the following error codes:

- `401 Unauthorized`: You are unauthorized.
- `404 Not Found`: The requested document was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## POST `/documents`

Create a new document.

### Request parameters

| **Parameter**           | **Description**                                                                    | **Type**            | **Required**                   |
| ----------------------- | ---------------------------------------------------------------------------------- | ------------------- | ------------------------------ |
| `title`                 | The title of the document                                                          | `string`            | Yes                            |
| `description`           | A brief description of the document                                                | `string`            | Yes                            |
| `type`                  | Type of the document                                                               | `string`            | Yes                            |
| `scale`                 | Relation between the real object and its size on a map                             | `object`            | Yes                            |
| `scale.type`            | Type of the scale                                                                  | `string`            | Yes                            |
| `scale.rateo`           | The numeric value representing the right side of the scale (e.g., 8000 for 1:8000) | `number`            | Yes if `scale` is "RATEO"      |
| `stakeholders`          | Array of stakeholders involved with the document                                   | `array` of `string` | No                             |
| `coordinates`           | Object containing geographical data                                                | `object`            | No                             |
| `coordinates.latitude`  | Value in the range [-90, +90] degrees                                              | `number`            | Yes if `longitude` is provided |
| `coordinates.longitude` | Value in the range [-180, +180] degrees                                            | `number`            | Yes if `latitude` is provided  |
| `issuanceDate`          | Issuance date of the document                                                      | `string`            | No                             |

### Request body

```json
{
  "title": "Kiruna plan",
  "description": "Document of Kiruna plan",
  "type": "informative",
  "scale": {
    "type": "RATEO",
    "rateo": 8000
  },
  "stakeholders": ["lkab", "kiruna_kommun"],
  "coordinates": {
    "latitude": 67.85624725739333,
    "longitude": 20.23857657264496
  },
  "issuanceDate": "2024-11-08T19:55:00+01:00"
}
```

### Response body

```json
{
  "id": 1
}
```

### Success status

- `201 Created`

### Errors

This API uses the following error codes:

- `400 Bad Request`: The request was malformed or missing required parameters.
- `401 Unauthorized`: You are unauthorized.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## PATCH `/documents/{id}`

Update an existing document by its unique identifier.

### Parameters

All parameters of [`POST /documents`](#post-documents) are accepted but they are all optional. Also relations between `scale` - `scaleValue` and `coordinates` - `latitude` - `longitude` remain the same.

### Request body

```json
{
  "description": "A new and improved description",
  "type": "design"
}
```

### Success status

- `204 No content`

### Errors

This API uses the following error codes:

- `400 Bad Request`: The request was malformed or missing required parameters.
- `401 Unauthorized`: You are unauthorized.
- `404 Not Found`: The requested document was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## DELETE `/documents/{id}`

Delete an existing document by its unique identifier and all its links.

### Success status

- `204 No content`

### Errors

This API uses the following error codes:

- `401 Unauthorized`: You are unauthorized.
- `404 Not Found`: The requested document was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

<br/>

# Collection `links`

A collection of links representing relationships between documents, serving as a sub-collection within the `documents` collection.
Each pair of documents (nodes) is associated with at most one link. One link may be characterized by more than one association type.

### Supported requests

- [GET `/documents/{id}/links`](#get-documentsidlinks)
- [PUT `/documents/{id}/links`](#put-documentsidlinks)
- [DELETE `/documents/{id}/links`](#delete-documentsidlinks)

## GET `/documents/{id}/links`

Retrieve all links associated with a specific document. If the document has no links an empty array is returned in the JSON body.

### Response body

```json
[
  {
    "targetDocumentId": 2,
    "linkTypes": ["direct"]
  },
  {
    "targetDocumentId": 4,
    "linkTypes": ["projection", "collateral"]
  }
]
```

### Success status

- `200 Ok`

### Errors

This API uses the following error codes:

- `401 Unauthorized`
- `404 Not Found`: The requested document was not found.
- `500 Internal Server Error`

## PUT `/documents/{id}/links`

Create or update a link associated with a specific document. If a link existed the list of types is replaced.

### Request body

```json
{
  "targetDocumentId": 2,
  "linkTypes": ["direct", "update"]
}
```

### Success status

- `201 Created`: The link has been created or replaced.

### Errors

This API uses the following error codes:

- `400 Bad Request`: The request was malformed or missing required parameters.
- `401 Unauthorized`
- `404 Not Found`: The requested document was not found.
- `500 Internal Server Error`

## DELETE `/documents/{id}/links`

Deletes the link between the document with id = `{id}` and `targetDocumentId` specified by the query parameter.
If you want to remove just one of the `linkTypes` replace the link with `PUT /documents/{id}/links`

### Query parameters

- `targetDocumentId`: id of the document at the other end of the link.

### Success status

- `204 No Content`: deletion successful.

### Errors

This API uses the following error codes:

- `400 Bad Request`: The request was malformed or missing required parameters.
- `401 Unauthorized`: You are unauthorized.
- `404 Not Found`: The requested document was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

<br/>

# Collection `sessions`

Handles user session management.

### Supported requests

- [POST `/sessions`](#post-sessions)
- [GET `/sessions/current`](#get-sessionscurrent)
- [DELETE `/sessions/current`](#delete-sessionscurrent)

## POST `/sessions`

Authenticate a user and create a session.

### Request body

```json
{
  "email": "urban.planner@gmail.com",
  "password": "PlannerPlanner.90"
}
```

### Response body

```json
{
  "email": "urban.planner@gmail.com",
  "name": "Luigi",
  "surname": "Bianchi",
  "role": "urban_planner"
}
```

### Success status

- `201 Created`

### Errors

This API uses the following error codes:

- `400 Bad Request`: The request was malformed or missing required parameters.
- `401 Unauthorized`: Incorrect credentials.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## GET `/sessions/current`

Retrieve information about the currently authenticated user.

### Response body

```json
{
  "email": "urban.planner@gmail.com",
  "name": "Luigi",
  "surname": "Bianchi",
  "role": "urban_planner"
}
```

### Success status

- `200 Ok`

### Errors

This API uses the following error codes:

- `401 Unauthorized`: Not authenticated.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## DELETE `/sessions/current`

Log out the currently authenticated user.

### Success status

- `204 No Content`.

### Errors

This API uses the following error codes:

- `500 Internal Server Error`: An unexpected error occurred on the server.

<br/>

# Collection `users`

A collection describing the variety of users interacting with the Kiruna eXplorer system.

### Supported requests

- [POST `/users`](#post-users)

## POST `/users`

Register a new user.

### Request body

```json
{
  "email": "urban.planner@gmail.com",
  "password": "ResidentResident.91",
  "name": "Mario",
  "surname": "Mario",
  "role": "resident"
}
```

### Response body

```json
{
  "message": "User created successfully"
}
```

### Success status

- `201 Created`

### Errors

- `400 Bad Request`: The request was malformed or missing required parameters.
- `409 Conflict`: User already existing.
- `500 Internal Server Error`: An unexpected error occurred on the server.
