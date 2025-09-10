// import pkg from "pg";
// import dotenv from "dotenv";

// dotenv.config(); // чтобы Node.js читал .env

// const { Pool } = pkg;

// const pool = new Pool({
// 	connectionString: process.env.DATABASE_URL, // из .env
// 	ssl: {
// 		rejectUnauthorized: false // обязательно для Render
// 	}
// });

// export default pool;


import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export default pool;
