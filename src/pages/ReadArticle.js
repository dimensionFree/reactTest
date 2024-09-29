import React, { Component } from "react";
import Navibar from "../components/Navibar";
import ShowArticleById from "../components/article/ShowArticleById";

export default class ReadArticle extends Component {
    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                <title>Read Article</title>
                <div style={{ marginBottom: '20px' }}>
                    <Navibar />
                </div>
                <div style={{ marginTop: '30px' }}>
                    <ShowArticleById />
                </div>
            </div>
        );
    }
}
