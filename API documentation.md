# Kiruna eXplorer API Documentation

TODO: example of json request and responses
TODO: write what are the mandatory parameters

# Index

1. [Base URL](#base-url)
2. Collections   
    2.1. [Colletion `documents`](#collection-documents)  
    2.2. [Collection `links`](#collection-links)
    2.3. [Collection `sessions`](#collection-sessions)
    2.4. [Collection `users`](#collection-users)
    
<br/>

# Base URL

The base URL for all API requests is:

`http://localhost:3000/kiruna-eXplorer`

<br/>

# Collection `documents`

A collection of documents representing key nodes in the relocation process of Kiruna. Each document corresponds to agreements, conflicts, consultations, material effects, or other documents that directly influence the project. Documents are categorized by type, including informative, prescriptive, and original resources, and are connected through a network of direct and collateral consequences, projections, and updates.

## GET `/documents`

Retrieve all documents.

### Query parameters

TODO: filters

## Response body

```json
[
    {
        "id": 1,
        "title": "",
        "description": "",
        "coordinates": {
            "latitude": 67.9, // domain [-90 deg, +90 deg]
            "longitude": 20.22 // domain [-180 deg, +180 deg]
        },
        "links": [
            {
                "targetDocumentId": 2,
                "linkTypes": ["DIRECT", "UPDATE"]
            },
            ...
        ]
    },
    ...
]
```

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
    "title": "",
    "description": "",
    "coordinates": {
        "latitude": 67.9, // domain [-90 deg, +90 deg]
        "longitude": 20.22 // domain [-180 deg, +180 deg]
    },
    "links": [
        {
            "targetDocumentId": 2,
            "linkTypes": ["DIRECT", "UPDATE"]
        },
        ...
    ]
}
```

### Errors

This API can return the following error codes:

- `401 Unauthorized`: You are unauthorized.
- `404 Not Found`: The requested document was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## POST `/documents`

Create a new document.

### Request body

```json
{
    "title": "",
    "description": "",
    "coordinates": {
        "latitude": 67.9, // domain [-90 deg, +90 deg]
        "longitude": 20.22 // domain [-180 deg, +180 deg]
    },
    //other properties
}
```

### Response body

```json
{
    "message": "Document created successfully",
    "id": 1
}
```

### Errors

This API uses the following error codes:

- `400 Bad Request`: The request was malformed or missing required parameters.
- `401 Unauthorized`: You are unauthorized.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## PATCH `/documents/{id}`

Update an existing document by its unique identifier.

### Request body

```json
{
    "title": "",
    "description": "",
    "coordinates": {
        "latitude": 67.9, // domain [-90 deg, +90 deg]
        "longitude": 20.22 // domain [-180 deg, +180 deg]
    },
    //other properties
}
```

### Response body

```json
{
    "id": 1,
    "title": "",
    "description": "",
    "coordinates": {
        "latitude": 67.9, // domain [-90 deg, +90 deg]
        "longitude": 20.22 // domain [-180 deg, +180 deg]
    },
    //other properties
}
```

### Errors

This API uses the following error codes:

- `400 Bad Request`: The request was malformed or missing required parameters.
- `401 Unauthorized`: You are unauthorized.
- `404 Not Found`: The requested document was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## DELETE `/documents/{id}`

Delete an existing document by its unique identifier and all its links.

### Response body

No response body. If the request is successfull, it returns `204 No Content`.

### Errors

This API uses the following error codes:

- `401 Unauthorized`: You are unauthorized.
- `404 Not Found`: The requested document was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

<br/>

# Collection `links`

A collection of links representing relationships between documents, serving as a sub-collection within the `documents` collection.
Each pair of documents (nodes) is associated with at most one link. One link may be characterized by more than one association type.

## GET `/documents/{id}/links`

Retrieve all links associated with a specific document. If the document has no links an empty array is returned in the JSON body.

### Response body

```json
[
    {
        "targetDocumentId": 2,
        "linkTypes": ["DIRECT"]
    },
    {
        "targetDocumentId": 4,
        "linkTypes": ["PROJECTION", "COLLATERAL"]
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
    "linkTypes": ["DIRECT", "UPDATE"]
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

## POST `/sessions`

Authenticate a user and create a session.

### Request body

```json
{
    "username": "urban.planner",
    "password": "PlannerPlanner.90"
}
```

### Response body

```json
{
    "username": "urban.planner",
    //other properties
}
```

### Errors

This API uses the following error codes:

- `400 Bad Request`: The request was malformed or missing required parameters.
- `401 Unauthorized`: Incorrect credentials.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## GET `/sessions/current/`

Retrieve information about the currently authenticated user.

### Response body

```json
{
    "username": "urban.planner",
    //other properties
}
```

### Errors

This API uses the following error codes:

- `401 Unauthorized`: No authenticated user.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## DELETE `/sessions/current`

Log out the currently authenticated user.

### Response body

No response body. If the request is successfull, it returns `204 No Content`.

### Errors

This API uses the following error codes:

- `401 Unauthorized`: No authenticated user.
- `500 Internal Server Error`: An unexpected error occurred on the server.

<br/>

# Collection `users`

A collection describing the variety of users interacting with the Kiruna eXplorer system.

## POST `/users`

Register a new user.

### Request body

```json
{
    "username": "resident",
    "password": "ResidentResident.91",
    "name": "Luigi",
    "surname": "Bianchi",
    "role": "RESIDENT"
}
```

### Response body

```json
{
    "message": "User created successfully",
}
```

### Errors

- `400 Bad Request`: The request was malformed or missing required parameters.
- `409 Conflict`: User already existing.
- `500 Internal Server Error`: An unexpected error occurred on the server.