import { app } from "./app.js";
import { connectDB } from "./lib/db.js";
import { env } from "./lib/env.js";

await connectDB();

app.listen(env.PORT, () => {
  console.log(`🚀 API escuchando en http://localhost:${env.PORT}`);
});
