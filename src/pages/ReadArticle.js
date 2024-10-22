import React, { Component } from "react";
import Navibar from "../components/Navibar";
import ShowArticleById from "../components/article/ShowArticleById";

export default class ReadArticle extends Component {
    render() {
        return (
            <div>
                <div style={{ marginBottom: '20px' }}>
                    <Navibar />
                </div>
                <div className={"container"} style={{display: 'flex', flexDirection: 'column', padding: '20px', marginTop: '30px' }}>
                    <ShowArticleById />
                </div>
            </div>
        );
    }
}
