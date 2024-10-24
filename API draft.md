DOCUMENT

GET /documents/{id} TODO: filters

POST /documents - create a document

body: {
    title: string, 
    description: string
}

PATCH /documents/{id}

body: {
    title: string,
    description: string?,
    coordinates: TODO: 
    ...other fields: ?
}

DELETE /documents/{id}

body: {
    title: string
}

LINKS

GET /links

PUT /links 

body: {
    sourceNodeId: number,
    targetNodeId: number,
    linkType: string (check with enum)
}

DELETE /links

SESSIONS

...TODO: ema

USERS

... TODO: ema

