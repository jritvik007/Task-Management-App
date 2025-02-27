Task Management Application

Project Overview

This Task Management Application is a full-stack web application designed to help users manage their tasks efficiently. It provides essential task management features such as creating, updating, and deleting tasks, along with advanced functionalities like category navigation via a slider, automatic task timeout handling, and real-time data streaming.

Features

Frontend

1. Task List: Displays a list of all tasks.

2. Task Item: Shows individual task details.

3. Task Form: Allows users to add and edit tasks with proper validation.

4. Category Slider: Enables users to switch between different task categories ("To Do", "In Progress", "Done", "Timeout").

5. State Management: Utilizes React hooks or Context API for efficient state handling.

6. API Integration: Fetches task data using async/await with proper error handling.

7. Timeout Handling: Automatically moves overdue tasks to the "Timeout" category.

User Experience Enhancements:

1. Error messages for failed API calls.

2. Responsive and accessible design using tailwind CSS.

Backend

Endpoints:

1. GET /tasks - Fetch all tasks.

2. GET /tasks/:id - Fetch a specific task by ID.

3. POST /tasks - Create a new task.

4. PUT /tasks/:id - Update an existing task.

5. DELETE /tasks/:id - Remove a task.

6. GET /streaming - Fetch real-time data from a streaming API

7. Database: Used an in-memory database SQLite.

8. Error Handling: Implements robust error validation for API requests.

9. Async Challenge: Fetches additional data from an external streaming API and integrates it with task details.

Tech Stack

Frontend

1. Framework: React with TypeScript

2. Styling: Tailwind CSS

3. State Management: React hooks / Context API

4. Form Handling: Controlled components with validation

5. API Requests: Fetch API / Axios

Backend

1. Framework: Node.js with Express and TypeScript

2. Database: SQLite

3. Streaming API: Twitch API

Installation and Setup

Prerequisites

Ensure you have the following installed:

1. Node.js (>=14.x)

2. npm

3. SQLite

Clone the Repository

https://github.com/jritvik007/Task-Management-App.git

cd task-manager

Backend Setup

1. Navigate to the backend folder:

cd task-manager-backend

2. Install dependencies:

npm install

3. Start the backend server:

npm run dev

Frontend Setup

1. Navigate to the frontend folder:

cd task-manager-frontend

2. Install dependencies:

npm install

3. Start the frontend development server:

npm run dev

Live Demo

Frontend: Live Demo Link

Backend API: Live API Link




