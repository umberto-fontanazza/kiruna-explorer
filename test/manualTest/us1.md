# Manual Test Scenarios for User Story 1 and Login.

## As an Urban Planner, I want to add a new document description

### Scenario 1.1 - From the home page, click on log in, and fill the fields with Urban Planner credentials.

- Type of user: Urban Planner
- Precondition: Credentials for Urban Planner
- Post condition: Logged in as Urban Planner, and redirected to the main page with all the features available for the Urban Planner.

| Step |                                                                                                       System                                                                                                        |
| :--: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                                                          User click on the "Login" button                                                                                           |
|  2   |                                         User is redirected to the [Login Page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/logIn_page.png)                                          |
|  3   |                                                                               User fill the fields with correct Username and Password                                                                               |
|  4   |                                                                                          User click on the "Login" button                                                                                           |
|  5   |                                                                              User is logged in, the user is serialized to the session                                                                               |
|  6   | User is redirected to the [Main Page for UP](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/main_page_UP.png), with all actions available for the Urban Planner (e.g. Add, delete ...) |

### Scenario 1.2 - From the home page, click on log in, and fill the fields with incorrect Urban Planner credentials.

- Type of user: Urban Planner
- Precondition: Credentials for Urban Planner
- Post condition: User is not logged in, email and/or password wrong.

| Step |                                                                                   System                                                                                   |
| :--: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                                      User click on the "Login" button                                                                      |
|  2   |                     User is redirected to the [Login Page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/logIn_page.png)                     |
|  3   |                                                         User fill the fields with incorrect Email and/or Password                                                          |
|  4   |                                                                      User click on the "Login" button                                                                      |
|  5   | The system show to the user the error message ["Email and/or password wrong"](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/login_error.png) |
|  6   |                                                             User is not logged in and remain on the login page                                                             |

### Scenario 1.3 - From the home page, click on log in, and fill the fields but password or email are not filled

- Type of user: Urban Planner
- Precondition: Credentials for Urban Planner
- Post condition: User is not logged in, email and/or password missing.

| Step |                                                                                      System                                                                                      |
| :--: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                                         User click on the "Login" button                                                                         |
|  2   |                        User is redirected to the [Login Page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/logIn_page.png)                        |
|  3   |                                                             User fill the fields with missing Email and/or Password                                                              |
|  4   |                                                                         User click on the "Login" button                                                                         |
|  5   | The system show to the user the warning message ["Please fill out this field"](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/login_incomplete.png) |
|  6   |                                                               User is not logged in, and remain on the login page                                                                |

### Scenario 1.4 - From the home page, click on log in, and register clicking in sign up for free

Not yet implemented.

### Scenario 1.5 - From the home page, click on log in, and click on forgot password.

Not yet implemented.

### Scenario 1.6: From the home page, click on log in, return to main page from login page using "home" button

- Type of user: Urban Planner
- Precondition: Credentials for Urban Planner
- Post condition: User is not logged in, return to main page.

| Step |                                                                          System                                                                          |
| :--: | :------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                             User click on the "Login" button                                                             |
|  2   |            User is redirected to the [Login Page](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/logIn_page.png)            |
|  3   |                                                            User click on the "Return" button                                                             |
|  5   | User is not logged in, and is redirected to the ["Main Page"](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/main_page.png) |

