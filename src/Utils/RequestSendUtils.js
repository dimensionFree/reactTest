import axios from "axios";


const host = process.env.REACT_APP_API_HOST || "";
const hostAndPort=host+"/api"

export default class RequestSendUtils {

    static sendPost(url, payload, token, callBackFunc, errbackFunc) {
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
        })
            .catch((error) => {
                // 抛出错误以便在调用时进行处理
                throw error;
            });
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


    static sendGetWithReturn(url, token) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
        }

        this.setToken(token, headers);

        // console.log(!token);
        // console.log(headers);

        // 返回一个 Promise
        return axios.get(hostAndPort + url, {
            headers,
        })
            .then((response) => {
                // 返回成功的结果
                return response.data;
            })
            .catch((error) => {
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

        // console.log(!token);
        // console.log(headers);

        // 返回一个 Promise
        return axios.put(hostAndPort + url,payload, {
            headers,
        })
            .then((response) => {
                // 返回成功的结果
                return response.data;
            })
            .catch((error) => {
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

        // console.log(!token);
        // console.log(headers);

        // 返回一个 Promise
        return axios.patch(hostAndPort + url,payload, {
            headers,
        })
            .then((response) => {
                // 返回成功的结果
                return response.data;
            })
            .catch((error) => {
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
    static sendDeleteWithReturn(url, token) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
        }

        this.setToken(token, headers);

        // console.log(!token);
        // console.log(headers);
        return  axios.delete(hostAndPort + url,{
            headers
        }).then(function (response) {
            return response;
        }).catch(function (error) {
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


}