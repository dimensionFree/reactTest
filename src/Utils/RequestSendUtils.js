import axios from "axios";
import {message} from "antd";


const host = process.env.REACT_APP_API_HOST || "";
const hostAndPort=host+"/api"

export default class RequestSendUtils {

    static sendPostWithReturn(url, payload, token) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
            // 'Authorization': 'Bearer YourAccessToken' // 例如添加身份验证令牌
        }
        this.setToken(token, headers);
        return  axios.post(hostAndPort + url,
            payload
            , {
                headers
            }).then((response) => {
            // 返回成功的结果
            return response.data;
        }).catch((error) => {
                RequestSendUtils.checkQuit(error);
                throw error;
            });
    }


    static checkQuit(error) {
        // 安全访问 error.response.data.body.code，防止未定义属性导致错误
        console.log("checking quit")
        const errorCode = error.response?.data?.body?.code;
        console.log(errorCode)

        if (errorCode === "3000") {
            // 如果是 token 失效的错误码，调用退出登录逻辑
            RequestSendUtils.quitUser();
        }
    }

    static setToken(token, headers) {

        if (token) {
            headers.Authorization = "Bearer " + token;
        }
    }

    static sendGet(url, token, callBackFunc, errbackFunc) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
        }

        this.setToken(token, headers);
        axios.get(hostAndPort + url,{
            headers
        }).then(function (response) {
            console.log("response")
            callBackFunc(response);
        }).catch(function (error) {
            console.log("error")
            console.log(error.response)
            message.error(error.response?.data?.message || "Error occurs");
            RequestSendUtils.checkQuit(error);
            errbackFunc(error);
        });
    }


    static sendGetWithReturn(url, token) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
        }

        this.setToken(token, headers);

        // 返回一个 Promise
        return axios.get(hostAndPort + url, {
            headers,
        })
            .then((response) => {
                // 返回成功的结果
                return response.data;
            })
            .catch((error) => {
                RequestSendUtils.checkQuit(error);

                // 抛出错误以便在调用时进行处理
                throw error;
            });

    }


    static sendPutWithReturn(url,payload, token) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
        }

        this.setToken(token, headers);

        // 返回一个 Promise
        return axios.put(hostAndPort + url,payload, {
            headers,
        })
            .then((response) => {
                // 返回成功的结果
                return response.data;
            })
            .catch((error) => {
                RequestSendUtils.checkQuit(error);

                // 抛出错误以便在调用时进行处理
                throw error;
            });

    }
    static sendPatchWithReturn(url,payload, token) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
        }

        this.setToken(token, headers);

        // 返回一个 Promise
        return axios.patch(hostAndPort + url,payload, {
            headers,
        })
            .then((response) => {
                // 返回成功的结果
                return response.data;
            })
            .catch((error) => {
                RequestSendUtils.checkQuit(error);

                // 抛出错误以便在调用时进行处理
                throw error;
            });

    }


    static sendDelete(url, token, callBackFunc, errbackFunc) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
        }

        this.setToken(token, headers);
        axios.delete(hostAndPort + url,{
            headers
        }).then(function (response) {
            callBackFunc(response);
        }).catch(function (error) {
            RequestSendUtils.checkQuit(error);

            errbackFunc(error);
        });
    }
    static sendDeleteWithReturn(url, token) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
        }

        this.setToken(token, headers);
        return  axios.delete(hostAndPort + url,{
            headers
        }).then(function (response) {
            return response;
        }).catch(function (error) {
            RequestSendUtils.checkQuit(error);

            throw error;
        });
    }



    static getToken(){
        // 从 localStorage 中获取用户信息
        var token="";
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            token = userInfo.token;
        }
        return token;
    }

    static quitUser() {
        localStorage.removeItem("userInfo")
        window.location.href = "/"
    }

}