# PostgreSQL User and Address Management

This project demonstrates how to create and manage a PostgreSQL database table for users and addresses using Node.js with the `pg` library. The code includes examples of best practices for database operations, such as preventing SQL injection attacks and using transactions.

## Prerequisites

- Node.js (v14.x or later)
- PostgreSQL (v13.x or later)
- `pg` library for Node.js

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/neeleshkr22/postgreSQL.git
    cd postgreSQL
    ```

2. **Install dependencies using Yarn:**

    ```bash
    yarn install
    ```

3. **Set up your PostgreSQL database:**

    Ensure your PostgreSQL server is running and create a database if you haven't already:

    ```sql
    CREATE DATABASE your_database_name;
    ```

4. **Update the connection string:**

    Modify the connection string in the code with your PostgreSQL credentials:

    ```javascript
    const client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'your_database_name',
        user: 'your_username',
        password: 'your_password',
    });
    ```

## Usage

### 1. Creating the Users Table

The `createUsersTable()` function creates a `users` table in the database:

```javascript
async function createUsersTable() {
    await client.connect();
    const result = await client.query(`
        CREATE TABLE users(
         id SERIAL PRIMARY KEY,
         username VARCHAR(50) UNIQUE NOT NULL,
         email VARCHAR(255) UNIQUE NOT NULL,
         password VARCHAR(255) NOT NULL,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `)
    console.log(result);
}
createUsersTable();
```
### 2. Inserting Data (Preventing SQL Injection)

The `insertData()` function inserts user data into the users table using parameterized queries to prevent SQL injection.

```javascript
async function insertData(username: string, email: string, password: string) {
    await client.connect();
    const insertQuery = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
    const values = [username, email, password];
    const res = await client.query(insertQuery, values);
    console.log('Insertion success:', res);
    await client.end();
}
insertData('username5', 'user5@example.com', 'user_password');
```

### 3. Retrieving User Data
The `getUserData(email: string)` function retrieves a user's data based on their email:

```javascript
async function getUserData(email: string) {
    await client.connect();
    const query = `SELECT * FROM users WHERE email = $1`;
    const value = [email];
    const res = await client.query(query, value);
    if(res.rows.length > 0) {
        console.log("User found", res.rows[0]);
    } else {
        console.log("User not found");
    }
    await client.end();
}
getUserData('neelesh22@gmail.com');
```

### 4. Inserting User and Address with Transaction

The `insertUserAndAddress()` function inserts a user's information along with their address into two separate tables (`users` and `addresses`) using a transaction to ensure data consistency:

```javascript
async function insertUserAndAddress(
    username: string, 
    email: string, 
    password: string, 
    city: string, 
    country: string, 
    street: string, 
    pincode: string
) {
    await client.connect();

    try {
        await client.query('BEGIN');

        const insertUserText = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;
        const userRes = await client.query(insertUserText, [username, email, password]);
        const userId = userRes.rows[0].id;

        const insertAddressText = `
            INSERT INTO addresses (user_id, city, country, street, pincode)
            VALUES ($1, $2, $3, $4, $5);
        `;
        await client.query(insertAddressText, [userId, city, country, street, pincode]);

        await client.query('COMMIT');
        console.log('User and address inserted successfully');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error during transaction, rolled back.', err);
    } finally {
        await client.end();
    }
}
insertUserAndAddress(
    'johndoe', 
    'john.doe@example.com', 
    'securepassword123', 
    'New York', 
    'USA', 
    '123 Broadway St', 
    '10001'
);
```

## Running the Code
To run the code using Node.js, execute the following command:
```bash
yarn start
```





