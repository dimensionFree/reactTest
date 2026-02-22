import axios from "axios";
import { message } from "antd";

const host = process.env.REACT_APP_API_HOST || "";
const hostAndPort = host + "/api";
const USER_INFO_KEY = "userInfo";
const REFRESH_AHEAD_SECONDS = 120;

export default class RequestSendUtils {
  static refreshPromise = null;

  static getUserInfo() {
    try {
      return JSON.parse(localStorage.getItem(USER_INFO_KEY));
    } catch (e) {
      return null;
    }
  }

  static setUserInfo(userInfo) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }

  static decodeJwtPayload(token) {
    try {
      const base64Payload = token.split(".")[1];
      if (!base64Payload) {
        return null;
      }
      const normalized = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = atob(normalized);
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

  static getTokenExpireAtMillis(token) {
    const payload = this.decodeJwtPayload(token);
    if (!payload || !payload.exp) {
      return 0;
    }
    return payload.exp * 1000;
  }

  static isTokenExpiringSoon(token, aheadSeconds = REFRESH_AHEAD_SECONDS) {
    if (!token) {
      return false;
    }
    const expireAt = this.getTokenExpireAtMillis(token);
    if (!expireAt) {
      return false;
    }
    return expireAt - Date.now() <= aheadSeconds * 1000;
  }

  static isAuthError(error) {
    const status = error?.response?.status;
    const messageText = (error?.response?.data?.message || "").toLowerCase();
    const errorCode = error?.response?.data?.body?.code;
    return (
      errorCode === "3000" ||
      status === 401 ||
      (status === 400 && messageText.includes("token")) ||
      messageText.includes("重新登录") ||
      messageText.includes("失效")
    );
  }

  static async refreshAccessToken() {
    const userInfo = this.getUserInfo();
    const refreshToken = userInfo?.refreshToken;
    if (!refreshToken) {
      throw new Error("No refresh token");
    }
    const response = await axios.post(
      hostAndPort + "/user/refresh",
      { refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );
    const nextInfo = response?.data?.dataContent;
    if (!nextInfo || !nextInfo.token) {
      throw new Error("Refresh failed");
    }
    this.setUserInfo(nextInfo);
    return nextInfo.token;
  }

  static async ensureValidToken(forceRefresh = false) {
    const currentToken = this.getToken();
    if (!currentToken) {
      return "";
    }
    if (!forceRefresh && !this.isTokenExpiringSoon(currentToken)) {
      return currentToken;
    }
    if (!this.refreshPromise) {
      this.refreshPromise = this.refreshAccessToken().finally(() => {
        this.refreshPromise = null;
      });
    }
    return this.refreshPromise;
  }

  static async sendRequestRaw(method, url, payload, token, retried = false) {
    const useAuth = !!token;
    const headers = { "Content-Type": "application/json" };
    if (useAuth) {
      await this.ensureValidToken(false);
      headers.Authorization = "Bearer " + this.getToken();
    }
    try {
      return await axios({
        method,
        url: hostAndPort + url,
        data: payload,
        headers,
      });
    } catch (error) {
      if (useAuth && !retried && this.isAuthError(error)) {
        try {
          await this.ensureValidToken(true);
          return await this.sendRequestRaw(method, url, payload, this.getToken(), true);
        } catch (refreshError) {
          this.quitUser();
          throw refreshError;
        }
      }
      if (useAuth && this.isAuthError(error)) {
        this.quitUser();
      }
      throw error;
    }
  }

  static async sendPostWithReturn(url, payload, token) {
    const response = await this.sendRequestRaw("post", url, payload, token);
    return response.data;
  }

  static async sendGetWithReturn(url, token) {
    const response = await this.sendRequestRaw("get", url, null, token);
    return response.data;
  }

  static async sendPutWithReturn(url, payload, token) {
    const response = await this.sendRequestRaw("put", url, payload, token);
    return response.data;
  }

  static async sendPatchWithReturn(url, payload, token) {
    const response = await this.sendRequestRaw("patch", url, payload, token);
    return response.data;
  }

  static async sendDeleteWithReturn(url, token) {
    return this.sendRequestRaw("delete", url, null, token);
  }

  static sendGet(url, token, callBackFunc, errbackFunc) {
    this.sendRequestRaw("get", url, null, token)
      .then((response) => callBackFunc(response))
      .catch((error) => {
        message.error(error?.response?.data?.message || "Error occurs");
        errbackFunc(error);
      });
  }

  static sendDelete(url, token, callBackFunc, errbackFunc) {
    this.sendRequestRaw("delete", url, null, token)
      .then((response) => callBackFunc(response))
      .catch((error) => errbackFunc(error));
  }

  static getToken() {
    const userInfo = this.getUserInfo();
    return userInfo?.token || "";
  }

  static async keepAlive() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    await this.sendGetWithReturn("/user/session/ping", token);
    return true;
  }

  static quitUser() {
    localStorage.removeItem(USER_INFO_KEY);
    window.location.href = "/";
  }
}
