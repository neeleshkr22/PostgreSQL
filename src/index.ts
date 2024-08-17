//write a function to create a user tables in your database
import { Client, Connection } from "pg";

const client = new Client({
    connectionString: 'postgresql://neondb_owner:AQPwy8gn2IJF@ep-dawn-pine-a5eguq73.us-east-2.aws.neon.tech/neondb?sslmode=require'
})


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



async function DEMOinsertData() {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'neeleshkr22',
    });
  
    try {
      await client.connect(); 
      const insertQuery = "INSERT INTO users (username, email, password) VALUES ('username2', 'user3@example.com', 'user_password');";
      const res = await client.query(insertQuery);
      console.log('Insertion success:', res); 
    } catch (err) {
      console.error('Error during the insertion:', err);
    } finally {
      await client.end(); // Close the client connection
    }
}
DEMOinsertData(); //can cause SQL injection



async function insertData(username: string, email: string, password: string) {
    const client = new Client({
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'mysecretpassword',
    });
  
    try {
      await client.connect(); // Ensure client connection is established
      // Use parameterized query to prevent SQL injection
      const insertQuery = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)"; //$ syntax can prevent sql injection
      const values = [username, email, password];
      const res = await client.query(insertQuery, values);
      console.log('Insertion success:', res); // Output insertion result
    } catch (err) {
      console.error('Error during the insertion:', err);
    } finally {
      await client.end(); // Close the client connection
    }
} 
// Example usage
insertData('username5', 'user5@example.com', 'user_password').catch(console.error);


//Better method to get data from user and prevent SQL injection
async function getUserData(email:string) {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'neeleshkr22',
    });
    try{
        await client.connect();
        const query = `SELECT * FROM users WHERE email  = $1 `;
        const value = [email];
        const res = await client.query(query, value);
        if(res.rows.length >0){
            console.log("user found", res.rows[0]);  
        }else{
            console.log("user not found");
        }
    }catch(err){
        console.log("Error occured", err);
        throw err;
    }finally{
        await client.end();
    }
}
getUserData("neelesh22@gmail.com").catch(console.error);

