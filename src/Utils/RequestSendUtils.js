import axios from "axios";

const host = " http://localhost";

const port = "80";

const hostAndPort=host+":"+port

export default class RequestSendUtils {

    SendPost(url, payload, token, callBackFunc,errbackFunc) {
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


    setToken(token, headers) {
        if (token) {
            headers.Authorization = "Bearer " + token;
        }
    }

    SendGet(url, token, callBackFunc,errbackFunc) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
            // 'Authorization': 'Bearer YourAccessToken' // 例如添加身份验证令牌
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
}