### Scenario 2.1: Enter to the form new document from the button "Add new Document", logged in as an Urban Planner

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1](#scenario-11---from-the-home-page-click-on-log-in-and-fill-the-fields-with-urban-planner-credentials)
- Post condition: A form for entering the details of the new document is displayed

| Step |                                                                      System                                                                       |
| :--: | :-----------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                    User click on the "Add new document" button                                                    |
|  2   |                                         User is redirected to "Insert Mode" to select a point on the map                                          |
|  3   |                                      User click on the geographical point that wants to refers the document                                       |
|  4   | User is redirected to the form ["New Document"](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/newDocument_Form.png) |

### Scenario 2.2: Enter to the form new document from the button "Add new Document", logged in as an Urban Planner, and get back when selecting the point on the map.

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1](#scenario-11---from-the-home-page-click-on-log-in-and-fill-the-fields-with-urban-planner-credentials)
- Post condition: Main page for UP is displayed again.

| Step |                                                                   System                                                                   |
| :--: | :----------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                User click on the "Add new document" button                                                 |
|  2   |                                      User is redirected to "Insert Mode" to select a point on the map                                      |
|  3   |                                                      User click on the "Back" button                                                       |
|  4   | User is redirected to the [Main Page for UP](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/main_page_UP.png) |

### Scenario 2.3: Enter to the form new document from the button "Add new Document", logged in as an Urban Planner, and get back when filling the form.

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1](#scenario-11---from-the-home-page-click-on-log-in-and-fill-the-fields-with-urban-planner-credentials)
- Post condition: A form for entering the details of the new document is displayed, then the Main Page for Urban planner appears.

| Step |                                                                      System                                                                       |
| :--: | :-----------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                    User click on the "Add new document" button                                                    |
|  2   |                                         User is redirected to "Insert Mode" to select a point on the map                                          |
|  3   |                                      User click on the geographical point that wants to refers the document                                       |
|  4   | User is redirected to the form ["New Document"](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/newDocument_Form.png) |
|  5   |                                                          User click on the "Back" button                                                          |
|  6   |    User is redirected to the [Main Page for UP](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/main_page_UP.png)     |

### Scenario 3.1: Add new document with all the fields filled

- Type of user: Urban Planner
- Precondition: User is on the form "Add new Document" [Scenario 2.1](#scenario-21-enter-to-the-for-add-document-logged-in-as-an-urban-planner)
- Post condition: The User continue to the Add links form.

| Step |                                         System                                          |
| :--: | :-------------------------------------------------------------------------------------: |
|  1   |                        User enters a title in the "Title" field                         |
|  2   |                  User enters a description in the "Description" field                   |
|  3   |                  User selects an option from the "Scale" dropdown list                  |
|  4   | User selects a valid issuance date using the calendar menu in the "Issuance Date" field |
|  5   |                     User selects an option from the "Type" dropdown                     |
|  6   |            User selects one or multiple options from the "Stakeholders" list            |
|  7   |                                User click on "Continue"                                 |

### Scenario 3.2: Add new document with only mandatory information

- Type of user: Urban Planner
- Precondition: User is on the form "Add new Document" [Scenario 2.1](#scenario-21-enter-to-the-for-add-document-logged-in-as-an-urban-planner)
- Post condition: The User continue to the Add links form.

| Step |                              System                               |
| :--: | :---------------------------------------------------------------: |
|  1   |             User enters a title in the "Title" field              |
|  2   |       User enters a description in the "Description" field        |
|  3   |       User selects an option from the "Scale" dropdown list       |
|  4   |          User selects an option from the "Type" dropdown          |
|  5   | User selects one or multiple options from the "Stakeholders" list |
|  6   |                     User click on "Continue"                      |

### Scenario 3.3: Try to Add new document with missing Title

- Type of user: Urban Planner
- Precondition: User is on the form "Add new Document" [Scenario 2.1](#scenario-21-enter-to-the-for-add-document-logged-in-as-an-urban-planner)
- Post condition: Message of error to the users indicating that the field has to be complete.

| Step |                                                                    System                                                                     |
| :--: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                             User enters a description in the "Description" field                                              |
|  2   |                                             User selects an option from the "Scale" dropdown list                                             |
|  3   |                                                User selects an option from the "Type" dropdown                                                |
|  4   |                                       User selects one or multiple options from the "Stakeholders" list                                       |
|  5   |                                                           User click on "Continue"                                                            |
|  6   | Error message [Please fill out this field](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/newDocument_error.png) |

### Scenario 3.4: Try to Add new document with missing Description

- Type of user: Urban Planner
- Precondition: User is on the form "Add new Document" [Scenario 2.1](#scenario-21-enter-to-the-for-add-document-logged-in-as-an-urban-planner)
- Post condition: Message of error to the users indicating that the field has to be complete.

| Step |                                                                    System                                                                     |
| :--: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                   User enters a title in the "Title" field                                                    |
|  2   |                                             User selects an option from the "Scale" dropdown list                                             |
|  3   |                                                User selects an option from the "Type" dropdown                                                |
|  4   |                                       User selects one or multiple options from the "Stakeholders" list                                       |
|  5   |                                                           User click on "Continue"                                                            |
|  6   | Error message [Please fill out this field](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/newDocument_error.png) |

### Scenario 3.5: Try to Add new document with missing Scale

- Type of user: Urban Planner
- Precondition: User is on the form "Add new Document" [Scenario 2.1](#scenario-21-enter-to-the-for-add-document-logged-in-as-an-urban-planner)
- Post condition: Message of error to the users indicating that the field has to be complete.

| Step |                                                                    System                                                                     |
| :--: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                   User enters a title in the "Title" field                                                    |
|  2   |                                             User enters a description in the "Description" field                                              |
|  3   |                                                User selects an option from the "Type" dropdown                                                |
|  4   |                                       User selects one or multiple options from the "Stakeholders" list                                       |
|  5   |                                                           User click on "Continue"                                                            |
|  6   | Error message [Please fill out this field](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/newDocument_error.png) |

### Scenario 3.6: Try to Add new document with missing Type

- Type of user: Urban Planner
- Precondition: User is on the form "Add new Document" [Scenario 2.1](#scenario-21-enter-to-the-for-add-document-logged-in-as-an-urban-planner)
- Post condition: Message of error to the users indicating that the field has to be complete.

| Step |                                                                    System                                                                     |
| :--: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                   User enters a title in the "Title" field                                                    |
|  2   |                                             User enters a description in the "Description" field                                              |
|  3   |                                             User selects an option from the "Scale" dropdown list                                             |
|  4   |                                       User selects one or multiple options from the "Stakeholders" list                                       |
|  5   |                                                           User click on "Continue"                                                            |
|  6   | Error message [Please fill out this field](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/newDocument_error.png) |

### Scenario 3.7: Try to Add new document with missing stakeholders????

- Type of user: Urban Planner
- Precondition: User is on the form "Add new Document" [Scenario 2.1](#scenario-21-enter-to-the-for-add-document-logged-in-as-an-urban-planner)
- Post condition: Message of error to the users indicating that the field has to be complete.

| Step |                                                                    System                                                                     |
| :--: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|  1   |                                                   User enters a title in the "Title" field                                                    |
|  2   |                                             User enters a description in the "Description" field                                              |
|  3   |                                             User selects an option from the "Scale" dropdown list                                             |
|  4   |                                                User selects an option from the "Type" dropdown                                                |
|  5   |                                                           User click on "Continue"                                                            |
|  6   | Error message [Please fill out this field](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/newDocument_error.png) |

### Scenario 3.8: Return to the homepage from the New Document Registration

- Type of user: Urban Planner
- Precondition: User is on the form "Add new Document" [Scenario 2.1](#scenario-21-enter-to-the-for-add-document-logged-in-as-an-urban-planner)
- Post condition: The User is redirected to the [Main Page for UP](https://github.com/umberto-fontanazza/kiruna-explorer/blob/main/screenshots/main_page_UP.png).

| Step |                                         System                                          |
| :--: | :-------------------------------------------------------------------------------------: |
|  1   |                        User enters a title in the "Title" field                         |
|  2   |                  User enters a description in the "Description" field                   |
|  3   |                  User selects an option from the "Scale" dropdown list                  |
|  4   | User selects a valid issuance date using the calendar menu in the "Issuance Date" field |
|  5   |                     User selects an option from the "Type" dropdown                     |
|  6   |            User selects one or multiple options from the "Stakeholders" list            |
|  7   |                                    User click on "x"                                    |
