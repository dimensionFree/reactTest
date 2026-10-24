import React, { useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Helmet from "react-helmet";
import Navibar from "../components/Navibar";
import RequestSendUtils from "../Utils/RequestSendUtils";
import "../css/formSurface.css";
import "../css/changePassword.css";

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_BYTES = 72;
const EMPTY_PASSWORDS = { currentPassword: "", newPassword: "", confirmPassword: "" };

const validatePasswords = ({ currentPassword, newPassword, confirmPassword }) => {
  if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
    return "すべての項目を入力してください。";
  }
  if ([...newPassword].length < MIN_PASSWORD_LENGTH || new Blob([newPassword]).size > MAX_PASSWORD_BYTES
      || newPassword.includes("\0")) {
    return "新しいパスワードは12文字以上、UTF-8で72バイト以内にしてください。";
  }
  if (newPassword !== confirmPassword) {
    return "新しいパスワードが一致しません。";
  }
  if (newPassword === currentPassword) {
    return "現在と異なるパスワードを入力してください。";
  }
  return "";
};

const ChangePassword = () => {
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);
  const token = RequestSendUtils.getToken();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (pending.current) return;
    setSaved(false);
    const validationError = validatePasswords(passwords);
    setError(validationError);
    if (validationError) return;
    pending.current = true;
    setSubmitting(true);
    try {
      const result = await RequestSendUtils.sendPutWithReturn("/user/password", passwords, token);
      if (result.code !== "200" || !result.dataContent?.passwordChanged) {
        throw new Error("パスワードを更新できませんでした。");
      }
      setPasswords(EMPTY_PASSWORDS);
      setSaved(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "更新できませんでした。時間をおいて再度お試しください。");
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  };

  if (!token) return <Redirect to="/login" />;

  return (
    <div className="container py-3">
      <Helmet><title>パスワード変更</title><meta name="robots" content="noindex" /></Helmet>
      <Navibar />
      <main className="form-surface password-change">
        <h1>パスワードの変更</h1>
        <p id="password-help">新しいパスワードは12文字以上、UTF-8で72バイト以内にしてください。</p>
        <p>日本語などの文字は、1文字が複数バイトになります。</p>
        {error && <p className="alert alert-danger" role="alert">{error}</p>}
        {saved && <p className="alert alert-success" role="status">
          パスワードを更新しました。次回から新しいパスワードでログインできます。
        </p>}
        <form onSubmit={handleSubmit}>
          <fieldset disabled={submitting}>
            {[
              ["currentPassword", "現在のパスワード", "current-password"],
              ["newPassword", "新しいパスワード", "new-password"],
              ["confirmPassword", "新しいパスワード（確認）", "new-password"],
            ].map(([name, label, autoComplete]) => (
              <div className="form-group" key={name}>
                <label htmlFor={name}>{label}</label>
                <input id={name} name={name} type="password" className="form-control" required
                  autoComplete={autoComplete} maxLength={MAX_PASSWORD_BYTES}
                  aria-describedby={name === "currentPassword" ? undefined : "password-help"}
                  value={passwords[name]}
                  onChange={event => {
                    setPasswords({ ...passwords, [name]: event.target.value });
                    setSaved(false);
                    setError("");
                  }} />
              </div>
            ))}
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "更新中…" : "パスワードを更新"}
            </button>
          </fieldset>
        </form>
        <Link className="password-change__back" to="/">ホームに戻る</Link>
      </main>
    </div>
  );
};

export default ChangePassword;
