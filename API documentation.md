# Kiruna eXplorer API Documentation

# Index

1. [Base URL](#base-url)
2. Collections  
   2.1. [Collection `documents`](#collection-documents)  
   2.2. [Collection `links`](#collection-links)  
   2.3. [Collection `uploads`](#collection-uploads)  
   2.4. [Collection `sessions`](#collection-sessions)  
   2.5. [Collection `users`](#collection-users)

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

- `type`: [optional] filter the documents on document type
- `scaleType`: [optional] filter the documents on scale type
- `maxIssuanceDate`: [optional] return documents which were (or may have been, if only the issuance year is known)
  issued before or in the provided (UTC `YYYY-MM-DD`) date
- `minIssuanceDate`: [optional] return documents which were (or may have been, if only the issuance year is known)
  issued after or in the provided (UTC `YYYY-MM-DD`) date

### Response body

```json
[
    {
        "id": 1,
        "title": "Kiruna plan",
        "description": "Document of Kiruna plan",
        "type": "informative",
        "scale": {
          "type": "ratio",
          "ratio": 8000
        },
        "stakeholders": ["lkab", "kiruna_kommun"],
        "coordinates": {
          "latitude": 67.85624725739333,
          "longitude": 20.23857657264496
        },
        "issuanceTime": "2024-11-08",
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
      "type": "ratio",
      "ratio": 8000
    },
    "stakeholders": ["lkab", "kiruna_kommun"],
    "coordinates": {
      "latitude": 67.85624725739333,
      "longitude": 20.23857657264496
    },
    "issuanceTime": "2024-11-08",
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

- `404 Not Found`: The requested document was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## POST `/documents`

Create a new document.

### Request body parameters

| **Parameter**           | **Description**                                                                       | **Type**            | **Required**                   |
| ----------------------- | ------------------------------------------------------------------------------------- | ------------------- | ------------------------------ |
| `title`                 | The title of the document                                                             | `string`            | Yes                            |
| `description`           | A brief description of the document                                                   | `string`            | Yes                            |
| `type`                  | Type of the document                                                                  | `string`            | Yes                            |
| `scale`                 | Relation between the real object and its size on a map                                | `object`            | Yes                            |
| `scale.type`            | Type of the scale                                                                     | `string`            | Yes                            |
| `scale.ratio`           | The numeric value representing the right side of the scale (e.g., 8000 for 1:8000)    | `number`            | Yes if `scale` is "ratio"      |
| `stakeholders`          | Array of stakeholders involved with the document                                      | `array` of `string` | No                             |
| `coordinates`           | Object representing a point on the map, mutually exclusive with `area`                | `object`            | No                             |
| `coordinates.latitude`  | Value in the range [-90, +90] degrees                                                 | `number`            | Yes if `longitude` is provided |
| `coordinates.longitude` | Value in the range [-180, +180] degrees                                               | `number`            | Yes if `latitude` is provided  |
| `area`                  | Object representing an area on the map, mutually exclusive with `coordinates`         | `object`            | No                             |
| `area.include`          | Array of points on the map representing a polygon covering the area                   | `object[]`          | Yes if `area` is defined       |
| `area.exclude`          | Array of polygons (a polygon is an array of coordinates) to be excluded from the area | `object[][]`        | Yes if `area` is defined       |
| `issuanceTime`          | Either `YYYY`, `YYYY-MM` or `YYYY-MM-DD`                                              | `string`            | Yes                            |

### Request body

```json
{
  "title": "Kiruna plan",
  "description": "Document of Kiruna plan",
  "type": "informative",
  "scale": {
    "type": "ratio",
    "ratio": 8000
  },
  "stakeholders": ["lkab", "kiruna_kommun"],
  "coordinates": {
    "latitude": 67.85624725739333,
    "longitude": 20.23857657264496
  },
  "issuanceTime": "2024"
}
```

Insted of coordinates an area might be defined where an area is an object with the following JSON representation:

```json
{
  "include": [
    { "latitude": 67.85584273627312, "longitude": 20.22534124638123 },
    { "latitude": 67.85971234872345, "longitude": 20.21344576372931 },
    { "latitude": 67.84217863458723, "longitude": 20.24528734962184 },
    { "latitude": 67.83997453827193, "longitude": 20.23000083719327 }
  ],
  "exclude": [
    [
      { "latitude": 67.85000000000012, "longitude": 20.23500000000034 },
      { "latitude": 67.84500000000045, "longitude": 20.24000000000082 },
      { "latitude": 67.84750000000067, "longitude": 20.22800000000036 }
    ],
    [
      { "latitude": 67.85800000000079, "longitude": 20.22000000000075 },
      { "latitude": 67.86000000000089, "longitude": 20.22600000000036 },
      { "latitude": 67.85750000000003, "longitude": 20.23000000000058 }
    ]
  ]
}
```

In the example just described, the area defined represents a quadrilateral with two triangular holes in it.

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

# Collection `uploads`

### Supported requests

- [GET `/uploads`](#get-uploads)
- [GET `/uploads/{id}`](#get-uploadsid)
- [POST `/uploads`](#post-uploads)
- [PATCH `/uploads/{id}`](#patch-uploadsid)
- [DELETE `/uploads/{id}`](#delete-uploadsid)

## GET `/uploads`

### Query parameters

- `documentId`: **mandatory** when file=include. Returns uploads related to this document only.
- `file`: defaults to `omit` to return uploads metadata only or `include` to return metadata along with the file.

### Response body

```json
[
  {
    "id": 2,
    "title": "Document 12 pdf",
    "type": "original_resource"
  },
  {
    "id": 10,
    "title": "Signed document",
    "type": "original_resource"
  },
  {
    "id": 11,
    "title": "Meeting document",
    "type": "original_resource"
  }
]
```

## GET `/uploads/{id}`

Retrieve an upload file from its identifier. The file is encoded in base64 as value of the "file" field in the JSON response.

### Query parameters

- `bindedDocumentIds`: defaults to `omit` but can bet set to `include` to return also an array with the ids of the documents binded to the upload

### Response body

```json
{
  "id": 3,
  "title": "Kiruna relocation act",
  "type": "original_resource",
  "file": "45j24dffF526x345",
  "bindedDocumentIds": [12, 13]
}
```

### Success status

- `200 Ok`

### Errors

This API can return the following error codes:

- `404 Not Found`: The requested upload was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## POST `/uploads`

Upload a new file to the server, binding it to one or more documents

### Request body parameters

| **Parameter** | **Description**                                                                     | **Type**                            | **Required** |
| ------------- | ----------------------------------------------------------------------------------- | ----------------------------------- | ------------ |
| `title`       | The title of the upload                                                             | `string`                            | Yes          |
| `type`        | Type of the upload                                                                  | `original_resource` or `attachment` | Yes          |
| `documentIds` | Ids of the documents related to the attachment. If present it's length must be >= 1 | `number[]`                          | No           |
| `file`        | Actual file encoded in base64                                                       | `string`                            | Yes          |

### Request body

```json
{
  "title": "Kiruna relocation act",
  "type": "original_resource",
  "file": "45j24dffF526x345",
  "documentIds": [1, 3, 5]
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

## PATCH `/uploads/{id}`

Edit upload metadata and/or binding to documents. All request body parameters are optional.
//TODO: n:n, 1:n, or what for both original resources and attachments

### Request body parameters

| **Parameter**         | **Description**                                               | **Type**                    |
| --------------------- | ------------------------------------------------------------- | --------------------------- |
| `title`               | The title of the upload                                       | `string`                    |
| `bindDocumentIds`     | Ids of documents to bind to the upload (must be decoupled)    | `number[]` with length >= 1 |
| `decoupleDocumentIds` | Ids of documents to decouple from the upload (must be binded) | `number[]` with length >= 1 |

### Request body

```json
{
  "title": "Kiruna relocation act",
  "bindDocumentIds": [7, 13],
  "decoupleDocumentIds": [3, 5]
}
```

### Success status

- `201 Created`

### Errors

This API uses the following error codes:

- `400 Bad Request`: The request was malformed or missing required parameters.
- `401 Unauthorized`: You are unauthorized.
- `404 Not Found`: The requested upload was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## DELETE `/uploads/{id}`

Delete an existing upload by its unique identifier after decoupling it from all binded documents.

### Success status

- `204 No content`

### Errors

This API uses the following error codes:

- `401 Unauthorized`: You are unauthorized.
- `404 Not Found`: The requested upload was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

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

- `401 Unauthorized`: Not authenticated.
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
