# Tests:

## US 1. As an Urban Planner I want to add a new document description:

### Fields

- title: string \*
- description: string \*
- type: DocumentType \*
- scale_type: ScaleType/scale_ratio: number \*
- stakeholders: Stakeholder[]
- issuanceTime: Date (Some documents do not have it)
- coordinates: Coordinates (Will be modified with other user stories)
- Language (Will be mandatory from user story 7 onwards)
- Pages (Will be modified with User Story 7)

### Cases:

1. Adding a document without being Urban Planner. DONE (UNAUTHORIZED)
2. Adding a document being Urban Planner, with all the fields filled in. DONE (CREATED)
3. Adding a document being Urban Planner, with all the mandatory fields filled. DONE (CREATED)
4. Add a document being Urban Planner, without filling out a required field. DONE (BAD_REQUEST)
5. Add a document being Urban Planner, without filling several mandatory fields. DONE (BAD_REQUEST)
6. Add a document as Urban Planner, without filling in all the fields. DONE(BAD_REQUEST)
7. Add a document as Urban Planner filling wrong one field. DONE (BAD_REQUEST)
8. Add a document as Urban Planner filling wrong all fields. DONE (BAD_REQUEST)
9. Update a document without being an Urban Planner. DONE (UNAUTHORIZED)
10. Update a document being an Urban Planner, modifying all the fields. DONE (NO_CONTENT)
11. Update a document being an Urban Planner, modifying only the mandatory fields. DONE (NO_CONTENT)
12. Update a document being Urban Planner, modifying all optional fields. DONE (NO_CONTENT)
13. Update a document as Urban Planner, modifying only one mandatory field. DONE (NO_CONTENT)
14. Update a document being Urban Planner, modifying only one optional field. DONE (NO_CONTENT)
15. Update a document being Urban Planner, without modifying anything. DONE (NO_CONTENT)
16. Update a non existing document being Urban Planner. DONE (BAD_REQUEST)
17. Update a document as Urban Planner filling wrong one field. DONE (BAD_REQUEST)
18. Delete a document without being an Urban planner. DONE (UNAUTHORIZED)
19. Delete an existing document as Urban Planner. DONE (NO_CONTENT)
20. Delete a non-existing document being an Urban Planner. DONE (BAD_REQUEST)

## US 2. As an Urban Planner I want to link documents to each other So that I can study their relationships

1. Link documents to each other and not be an Urban Planner. DONE (UNAUTHORIZED)
2. Create a link as Urban Planner associated with a specific document. DONE (CREATED)
3. Update a link as Urban Planner associated with a specific document. DONE (CREATED)
4. Create a link as Urban Planner for a non existing document. DONE (BAD_REQUEST)
5. Create a link as Urban Planner with wrong linkType. DONE (BAD_REQUEST)
6. Create a link as Urban Planner with wrong Target Document. DONE (BAD_REQUEST)
7. Create a link as Urban Planner without the linkType. DONE (BAD_REQUEST)
8. Create a link as Urban Planner without the Target Document. DONE (BAD_REQUEST)
9. Create a link as Urban Planner to the same document. DONE (BAD_REQUEST) \*
10. View all links for a document without being Urban Planner. DONE (OK)
11. View all links for a document being Urban Planner, and also after creating another one. DONE (OK)
12. View links for a non existing document. DONE (BAD_REQUEST)
13. Delete links for a specific pair of documents, being urban Planner.
14. Delete links for a specific pair of documents without being urban Planner. DONE (UNAUTHORIZED)

## US 3. As an Urban Planner I want to georeference a document (possibly at insertion time) So that I can study its relationship to the territory

### Cases:

1. Georeference a document and not be an Urban Planner. DONE (UNAUTHORIZED)
2. Georeference a document being an Urban Planner, filling in the information correctly. DONE (CREATED)
3. Georeferencing a document being an Urban planner, filling the information incorrectly. DONE (BAD_REQUEST)
4. Georeference a document being an Urban planner, with missing information. DONE (BAD_REQUEST)

## US 4. As a resident/visitor/urban planner I want to view the documents on the map So that I can see to which position or area they relate

#### Cases:

1. View all documents as a Visitor. DONE (OK)
2. View all documents as a Urban Planner. DONE (OK)
3. View all documents as a Resident. DONE (OK)
4. View a specific document as a Urban Planner. DONE (OK)
5. View a specific document as a Visitor. DONE (OK)
6. View a specific document as a Resident. DONE (OK)
7. View a document that does not exist as a Visitor/Urban Planner/Resident. DONE (BAD_REQUEST)
8. View a document with a wrong ID as a Visitor/Urban Planner/Resident. DONE (BAD_REQUEST)

