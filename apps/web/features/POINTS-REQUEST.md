Add new functionality: user himself can initiate adding points to his balance, admin can approve or reject this proposal from the admin panel. 

User side: 
- on the frontend, use the screen (ui / styles)  which was present on initial design but we agreed to comment it out
- the same page should contain the list of pending requests which were sent for approval but were not yet approved. Use consistent styling of tiles, labels etc. for that additional section. The list of pending requests should be below the main request form
- the user enters the number of points and plain text explaining for which activity he expects to get additional points
- if request was rejected, no need for any additional notifications and no need for keeping this request in the list of requests on the user side. 
- If request is approved, it disappears from the list of requests and shows up in the history. Obviously, the balance should be updated too. 
- all the copy should be in Ukraininan

Admin side
- the functionality might rely on PointsLog table, with just some additional field for the status (PENDING, APPROVED, REJECTED). PENDING - request was created by user but not approved or rejected by admin. APPROVED - request was approved by admin; REJECTED - request was rejected by admin. 
- If there are pending requests, show them in a separate block above “Додати операцію” block on the /admin/points screen. Highlight the block with light-yellow background or in any other styles consistent way so that it would draw attention that the action is required
- if the request is approved or rejected, it should disappear from the pending requests highlighted block and appear in the “Історія операцій” block at the bottom of the page
- if the points are added by the admin, the entry in the DB is created with APPROVED state
- if the database add column “initiatedBy” to indicate if the request was initiated by the user or admin. If this functionality is already present in the db with different column name or even approach then ignore this instruction

Ask any additional questions to get all the information you need