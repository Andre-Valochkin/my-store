import express from "express";
import cors from "cors";

import getCategories from "./api/categories.js";
import getProducts from "./api/products.js";

const app = express();
app.use(cors());

app.get("/api/categories", getCategories);
app.get("/api/products", getProducts);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