## US 5. As an Urban Planner I want to adjust/define the georeferencing of a document on the map So that I can study its relationship to the territory

### Cases:

1. Adjust georeference for a document and not be an Urban Planner. DONE (UNAUTHORIZED)
2. Adjust georeference a document being an Urban Planner, filling in the information correctly. DONE (CREATED)
3. Adjust georeferencing a document being an Urban planner, filling the information incorrectly. DONE (BAD_REQUEST)
4. Adjust georeference a document being an Urban planner, with missing information. DONE (BAD_REQUEST)

## US 6. As an Urban Planner I want to list all documents

1. View all documents as a Urban Planner. DONE (OK)
2. View all documents as a Urban Planner and filter by Type. DONE (OK)
3. View all documents as a Urban Planner and filter by scale. DONE (OK)
4. View all documents as a Urban Planner and filter by issuance date (max and min). DONE (OK)
5. View all documents as a Urban Planner and filter by issuance date (max). DONE (OK)
6. View all documents as a Urban Planner and filter by issuance date (min). DONE (OK)
7. View all documents as a Urban Planner and filter by multiple fields, Type and issuance date (max and min). DONE (OK)
8. View all documents as a Urban Planner and filter by multiple fields, Type, scale and issuance date (max and min). DONE (OK)
9. Try to view all documents filtered with wrong type.
10. Try to view all documents filtered with wrong scale.
11. Try to view all documents filtered with wrong issuanceTime (max).
12. Try to view all documents filtered with wrong issuanceTime (min).
13. Try to view all documents filtered with wrong type and scale.
14. Try to view all documents filtered with wrong type and issuanceTime (max).

## US 7. As an Urban Planner I want to add one or more original resources for a document.

1. Create a resource for a specific document, as urban planner. DONE (OK)
2. Create a resource for a specific document, without being urban planner. DONE (UNAUTHORIZED)
3. Create a resource for a specific document, as urban planner, but that document does not exist. DONE (BAD_REQUEST)
4. Create a resource for a specific document, as urban planner, with invalid fields. DONE (BAD_REQUEST)
5. Create a resource for a specific document, as urban planner, with missing documentIds. DONE (CREATED)
6. Create a resource for a specific document, as urban planner, with missing fields. DONE (BAD_REQUEST)
7. View all the resources for a specific document, as urban planner. DONE (OK)
8. Try to view all the resource without bein urban planner. DONE (OK)
9. View all the resources for a specific document, as urban planner, but that document does not exist. DONE (BAD_REQUEST)
10. View all the resources for a specific document, as urban planner, but that document does not have any upload. DONE (ERROR HERE)
11. Upload a resource for a specific document, as Urban Planner DONE (CREATED)
12. Upload a resource for a specific document, without being Urban Planner. DONE (UNAUTHORIZED)
13. Upload a resource for a specific document, as Urban Planner, with invalid id. DONE (BAD_REQUEST)
14. Upload a resource for a specific document, as Urban Planner, with invalid title. DONE (BAD_REQUEST)
15. Delete a resource for a specific document, as Urban Planner. DONE (NO_CONTENT)
16. Delete a resource for a specific document, without being Urban Planner. DONE (UNAUTHORIZED)
17. Delete a resource for a specific document, as Urban Planner, with invalid id. DONE (BAD_REQUEST)

## US 8. As an Urban Planner I want to search documents So that I can find what I am interested in

All the filter part are writed in the US6, im waiting to do the search bar.

## US 9. As an Urban Planner I want to define the geolocated area of a document on the map

1. Create a document, as urban planner, defining area AND coordinates. DONE (BAD_REQUEST)
2. Create a document, as a visitor, defining area AND coordinates. DONE (UNAUTHORIZED)
3. Create a document, as Urban planner defining Area, but without include field. DONE (BAD_REQUEST)
4. Create a document, as Urban planner defining Area, but without exclude field. DONE (BAD_REQUEST)
5. Create a document defining valid area, but without being urban planner. DONE (UNAUTHORIZED)
6. Create a document defining valid area, as Urban planner. DONE (CREATED)
7. View the document just created. DONE (OK)
8. View the document just created, as Urban planner. DONE (OK)
9. Update the document, as Urban planner. DONE(OK)
10. Update the document, as Visitor. DONE(UNAUTHORIZED)
11. Update the document, as Urban planner, with invalid area. DONE (BAD_RQEUEST)
12. Update the document, as Urban Planner, with area and coordinates. DONE(BAD_REQUEST)
13. Delete the document, as Urban Planner. DONE(NO_CONTENT)
