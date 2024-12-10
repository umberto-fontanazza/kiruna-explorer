# Manual Test Scenarios for User Story 4.

## As a resident/visitor/urban planner, I want to view the documents on the map so that I can see to which position or area they relate.

### Scenario 1.1: See all documents on the map as Urban Planner

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1 user story 1] and is on the main page.
- Post condition: See all the icons for the available documents already georeferenced.

### Scenario 1.2: See all documents on the map as Resident

- Type of user: Resident
- Precondition: User is logged in as a Resident [Scenario 1.1 user story 1] and is on the main page.
- Post condition: See all the icons for the available documents already georeferenced.

### Scenario 1.3: See all documents on the map as Visitor

- Type of user: Visitor
- Precondition: User is not logged in.
- Post condition: See all the icons for the available documents already georeferenced.

### Scenario 2.1: View the details of a specific document

- Type of user: Visitor/Urban Planner/Resident
- Precondition: User is on the main page.
  steps:

1. click on one of the icons of the wanted document

- Post condition: Appears the side bar details, including all the fields filled for the specific document.

### Scenario 3.1: Zoom in/out on the map

- Type of user: Visitor/Urban Planner/Resident
- Precondition: User is on the main page.
  steps:

1. User zoom in or out onn the map using the controls on the bottom part, the pad of the computer or the mouse.

- Post condition: Map zoom in or out.

### Scenario 4.1: Change the view of the map

- Type of user: Visitor/Urban Planner/Resident
- Precondition: User is on the main page.
  steps:

1. User click on the button at the left part "Satellite" and select the view that wants to see.

- Post condition: Map change the view.

### Scenario 5.1: Use the little man in the bottom right part

- Type of user: Visitor/Urban Planner/Resident
- Precondition: User is on the main page.
  steps:

1. User drop the "little man" on the bottom at the right part and select where to put it.

- Post condition: The map shows the exact position where the "little man" was dropped.
