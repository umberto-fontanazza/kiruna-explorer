# Manual Test Scenarios for User Story 7

## As an Urban Planner, I want to add one or more original resources for a document

### Scenario 1.1: Add one resource for a document

- Type of user: Urban Planner
- Precondition: User is on the [Description of a document](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/description_doc_UP.png), also logged in as Urban Planner.
- Post condition: The specific document has a new resource.

| Step |                         System                         |
| :--: | :----------------------------------------------------: |
|  1   |        User click on the button "Edit document"        |
|  2   |     The system display the form "Update Document"      |
|  3   |              The user click on "continue"              |
|  4   |  User click on continue in the form "Add links" step   |
|  5   |              User click on "Select File"               |
|  6   |          User select a file from his desktop           |
|  7   |                User click on "Continue"                |
|  8   | Th system store that resource to the specific document |

### Scenario 1.2: Add multiple resources for a document

- Type of user: Urban Planner
- Precondition: User is on the [Description of a document](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/description_doc_UP.png), also logged in as Urban Planner.
- Post condition: The specific document has a new resource.

| Step |                          System                          |
| :--: | :------------------------------------------------------: |
|  1   |         User click on the button "Edit document"         |
|  2   |      The system display the form "Update Document"       |
|  3   |               The user click on "continue"               |
|  4   |   User click on continue in the form "Add links" step    |
|  5   |               User click on "Select File"                |
|  6   |           User select a file from his desktop            |
|  7   |                User repeats step 5 and 6                 |
|  8   |                 User click on "Continue"                 |
|  9   | The system store that resources to the specific document |

### Scenario 1.3: Add one resources for a document, but exceeds the size

- Type of user: Urban Planner
- Precondition: User is on the [Description of a document](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/description_doc_UP.png), also logged in as Urban Planner.
- Post condition: The specific document has a new resource.

| Step |                             System                              |
| :--: | :-------------------------------------------------------------: |
|  1   |            User click on the button "Edit document"             |
|  2   |          The system display the form "Update Document"          |
|  3   |                  The user click on "continue"                   |
|  4   |       User click on continue in the form "Add links" step       |
|  5   |                   User click on "Select File"                   |
|  6   |               User select a file from his desktop               |
|  7   |                    User click on "Continue"                     |
|  8   | The system do not store that resources to the specific document |

### Scenario 1.4: Add multiple resources for a document, but one or more exceeds the size

- Type of user: Urban Planner
- Precondition: User is on the [Description of a document](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/description_doc_UP.png), also logged in as Urban Planner.
- Post condition: The specific document has a new resource.

| Step |                                       System                                        |
| :--: | :---------------------------------------------------------------------------------: |
|  1   |                      User click on the button "Edit document"                       |
|  2   |                    The system display the form "Update Document"                    |
|  3   |                            The user click on "continue"                             |
|  4   |                 User click on continue in the form "Add links" step                 |
|  5   |                             User click on "Select File"                             |
|  6   |                         User select a file from his desktop                         |
|  7   |                              User repeats step 5 and 6                              |
|  8   |                              User click on "Continue"                               |
|  9   | Th system do not store the resources that exceeds the size to the specific document |
|  10  |              The system store that resources to the specific document               |
