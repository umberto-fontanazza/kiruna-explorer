# Manual Test Scenarios for User Story 2

## As an Urban Planner, I want to link documents to each other So that i can study their relationships

### Scenario 1.1 - Add a link to a new document.

- Type of user: Urban Planner
- Precondition: User is on the Add Links form [Scenario 3.1 from US1]
- Post condition: User redirected to the Add Original Resources form.

| Step |                             System                              |
| :--: | :-------------------------------------------------------------: |
|  1   |        User search on the "Search for a document" space         |
|  2   | User selects an option from the Type of link from dropdown list |
|  3   |                    User click on "Add Link"                     |
|  4   |            User can see the list of the added links             |
|  5   |                    User click on "Continue"                     |

### Scenario 1.2 - Add multiple links to a new document.

- Type of user: Urban Planner
- Precondition: User is on the Add Links form [Scenario 3.1 from US1]
- Post condition: User redirected to the Add Original Resources form.

| Step |                             System                              |
| :--: | :-------------------------------------------------------------: |
|  1   |        User search on the "Search for a document" space         |
|  2   | User selects an option from the Type of link from dropdown list |
|  3   |                    User click on "Add Link"                     |
|  4   |          User repeats steps 1, 2 and 3 multiple times           |
|  5   |            User can see the list of the added links             |
|  6   |                    User click on "Continue"                     |

### Scenario 1.3 - Add multiple links to a new document to the same document, with different types.

- Type of user: Urban Planner
- Precondition: User is on the Add Links form [Scenario 3.1 from US1]
- Post condition: User redirected to the Add Original Resources form.

| Step |                                 System                                 |
| :--: | :--------------------------------------------------------------------: |
|  1   |            User search on the "Search for a document" space            |
|  2   |    User selects an option from the Type of link from dropdown list     |
|  3   |                        User click on "Add Link"                        |
|  4   | User repeats steps 1, 2 and 3 multiple times, with different link type |
|  5   |                User can see the list of the added links                |
|  6   |                        User click on "Continue"                        |

### Scenario 1.4 - Delete a links to a new document in the creation form.

- Type of user: Urban Planner
- Precondition: User is on the Add Links form [Scenario 3.1 from US1]
- Post condition: User redirected to the Add Original Resources form.

| Step |                             System                              |
| :--: | :-------------------------------------------------------------: |
|  1   |        User search on the "Search for a document" space         |
|  2   | User selects an option from the Type of link from dropdown list |
|  3   |                    User click on "Add Link"                     |
|  4   |          User repeats steps 1, 2 and 3 multiple times           |
|  5   |            User can see the list of the added links             |
|  6   |                User click on the button "Remove"                |
|  7   |                    User click on "Continue"                     |

### Scenario 1.5 - Update links to a created document.

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1 US1](#scenario-11---from-the-home-page-click-on-log-in-and-fill-the-fields-with-urban-planner-credentials).
- Post condition: User redirected to the Add Original Resources form.

| Step |                        System                         |
| :--: | :---------------------------------------------------: |
|  1   |          User click on a document in the map          |
|  2   | User click on the button edit document, at the bottom |
|  3   |               User click on "Continue"                |
|  4   |     User create a new link as in the scenario 1.1     |
|  5   |           User click on the button "Remove"           |
|  5   |               User click on "Continue"                |

### Scenario 1.6 - Attemp to add a connection without selecting one of the fields

- Type of user: Urban Planner
- Precondition: User is on the Add Links form [Scenario 3.1 from US1]
- Post condition: User cannot add the link.

| Step |             System             |
| :--: | :----------------------------: |
|  1   |    User click on "Add Link"    |
|  2   | User cannot add the connection |

### Scenario 1.7 - Attemp to click on continue without adding link connections

- Type of user: Urban Planner
- Precondition: User is on the Add Links form [Scenario 3.1 from US1]
- Post condition: User can continue to the Add Original Resources form. .

| Step |             System             |
| :--: | :----------------------------: |
|  1   |    User click on "Continue"    |
|  2   | User continue to the next form |
