
## Microservices Architecture

This application is built with a microservices architecture, where each service has its own responsibilities and communicates via REST API.

*   **User Service**: Handles authentication (login) and user management (employees and administrators).
*   **Employee Service**: Handles CRUD employee data.
*   **Attendance Service**: Handles attendance processes (check-in, check-out) and uploads proof photos.

## Setup and Installation

### Prerequisites

*   [Node.js](https://nodejs.org/) (latest version)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [MySQL](https://www.mysql.com/)

### Backend

1.  **Clone this repository**
```bash
    git clone <your-repository-url>
    cd wfh-attendance-system
    ```

2.  **Set up MySQL Database**
*   Create a new database, for example `wfh_attendance_db`.
    *   Note your MySQL database name, username, and password.

3.  **Set up and run `user-service`**
    ```bash
    cd services/user-service
    npm install
    # Configure the .env file (see the Configuration section)
    npm run start
    ```

4.  **Set up and run `employee-service`**
    ```bash
    cd ../employee-service
    npm install
    # Configure the .env file (see the Configuration section)
    npm run start
    ```

5.  **Setup and Run `attendance-service`**
    ```bash
    cd ../attendance-service
    npm install
    # Configure the .env file (see the Configuration section)
    npm run start
    ```
### Frontend

1.  **From the project root, enter the client folder**
    ```bash
    cd client
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the application**
    ```bash
    npm start
    ```
    The application will run at `http://localhost:3000`.

### Configuration

For each backend service (`user-service`, `employee-service`, `attendance-service`), create a `.env` file in the root folder of that service and add the following environment variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=<your_mysql_username>
DB_PASSWORD=<your_mysql_password>
DB_NAME=wfh_attendance_db
PORT=<port_used_by_each_service> # For example, 3001, 3002, 3003
