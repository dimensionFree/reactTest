import axios from "axios";

const host = " http://localhost";

const port = "80";

export default class RequestSendUtils {

    SendPost(url, payload, token, callBackFunc) {
        let headers = {
            'Content-Type': 'application/json', // 设置请求内容类型为 JSON
            // 还可以添加其他自定义请求头
            // 'Authorization': 'Bearer YourAccessToken' // 例如添加身份验证令牌
        }
        if (!token) {
            headers.Authorization = token;
        }
        axios.post(host + url,
            payload
            , {
                headers
            }).then(function (response) {
                callBackFunc(response);
            //
            // if (response.status == 200) {
            //     // alert(response.data)
            //     const data = response.data; // 获取响应数据
            //     const userInfo = data.dataContent; // 从响应数据中获取令牌
            //     // 将令牌存储到localStorage
            //     localStorage.setItem('userInfo', JSON.stringify(userInfo));
            //     //本地窗口
            //     window.location.href = "/"
            //
            //     //新窗口
            //     // const w = window.open('_black') //这里是打开新窗口
            //     // let url = 'http://localhost:3000/'
            //     //     // '这里是url，可以写../../index，也可以写http://www.baidu.com'
            //     // w.location.href = url //这样就可以跳转了
            //
            // }
            // alert(this.state.username + "  " + this.state.password + response);
            // alert()
            // console.log(response);
        }).catch(function (error) {
            alert(error.response.data.message);
        });
    }
}