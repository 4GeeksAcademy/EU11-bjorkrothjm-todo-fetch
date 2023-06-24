//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";

// include your styles into the webpack bundle
import "../styles/index.css";

//import your own components
import Home from "./component/home.jsx";

//import { App } from "./component/app.jsx"
import { AppX } from "./component/appx.jsx"


//render your react application
ReactDOM.render(<AppX />, document.querySelector("#app"));
