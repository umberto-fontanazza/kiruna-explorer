1.put the button for the coordinator part

2.put the search bar at the top of the website

3.put the map under the document list table (maybe it helps better)

4.put the filter for the icons that are shown in the document list

![Figma Prototype for Document List Page](client/public/1.png)

"UI Documentation for Handling Documents in the Same Spot"
![Figma Prototype for Handling Documents in the Same Spot](client/public/55.png)

Purpose:
This feature allows users to manage multiple documents efficiently in one location.

Document Count Icon:

1.Displays the number of documents stored.
Acts as a quick access point for managing documents.

2.User clicks the document count icon.
A sidebar appears, showing all documents with options to search and filter.
User manages documents directly from the sidebar.

Design Notes:
Keep the document count icon visible and intuitive.
Ensure the sidebar is non-intrusive and easy to navigate.
Use simple, minimalistic UI for a clean looks.

"UI Documentation for Uploads Page"
![Figma Prototype for Uploads Page](client/public/22.png)
Overview:
The uploads page allows users to view and manage uploaded documents efficiently. It features a table displaying key file details and action icons for quick operations.

Table Details:
Column Description
File Name Name of the uploaded document.
File Type Indicates the type of file (e.g., PDF, Image).
Upload Date Date the file was uploaded.
File Size Size of the file in MB or GB.
Actions Quick access icons for managing documents.

Action Icons:
Icon Action Purpose
Edit Modify file details Opens a modal for editing information.
Location Locate file Navigates to the file's storage location.
Delete Remove file Prompts confirmation to delete a file.
Link open realted doc
View Preview file Opens a preview of the document.

Key Features:
Search Bar: Users can search for files by name.
Pagination: Navigates between pages of uploaded files.

Design diagram

![Figma Prototype for Uploads Page](client/public/66.png)

Design:
Action Icons on Left: Easy access to frequently used actions.

Overview
The diagram page helps users:

See all documents related to the project.
Understand how documents are connected.
Explore documents based on their time (2025, 2030, 2035).
View details about each document, like status and stakeholders.

2. Users of This Page
   Urban Planners: Want to see plans and connections.
   Urban Developers: Interested in how changes affect buildings.
   Visitors: Researchers or people curious about the project.

3. Key Features

3.1 Main Diagram
What it does: Shows all documents (nodes) and their connections.
How it works:
Nodes (dots): Represent documents.
🔴 Red: Important connections (Direct Consequence).
🔵 Blue: Future plans (Projection).
🟡 Yellow: Side effects (Collateral Consequence).

Lines: Connect the documents:
Red line: Shows strong, direct connections.
Solid blue line: Future connections.
Dashed blue line: Indirect or side-effect connections.

3.2 Sidebar
Information displayed:
Document name
Status
Stakeholders involved
Links to download the document

3.3 Time Table

What it does: Groups documents by year.
How it works:
Years like 2025, 2030, and 2035 are shown.
Arrows show the flow of time.
Clicking on a year filters the diagram to show only documents from that time.

3.4 Scale Switcher
What it does: Helps users zoom in or out on the diagram.
How it works: Users can:
Adjust the scale to see more or fewer documents.
Focus on connections or detailed nodes.
