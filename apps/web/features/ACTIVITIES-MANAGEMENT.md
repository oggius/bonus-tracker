Activies management functionality. 

General description:
- as ADMIN, I want to be able to manage the list of predefined activies for which user can request points when this activity is complete. 
- as USER, I want to be able to see the list of activities for which I can get points and select item from the list in order to prefill points amount and comment for submitting the points request form. This functionality works as a helper to avoid manually fill the form but I still should be able to send a request with custom amount and text

Admin Flow
- add new navigation item in bottom navigation alled Активності with corresponding icon. The item should be placed between "Панель" and "Нагороди". Clicking on it opens activities management page
- the overall activities management layout and functionality is similar to rewards management, same CRUD appoach. Couple of differences: 
-- no need for active / inactive state. No soft delete required either. ADMIN can see the list, create, edit and delete activity. 
-- admin should be able to change the order of activities using drag and drop. The order of activities in the admin panel corresdonds to the order of available for the user
-- each activity has value in points and description. The same values will be used for points request so use consistent vars and db columns names
-- make sure the layout is mobile first and the layout is not broken on mobile screen
- on the dashboard (Панел) screen add new section to redirect to activies management called "Управління активностями" with corresponding icon. Similarly to other sections on this page, add tag "Нагороди" and use the yellow color for background and orange font for this tag - the colors which are currently used for "Нагороди" tag in "Управління нагородами" section. Replace current yellow backgroud and orange text for "Нагороди" tag in "Управління нагородами" section with light blue for background and darker blue for text. The pallete should be consistent with general styling. The sections on the Панель page should be in the following order: 1. Управління очками; 2. Управління активностями; 3. Управління нагородами

User Flow
- on the points request (Запит) screen add another section with predefined activities. The section heading should be "Популярні активності". 
- the section contains the list of predefined activites with points value for each of them defined by admin. Each list item is clickable and also contains a button on the right side. By clicking both on the button and on the whole item list, the submit form prepopulates with item points value description text but the form SHOULD NOT be submitted automatically. 
- the section works as a helper for the user to prefill points request form instead of populating points and description manually. However user still can populate the form manually if he wants. 
- section with pending requests should be visible only when there are any pending requests. The section should be hidden if therer are no pending requests. If there are pending requests, the section should appear between pending requests and available activities

Implement activities management functionality. Any additional comments or information you discover in the process should be added into ADDITIONAL INFORMATION section of features/ACTIVITIES-MANAGEMENT.md

ADDITIONAL INFORMATION
- Activities are stored in a dedicated `Activity` table with fields `description`, `points`, and `order`; order is persisted explicitly and used by both admin and user views.
- No default activities are seeded. Admin creates activities from scratch.
- Drag-and-drop reordering uses native HTML5 DnD in the admin list and saves order explicitly via a server action.
- User helper section applies prefill only (amount + description) and does not auto-submit.
- Pending requests block is now conditionally rendered only when the user has at least one pending request.