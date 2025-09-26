import ReactDOMServer from "react-dom/server";
import { App } from "./App.jsx";

export async function render() {
  return ReactDOMServer.renderToString(<App />);
}
