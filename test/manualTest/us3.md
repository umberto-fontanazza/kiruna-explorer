# Manual Test Scenarios for User Story 3.

## As an Urban Planner, I want to georeference a document (possibly at insertion time), So that I can study its relationship to the territory

### Scenario 1.1: Enter to the form new document from the button "Add new Document", logged in as an Urban Planner

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1 User Story 1]
- Post condition: A form for entering the details of the new document is displayed

| Step |                                                                      System                                                                       |
| :--: | :-----------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                    User click on the "Add new document" button                                                    |
|  2   |                                         User is redirected to "Insert Mode" to select a point on the map                                          |
|  3   |                                      User click on the geographical point that wants to refers the document                                       |
|  4   | User is redirected to the form ["New Document"](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/newDocument_Form.png) |

### Scenario 2.1: User modify the position on the form new document, logged in as an Urban Planner

- Type of user: Urban Planner
- Precondition: User is logged in as User is on the form "Add new Document" [Scenario 2.1 User Story 1]
- Post condition: A form for entering the details of the new document is displayed

| Step |                                         System                                          |
| :--: | :-------------------------------------------------------------------------------------: |
|  1   |                        User enters a title in the "Title" field                         |
|  2   |                  User enters a description in the "Description" field                   |
|  3   |                  User selects an option from the "Scale" dropdown list                  |
|  4   | User selects a valid issuance date using the calendar menu in the "Issuance Date" field |
|  5   |                     User selects an option from the "Type" dropdown                     |
|  6   |            User selects one or multiple options from the "Stakeholders" list            |
|  7   |                   User rewrite a valide number on the "Latitude" box                    |
|  8   |                   User rewrite a valide number on the "Longitude" box                   |
|  9   |                                User click on "Continue"                                 |

### Scenario 2.2: User modify the position on the form new document without one of the fields, logged in as an Urban Planner

- Type of user: Urban Planner
- Precondition: User is logged in as User is on the form "Add new Document" [Scenario 2.1 User Story 1]
- Post condition: A form for entering the details of the new document is displayed

| Step |                                         System                                          |
| :--: | :-------------------------------------------------------------------------------------: |
|  1   |                        User enters a title in the "Title" field                         |
|  2   |                  User enters a description in the "Description" field                   |
|  3   |                  User selects an option from the "Scale" dropdown list                  |
|  4   | User selects a valid issuance date using the calendar menu in the "Issuance Date" field |
|  5   |                     User selects an option from the "Type" dropdown                     |
|  6   |            User selects one or multiple options from the "Stakeholders" list            |
|  7   |                  User rewrite a invalide number on the "Latitude" box                   |
|  8   |                   User rewrite a valide number on the "Longitude" box                   |
|  9   |                                User click on "Continue"                                 |
|  10  |       System gives to the user an error "Value must be less than or equal to 90"        |

| Step |                                         System                                          |
| :--: | :-------------------------------------------------------------------------------------: |
|  1   |                        User enters a title in the "Title" field                         |
|  2   |                  User enters a description in the "Description" field                   |
|  3   |                  User selects an option from the "Scale" dropdown list                  |
|  4   | User selects a valid issuance date using the calendar menu in the "Issuance Date" field |
|  5   |                     User selects an option from the "Type" dropdown                     |
|  6   |            User selects one or multiple options from the "Stakeholders" list            |
|  7   |                   User rewrite a valide number on the "Latitude" box                    |
|  8   |                  User rewrite a invalide number on the "Longitude" box                  |
|  9   |                                User click on "Continue"                                 |
|  10  |       System gives to the user an error "Value must be less than or equal to 180"       |
