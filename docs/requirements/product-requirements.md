# Product Requirements

## 1. Calendar View
- UI supports both monthly and weekly views, with an option to switch between them
- Users can navigate between months and weeks
- Today's date is highlighted in both views
- Calendar week starts on Monday

## 2. Tasks
- Each task has a title (required) and an assigned color (chosen from a predefined palette of 10–12 colors)
- Users can create, edit (title and color), and delete tasks
- No "completed" status or additional details

## 3. Drag & Drop
- Users can drag and drop tasks to any day currently visible on the calendar, including past days
- Users can reorder tasks within the same day via drag & drop

## 4. Task Display
- Only the title and color of each task are shown
- By default, tasks are ordered by creation time
- Users can manually reorder tasks within a day
- Up to 5 tasks per day are visible at once; if there are more, users can either click "see more" or scroll (implementation choice)

## 5. Persistence & Multi-User Support
- Tasks are stored in a file-based backend (e.g., a JSON file)
- Each user's tasks are associated with their email (from passwordless authentication)
- Multiple users are supported, each with their own task list
- Data will not persist across server restarts (acceptable for now)

## 6. Recurring Tasks
- When creating a task, users can choose to make it recurring
- Recurrence options:
  - Frequency: Daily (including weekends), Weekly (choose a day of the week), or Monthly (choose a date of the month)
  - End date: User selects a date when recurrence stops (no infinite recurrence)
- For monthly recurrence, if the chosen date does not exist in a month (e.g., 31st in February), the task should appear on the last day of that month

## 7. Out of Scope (for now)
- Notifications or reminders
- Search or filter functionality
- Exporting or printing tasks/calendar
- Task completion status
- Any integrations with third-party services
- User profile page 