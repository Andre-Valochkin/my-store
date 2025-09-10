// import express from "express";
// import cors from "cors";
// import productsRouter from "./routes/products.js";
// import categoriesRouter from "./routes/categories.js";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();

// // Список разрешенных origin берём из env
// const allowedOrigins = [
// 	process.env.FRONTEND_LOCAL,
// 	process.env.FRONTEND_PROD,
// ];

// app.use(cors({
// 	origin: function (origin, callback) {
// 		if (!origin || allowedOrigins.includes(origin)) {
// 			callback(null, true);
// 		} else {
// 			callback(new Error("Not allowed by CORS"));
// 		}
// 	}
// }));

// app.use(express.json());

// app.use("/products", productsRouter);
// app.use("/categories", categoriesRouter);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
// 	console.log(`✅ Backend running at http://localhost:${PORT}`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";

dotenv.config();

const app = express();

const allowedOrigins =
	process.env.NODE_ENV === "production"
		? [process.env.FRONTEND_PROD]
		: [process.env.FRONTEND_LOCAL, "http://localhost:5173"];

app.use(cors({
	origin: function (origin, callback) {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	}
}));

app.use(express.json());

app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`✅ Backend running at http://localhost:${PORT}`);
});
