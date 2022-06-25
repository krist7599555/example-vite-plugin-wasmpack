import "./app.css";
import App from "./app.svelte";

// @ts-ignore
const app = new App({
  target: document.getElementById("app"),
});

export default app;
