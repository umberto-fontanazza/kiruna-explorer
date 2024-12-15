# Manual Test Scenarios for User Story 8

## As an Urban Planner, I want to search documents so that i can find what i am interested in

### Scenario 1.1: Filter documents by Type

- Type of user: Urban Planner
- Precondition: User is on the [Document page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/doc_UP.png)
- Post condition: User can see the documents filtered

| Step |                     System                      |
| :--: | :---------------------------------------------: |
|  1   | User click on the button "Select document type" |
|  2   |        User click on the desired option         |
|  3   | The system show the documents filtered by type  |

### Scenario 1.2: Filter documents by Scale

- Type of user: Urban Planner
- Precondition: User is on the [Document page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/doc_UP.png)
- Post condition: User can see the documents filtered

| Step |                     System                      |
| :--: | :---------------------------------------------: |
|  1   |  User click on the button "Select scale type"   |
|  2   |        User click on the desired option         |
|  3   | The system show the documents filtered by scale |

### Scenario 1.3: Filter documents by Issuance date

- Type of user: Urban Planner
- Precondition: User is on the [Document page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/doc_UP.png)
- Post condition: User can see the documents filtered

| Step |                          System                           |
| :--: | :-------------------------------------------------------: |
|  1   |              User click on the button "From"              |
|  2   |             User click on the desired option              |
|  3   |               User click on the button "To"               |
|  4   |             User click on the desired option              |
|  5   | The system show the documents between those issuance date |

### Scenario 1.4: Filter documents by Issuance date and type

- Type of user: Urban Planner
- Precondition: User is on the [Document page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/doc_UP.png)
- Post condition: User can see the documents filtered

| Step |                                     System                                      |
| :--: | :-----------------------------------------------------------------------------: |
|  1   |                         User click on the button "From"                         |
|  2   |                        User click on the desired option                         |
|  3   |                          User click on the button "To"                          |
|  4   |                        User click on the desired option                         |
|  5   |                 User click on the button "Select document type"                 |
|  6   |                        User click on the desired option                         |
|  7   | The system show the documents between those issuance date and the selected type |

### Scenario 1.5: Filter documents by Issuance date and scale

- Type of user: Urban Planner
- Precondition: User is on the [Document page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/doc_UP.png)
- Post condition: User can see the documents filtered

| Step |                                      System                                      |
| :--: | :------------------------------------------------------------------------------: |
|  1   |                         User click on the button "From"                          |
|  2   |                         User click on the desired option                         |
|  3   |                          User click on the button "To"                           |
|  4   |                         User click on the desired option                         |
|  5   |                   User click on the button "Select scale type"                   |
|  6   |                         User click on the desired option                         |
|  7   | The system show the documents between those issuance date and the selected scale |

### Scenario 1.6: Filter documents by Scale and Type

- Type of user: Urban Planner
- Precondition: User is on the [Document page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/doc_UP.png)
- Post condition: User can see the documents filtered

| Step |                          System                          |
| :--: | :------------------------------------------------------: |
|  1   |       User click on the button "Select scale type"       |
|  2   |             User click on the desired option             |
|  3   |     User click on the button "Select document type"      |
|  4   |             User click on the desired option             |
|  3   | The system show the documents filtered by scale and type |

### Scenario 1.7: Filter documents by Issuance date, scale, type

- Type of user: Urban Planner
- Precondition: User is on the [Document page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/doc_UP.png)
- Post condition: User can see the documents filtered

| Step |                                          System                                           |
| :--: | :---------------------------------------------------------------------------------------: |
|  1   |                              User click on the button "From"                              |
|  2   |                             User click on the desired option                              |
|  3   |                               User click on the button "To"                               |
|  4   |                             User click on the desired option                              |
|  5   |                       User click on the button "Select scale type"                        |
|  6   |                             User click on the desired option                              |
|  5   |                      User click on the button "Select document type"                      |
|  6   |                             User click on the desired option                              |
|  7   | The system show the documents between those issuance date and the selected scale and type |

### Scenario 1.8: Search documents

- Type of user: Urban Planner
- Precondition: User is on the [Document page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/doc_UP.png)
- Post condition: User see the document that match with the search

| Step |                      System                      |
| :--: | :----------------------------------------------: |
|  1   | User click on the button "search for a document" |
|  2   |          User write at least 2 letters           |
|  3   |        System display options that match         |
|  4   |   User click on the nam of the document wanted   |
|  7   |           The system show the document           |

### Scenario 1.8: Search documents, but least characters than needed

- Type of user: Urban Planner
- Precondition: User is on the [Document page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/doc_UP.png)
- Post condition: system do not display anything

| Step |                      System                      |
| :--: | :----------------------------------------------: |
|  1   | User click on the button "search for a document" |
|  2   |             User write 0 or 1 letter             |
|  3   |          System do not display anything          |
