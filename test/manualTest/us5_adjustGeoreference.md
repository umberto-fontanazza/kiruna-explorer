# Manual Test Scenarios for User Story 5

## As an Urban Planner, I want to adjust/define the georeferencing of a document on the map so that I can study its relationship to the territory

### Scenario 1.1: Adjust the georeferencing of a document on the map when specific position was selected

- Type of user: Urban Planner
- Precondition: User is on the [Main Page for UP](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/main_page_UP.png)
- Post condition: The User adjust the georeference for a specific document.

| Step |                                 System                                  |
| :--: | :---------------------------------------------------------------------: |
|  1   |              User click on the icon of a specific document              |
|  2   |         User click on the green icon to modify the georeference         |
|  3   |         User drop on the map the new position for the document          |
|  4   | The main page now displays the icon of the document in the new position |

### Scenario 1.2: Adjust the georeferencing of a document on the map by inserting manually valid data

- Type of user: Urban Planner
- Precondition: User is on the [Main Page for UP](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/main_page_UP.png)
- Post condition: The form for Update de links is displayed.

| Step |                            System                            |
| :--: | :----------------------------------------------------------: |
|  1   |        User click on the icon of a specific document         |
|  2   |      User click on the blue icon to modify the document      |
|  3   | The system show the Update Document form with prefilled data |
|  4   |      User rewrite a valide number on the "Latitude" box      |
|  5   |     User rewrite a valide number on the "Longitude" box      |
|  6   |                   User click on "Continue"                   |
|  7   |    The system show the Update Document form for add links    |

### Scenario 1.3: Adjust the georeferencing of a document on the map by inserting manually invalid data

- Type of user: Urban Planner
- Precondition: User is on the [Main Page for UP](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/main_page_UP.png)
- Post condition: An error is displayed, informing the user that has to insert correct data

| Step |                                   System                                   |
| :--: | :------------------------------------------------------------------------: |
|  1   |               User click on the icon of a specific document                |
|  2   |             User click on the blue icon to modify the document             |
|  3   |        The system show the Update Document form with prefilled data        |
|  4   |            User rewrite a invalide number on the "Latitude" box            |
|  5   |            User rewrite a valide number on the "Longitude" box             |
|  6   |                          User click on "Continue"                          |
|  7   | System gives to the user an error "Value must be less than or equal to 90" |

| Step |                                   System                                    |
| :--: | :-------------------------------------------------------------------------: |
|  1   |                User click on the icon of a specific document                |
|  2   |             User click on the blue icon to modify the document              |
|  3   |        The system show the Update Document form with prefilled data         |
|  7   |             User rewrite a valide number on the "Latitude" box              |
|  8   |            User rewrite a invalide number on the "Longitude" box            |
|  9   |                          User click on "Continue"                           |
|  10  | System gives to the user an error "Value must be less than or equal to 180" |

### Scenario 1.4: Adjust the georeferencing of a document on the map, and discard changes

- Type of user: Urban Planner
- Precondition: User is on the [Main Page for UP](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/main_page_UP.png)
- Post condition: The document is not updated

| Step |                            System                            |
| :--: | :----------------------------------------------------------: |
|  1   |        User click on the icon of a specific document         |
|  2   |      User click on the blue icon to modify the document      |
|  3   | The system show the Update Document form with prefilled data |
|  4   |      User rewrite a valid number on the "Latitude" box       |
|  5   |     User rewrite a valide number on the "Longitude" box      |
|  6   |                      User click on "x"                       |
|  7   |     The main page is displayed without any modification      |
