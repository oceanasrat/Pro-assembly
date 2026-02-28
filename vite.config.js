import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you deploy to GitHub Pages, set base to "/YOUR_REPO_NAME/".
// Example: base: "/pro-assembly/"
export default defineConfig({
  plugins: [react()],
});
