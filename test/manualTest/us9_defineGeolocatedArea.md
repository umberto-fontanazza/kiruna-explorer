# Manual Test Scenarios for User Story 9

## As an Urban Planner, i want to define the geolocated area of a document on the map

### Scenario 1.1: Adjust the georeferencing of a document on the map, when polygon was previosly selected

- Type of user: Urban Planner
- Precondition: User is on the [Main Page for UP](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/main_page_UP.png)
- Post condition: The User adjust the georeference for a specific document.

| Step |                                 System                                  |
| :--: | :---------------------------------------------------------------------: |
|  1   |              User click on the icon of a specific document              |
|  2   |         User click on the green icon to modify the georeference         |
|  3   |         User drop on the map the new position for the document          |
|  4   | The main page now displays the icon of the document in the new position |

### Scenario 1.2: Define the georeferencing of a document on the map, with polygon option

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1 User Story 1]
- Post condition: A form for entering the details of the new document is displayed

| Step |                                                                      System                                                                       |
| :--: | :-----------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                    User click on the "Add new document" button                                                    |
|  2   |                                              User is redirected to "Insert Mode" to select an option                                              |
|  3   |                                                              User click on "Polygon"                                                              |
|  4   |                                     User click on the geographicals points that wants to refers the document                                      |
|  5   | User is redirected to the form ["New Document"](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/newDocument_Form.png) |

### Scenario 2.1: Adjust the georeferencing of a document on the map, when municipal area was previosly selected

- Type of user: Urban Planner
- Precondition: User is on the [Main Page for UP](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/main_page_UP.png)
- Post condition: The User adjust the georeference for a specific document.

| Step |                                 System                                  |
| :--: | :---------------------------------------------------------------------: |
|  1   |              User click on the icon of a specific document              |
|  2   |         User click on the green icon to modify the georeference         |
|  3   |         User drop on the map the new position for the document          |
|  4   | The main page now displays the icon of the document in the new position |

### Scenario 2.2: Define the Municipal area of a document on the map, with polygon option

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1 User Story 1]
- Post condition: A form for entering the details of the new document is displayed

| Step |                                                                      System                                                                       |
| :--: | :-----------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                    User click on the "Add new document" button                                                    |
|  2   |                                              User is redirected to "Insert Mode" to select an option                                              |
|  3   |                                                          User click on "Municiapl area"                                                           |
|  4   | User is redirected to the form ["New Document"](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/newDocument_Form.png) |
