import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import LoginForm from "./components/LoginForm";
import 'jquery'
import 'popper.js'
import HP from "./pages/HP";


export default function App() {
    return (
        <HP></HP>
    );
}

// You can think of these components as "pages"
// in your app.


