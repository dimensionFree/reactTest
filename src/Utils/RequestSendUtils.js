import axios from "axios";

const host = " http://localhost";

const port = "80";

const hostAndPort=host+":"+port

export default class RequestSendUtils {

    static SendPost(url, payload, token, callBackFunc,errbackFunc) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
            // 'Authorization': 'Bearer YourAccessToken' // 例如添加身份验证令牌
        }
        this.setToken(token, headers);
        axios.post(hostAndPort + url,
            payload
            , {
                headers
            }).then(function (response) {
                callBackFunc(response);
        }).catch(function (error) {
            errbackFunc(error);
        });
    }


    static setToken(token, headers) {

        if (token) {
            headers.Authorization = "Bearer " + token;
            // 'Authorization': 'Bearer YourAccessToken' // 添加身份验证令牌
        }
    }

    static SendGet(url, token, callBackFunc,errbackFunc) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
        }

        this.setToken(token, headers);

        // console.log(!token);
        // console.log(headers);
        axios.get(hostAndPort + url,{
            headers
        }).then(function (response) {
            callBackFunc(response);
        }).catch(function (error) {
            errbackFunc(error);
        });
    }


    static SendDelete(url, token, callBackFunc,errbackFunc) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
        }

        this.setToken(token, headers);

        // console.log(!token);
        // console.log(headers);
        axios.delete(hostAndPort + url,{
            headers
        }).then(function (response) {
            callBackFunc(response);
        }).catch(function (error) {
            errbackFunc(error);
        });
    }
    static SendDeleteWithoutCallBack(url, token) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
        }

        this.setToken(token, headers);

        // console.log(!token);
        // console.log(headers);
        axios.delete(hostAndPort + url,{
            headers
        });

    }


}