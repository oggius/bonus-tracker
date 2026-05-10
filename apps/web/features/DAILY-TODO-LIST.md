ToDo list of required and additional activities. 

General description:
- as USER, I want to have a checklist of required and additional activities, which would automatically reset every day and would reward me with +1 additional point when fully completed. Every day the list is reset, the required daily activities become unchecked, the list of additional activities becomes empty

User Flow
- change "Баланс" navigation item to "Мій день". Change "star" icon to "todo list" icon
- change the layout of the ex-balance (My day) page to the one which is used in "Магазин" page: at the very top add page title "Мій день". Below the title - keep the balance block. Below the balance block - new section called "Справи на сьогодні (weekday, dd month)" where weekday is name of the weekday in Ukrainian, dd is day number and month is the month name in Ukrainian. 
- "Справи на сьогодні" is a TODO checklist with following requirements
  - todo list consists of 2 separate subsectoins: required daily actions (Щоденні обовʼязкові справи) and additional actions for today (Додаткові плани на сьогодні). Required daily actions consist of the following hardcoded items: 
    - Покупатись
    - Нанести антиперспірант
    - Почистити зубки
    - Застелити ліжко
    - Одягтись в шкільний або домашній одяг
  - the user can not add or delete items in required daily actions. The user can only check and uncheck items in this section
  - the additional actions for today behaves like a normal todo list, where user can add new item into todo, remove item from todo, edit item in the list. The user can also check and uncheck items in this section
  - every time the user tries to check the item in either of the sections, the confirmation popup should appear. The text on the popup is "Чесно-чесно зробив?" and the 2 action buttons contain text "Чесно-чесно!" + thumbs up emotion for confirmation and "Пожартував + smiling emotion" for cancellation
  - every time the user checks the item in either of the section and confirms the action in the dialog, the toster with the motivational text should appear. The toster should not block the other items in the checklist. I intentionally do not provide the toster position instructions, follow UI best practices on this one or ask for additional info if needed. The variants of the motivational text are: "Молодець, так тримати!", "Чудово!", "Супер, те що треба!", "Продовжуй в тому ж дусі!"
  - When user checks all of the required actions, but there are still unchecked additional actions or the are no additional actions for this day, the popup should appear with the text "Чудово, так тримати! Виконай інші заплановані cправи - і отримай додаткове 1 очко!". The section should track the state if the popup was shown and do not show it until the state is reset.
  - When user checks all of the additional actions, but there are still unchecked required actions, the popup should appear with the text "Молодець! Дороби обовʼязкові справи - і отримай додаткове 1 очко!". The section should track the state if the popup was shown and do not show it until the state is reset.
  - When user checks all of the requried and additional actions (at least 1 additional action should have been added and checked), the congratulations popup should appear with the text with big :tada: emoji at the top and text "Круто, ти виконав усі заплановані справи! Лови додаткове 1 очко!" below. At the same time automatically Add Point Request (the same which is sent from "запит" screen) should be sent with parameters: 1 for points amount and "Виконав всі заплановані справи!" as description. The todo list should track the state if the popup was shown and request for additional point was sent - and do not show the popup and send the request until the state is reset.
  - All of the above popups should only contain cross button in the top right corner to close popup, no other buttons required.
  - The checklist must be reset every day at midnight (00:00): all the items in the required section become unchecked, and all the items in additional section are removed. The state of all of the popups is reset, the state of the "send to server" request should be reset either. 
  - Checklist doesn't require any additional communication with the server (except Add Points Request upon completion), it should be stored on the client side and all of the logic, including calculating time for reset, current date and day of the week - everthing should be calculated on the client side with no external API calls

Implement ToDo list of required and additional activities functionality. Any additional comments or information you discover in the process should be added into ADDITIONAL INFORMATION section of features/DAILY-TODO-LIST.md
-- 

ADDITIONAL INFORMATION
