import React, {Component} from "react";
import '../../css/LatestArticle.css'
import axios from "axios";

export default class LatestArticle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            preface: ""
        };
        this.getLatestArticle = this.getLatestArticle.bind(this)

    }
    componentDidMount() {

        this.getLatestArticle();
    }


    getLatestArticle() {
        // axios.get('http://localhost/article/latest'
        //     , {
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded', // 设置请求内容类型为 JSON
        //             // 还可以添加其他自定义请求头
        //             // 'Authorization': 'Bearer YourAccessToken' // 例如添加身份验证令牌
        //         }
        //     }).then(function (response) {
        //     if (response.status == 200) {
        //         // alert(response.data)
        //         const data = response.data; // 获取响应数据
        //         const userInfo = data.dataContent; // 从响应数据中获取令牌
        //
        //     }
        // }).catch(function (error) {
        //     console.log(error);
        // });
    }

    render() {
        const title=this.state.title;
        const preface=this.state.preface;


        return (
            <div className="jumbotron p-4 p-md-5 text-dark rounded text-center" >
                <div className="d-flex justify-content-center align-items-center">
                <div className="col-md-6 px-0">
                    <h1 className="display-4 font-italic">
                        {title?title:"got some article pls"}
                    </h1>
                    <p className="lead my-3">
                        {preface?preface:"got some preface pls"}
                    </p>
                    <p className="lead mb-0"><a href="#" className="text-dark font-weight-bold">Continue reading...</a>
                    </p>
                </div>
                </div>

            </div>

        )
    }
}
