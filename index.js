import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "node:url";

const PORT = process.env.PORT || 3000;
const app = express();
app.listen(PORT, () => {
	console.log(`✅ Server running at: http://localhost:${PORT}`);
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));
