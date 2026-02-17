import React, { Component } from "react";
import Navibar from "../components/Navibar";
import ShowArticleById from "../components/article/ShowArticleById";
import "../css/readArticle.css";

export default class ReadArticle extends Component {
    render() {
        return (
            <div className="read-shell">
                <div className="read-shell__nav">
                    <Navibar />
                </div>
                <div className="read-shell__content">
                    <ShowArticleById />
                </div>
            </div>
        );
    }
}
