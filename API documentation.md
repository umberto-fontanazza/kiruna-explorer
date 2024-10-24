# API Documentation

# Base URL

The base URL for all API requests is:

`http://localhost:3000/new-project`

# Collection `template`

Collection description

## GET /template/{id}

Endpoint description

### Query parameters

- `filter1` (optional): filter 1 description;
- `filter2` (optional): filter 2 description.

### Response body

```json
{
    "attr1": "attr1",
    "attr2": "attr2"
}
```

### Errors

This API can return the following error codes:

- `400 Bad Request`: The request was malformed or missing required parameters.
- `401 Unauthorized`: The API key provided was invalid or missing.
- `404 Not Found`: The requested resource was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.

## POST /template

Endpoint description

### Request body

```json
{
    "attr1": "random1",
    "attr2": "random2"
}
```

### Response body

```json
{
    "message": "Template created successfully"
}
```

### Errors

This API uses the following error codes:

- `400 Bad Request`: The request was malformed or missing required parameters.
- `401 Unauthorized`: The API key provided was invalid or missing.
- `404 Not Found`: The requested resource was not found.
- `500 Internal Server Error`: An unexpected error occurred on the server.