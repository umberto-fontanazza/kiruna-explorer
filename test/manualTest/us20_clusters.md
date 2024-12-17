# Manual Test Scenarios for User Story 20

## As a visitor/UP/citizen I want to see points and areas too close represented as a single cluster So that the map is not cluttered

### Scenario 1.1: See georeference of points on the map represented as a single cluster, as visitor

- Type of user: Visitor
- Precondition: User is on the main page of Map.
- Post condition: See all the points too close represented as a single cluster.

### Scenario 1.2: See georeference of points on the map represented as a single cluster, as Urban Planner

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1 user story 1] and is on the main page of Map.
- Post condition: See all the points too close represented as a single cluster.

### Scenario 2.1: click on cluster blue on the map, as Visitor

- Type of user: Visitor
- Precondition: User is on the main page of Map.
- User click on the cluster color blue.
- Post condition: Zoom in on the zone of the cluster, letting see all the documents related to that cluster, or the documents clustered in the same zone.

### Scenario 2.2: click on cluster orange "Documents on the same position" on the map, as Visitor

- Type of user: Visitor
- Precondition: User is on the main page of Map.
- User click on the cluster color orange.
- System display the documents that are in the same position as a list with title.
- User click on the title of the document that wants to see.
- Post condition: System show the description of the selected document.

### Scenario 2.3: click on cluster color blue on the map, as Urban Planner

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1 user story 1] and is on the main page of Map.
- User click on the cluster color blue.
- Post condition: Zoom in on the zone of the cluster, letting see all the documents related to that cluster.

### Scenario 2.4: click on cluster orange "Documents on the same position" on the map, as Visitor

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1 user story 1] and is on the main page of Map.
- User click on the cluster color orange.
- System display the documents that are in the same position as a list with title.
- User click on the title of the document that wants to see.
- Post condition: System show the description of the selected document.

### Scenario 3.1: See georeference of Areas on the map represented as a single cluster, as visitor

- Type of user: Visitor
- Precondition: User is on the main page of Map.
- Post condition: Not yet implemented

### Scenario 3.2: See georeference of Areas on the map represented as a single cluster, as Urban Planner

- Type of user: Urban Planner
- Precondition: User is logged in as an Urban Planner [Scenario 1.1 user story 1] and is on the main page of Map.
- Post condition: Not yet implemented
