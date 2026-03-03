## TO DOs:

- Editable Session Log
User Story: As a user, I want to edit or delete specific entries in my session log so that I can correct mistakes or remove unnecessary notes. Also the transcript should be editable
Features:
Edit button for each log entry to modify the text.
Delete button to remove specific entries.

- Persistent Data
User Story: As a user, I want my session log and timer settings to be saved so that I can access them even after refreshing the page.
Features:
Save session log and timer settings to local storage.
Load saved data when the app is reopened.

- Session Progress Indicator
User Story: As a user, I want to see a visual representation of my progress during a session so that I can stay motivated.
Features:
A progress bar that fills up as the session progresses.
Different colors for work sessions and breaks.

- Dark Mode
User Story: As a user, I want a dark mode option so that I can use the app comfortably in low-light environments.
Features:
Toggle between light and dark themes.
Save the user's theme preference in local storage.

- Notifications
User Story: As a user, I want to receive notifications when my work session or break ends so that I can stay on track.
Features:
Browser notifications when the timer ends.
Optional sound alerts for session and break completion.

- Session History in LocalStorage
User Story: As a user, I want to see a history of my past sessions stored in localStorage so that I can review my progress over time.
Features:
Save completed session logs to localStorage after each session ends.
Add a "View History" button to display past session logs in a modal or separate page.
Allow users to clear the session history.

- Current Session Persistence with SessionStorage
User Story: As a user, I want my current session data (timers and logs) to persist even if I refresh the page so that I don’t lose my progress.
Features:
Save the current session's timer values and session log to sessionStorage.
Load the current session's data from sessionStorage when the app is refreshed.