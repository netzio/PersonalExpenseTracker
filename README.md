# Personal Finance Tracker

A full-stack web application to help users track their income, expenses, and budgets with visual insights. Built with React and Node.js, this app allows users to monitor their financial health, categorize transactions, and view spending trends through interactive charts.

---

## Features

- User authentication (sign up, log in, secure password hashing)
- Add, edit, delete income and expense transactions
- Categorize transactions for detailed tracking
- Dashboard with financial summaries (total income, expenses, balance)
- Interactive charts for spending by category and over time
- Set and track monthly budgets
- Export transaction history as CSV
- Responsive design for desktop and mobile

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Chart.js
- **Backend:** Node.js, Express.js, JWT authentication
- **Database:** PostgreSQL 
- **Tools:** Sequelize ORM

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL (or MongoDB)
- npm or yarn

### Installation

1. Clone the repository:

      ```bash
      git clone https://github.com/yourusername/personal-finance-tracker.git
      cd personal-finance-tracker
      ```

2. Setup the backend:
   
      ```bash
      cd server
      npm install
      ```
   
4. Setup environment variables

   Create a .env file in the server directory with the following:
      ```ini
      PORT=5000
      DB_HOST=localhost
      DB_USER=your_db_user
      DB_PASSWORD=your_db_password
      DB_NAME=finance_tracker
      JWT_SECRET=your_jwt_secret
      ```
5. Setup the frontend:
  ```bash
   cd ../client
   npm install
   ```

6. Start the development servers
   ```
   # Backend
   cd server
   npm run dev
   
   # Frontend
   cd client
   npm start
   ```

7. Open http://localhost:3000 in your browser.





   
