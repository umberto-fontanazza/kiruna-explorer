# Manual Test Scenarios for User Story 14

## As a resident/visitor/urban planner I want to click on the documents shown on the diagram So that I can access to the document

### Scenario 1.1: See all documents on the diagram as Urban Planner

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1 user story 1] and is on the diagram page.
- Post condition: See all the icons for the available documents already relationated with time.

### Scenario 1.2: See all documents on the diagram as Resident

- Type of user: Resident
- Precondition: User is logged in as a Resident [Scenario 1.1 user story 1] and is on the diagram page.
- Post condition: See all the icons for the available documents already relationated with time.

### Scenario 1.3: See all documents on the map as Visitor

- Type of user: Visitor
- Precondition: User is not logged in, user is on the diagram page.
- Post condition: See all the icons for the available documents already relationated with time.

### Scenario 2.1: View the details of a specific document

- Type of user: Visitor/Urban Planner/Resident
- Precondition: User is on the diagram page.
  steps:

1. click on one of the icons of the wanted document

- Post condition: Appears the side bar details, including all the fields filled for the specific document.
