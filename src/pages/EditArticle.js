import React, { useEffect, useMemo, useRef, useState } from "react";
import RequestSendUtils from "../Utils/RequestSendUtils";
import Navibar from "../components/Navibar";
import { useParams, useHistory } from "react-router-dom";
import { message } from "antd";
import MarkdownRenderer from "../components/markdown/MarkdownRenderer";
import SEO from "../components/common/SEO";
import "../css/formSurface.css";

const DRAFT_SAVE_DELAY_MS = 1200;
const HEARTBEAT_INTERVAL_MS = 4 * 60 * 1000;

const EditArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [draftUpdatedAt, setDraftUpdatedAt] = useState("");
  const { id } = useParams();
  const history = useHistory();
  const restoredRef = useRef(false);
  const editorRef = useRef(null);
  const previewRef = useRef(null);

  const draftKey = useMemo(() => {
    const userInfo = RequestSendUtils.getUserInfo();
    const userId = userInfo?.user4Display?.id || "anonymous";
    return `article_draft_${userId}_${id}`;
  }, [id]);

  const readDraft = () => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(draftKey);
    setDraftUpdatedAt("");
  };

  useEffect(() => {
    const draft = readDraft();
    if (id === "NEW") {
      if (draft) {
        setTitle(draft.title || "");
        setContent(draft.content || "");
        setIsPublic(draft.isPublic !== false);
        setDraftUpdatedAt(draft.updatedAt || "");
        if (!restoredRef.current) {
          message.info("已恢复本地草稿");
          restoredRef.current = true;
        }
      }
      setInitialized(true);
      return;
    }

    let cancelled = false;
    const fetchArticle = async () => {
      try {
        const token = RequestSendUtils.getToken();
        const response = await RequestSendUtils.sendGetWithReturn(`/article/manage/find/${id}`, token);
        const data = response?.dataContent || {};
        if (cancelled) {
          return;
        }

        if (draft && (draft.title || draft.content)) {
          setTitle(draft.title || data.title || "");
          setContent(draft.content || data.content || "");
          setIsPublic(draft.isPublic !== false);
          setDraftUpdatedAt(draft.updatedAt || "");
          if (!restoredRef.current) {
            message.info("检测到本地草稿，已自动恢复");
            restoredRef.current = true;
          }
        } else {
          setTitle(data.title || "");
          setContent(data.content || "");
          setIsPublic(data.isPublic !== false);
        }
      } catch (error) {
        if (!cancelled) {
          message.error("Error fetching article");
        }
      } finally {
        if (!cancelled) {
          setInitialized(true);
        }
      }
    };

    fetchArticle();
    return () => {
      cancelled = true;
    };
  }, [id, draftKey]);

  useEffect(() => {
    if (!initialized) {
      return undefined;
    }
    const timer = setTimeout(() => {
      const hasValue = (title || "").trim() !== "" || (content || "").trim() !== "";
      if (!hasValue) {
        return;
      }
      const updatedAt = new Date().toISOString();
      localStorage.setItem(
        draftKey,
        JSON.stringify({
          title,
          content,
          isPublic,
          updatedAt,
          articleId: id,
        })
      );
      setDraftUpdatedAt(updatedAt);
    }, DRAFT_SAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [title, content, isPublic, draftKey, id, initialized]);

  useEffect(() => {
    const timer = setInterval(() => {
      RequestSendUtils.keepAlive().catch(() => {
        // keepAlive 失败时请求层会尝试刷新，刷新失败才退出
      });
    }, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      syncPreviewScroll();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const handleSave = async () => {
    try {
      const token = RequestSendUtils.getToken();
      const payload = { title, content, isPublic };

      if (id === "NEW") {
        const response = await RequestSendUtils.sendPostWithReturn("/article/create", payload, token);
        const newId = response?.dataContent;
        if (newId) {
          clearDraft();
          message.success("Save successful!");
          history.push("/article/read/" + newId);
        }
      } else {
        const response = await RequestSendUtils.sendPutWithReturn(`/article/update/${id}`, payload, token);
        if (response) {
          clearDraft();
          message.success("Update successful!");
          history.push("/article/read/" + id);
        }
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Save failed");
    }
  };

  const syncPreviewScroll = () => {
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) {
      return;
    }
    const editorScrollable = editor.scrollHeight - editor.clientHeight;
    const previewScrollable = preview.scrollHeight - preview.clientHeight;
    if (editorScrollable <= 0 || previewScrollable <= 0) {
      preview.scrollTop = 0;
      return;
    }
    const progress = editor.scrollTop / editorScrollable;
    preview.scrollTop = progress * previewScrollable;
  };

  return (
    <div>
      <SEO title={"文章編集"} description={"articleEdit"} />
      <Navibar />
      <div className="container-fluid my-5 form-surface edit-article-page">
        <div className="edit-article-topbar">
          <div>
            <h1 className="edit-article-title">{id === "NEW" ? "Create New Article" : "Edit Article"}</h1>
            <p className="edit-article-subtitle">Markdown writing workspace with live synchronized preview</p>
          </div>
          <button onClick={handleSave} className="btn btn-primary edit-article-save-btn">
            {id === "NEW" ? "Save Article" : "Update Article"}
          </button>
        </div>

        <div className="edit-article-status-row">
          <span className="edit-article-status-chip">{isPublic ? "Public" : "Private"}</span>
          {draftUpdatedAt && (
            <span className="edit-article-status-text">
              Draft autosaved: {draftUpdatedAt.replace("T", " ").slice(0, 19)}
            </span>
          )}
        </div>

        <div className="edit-article-layout">
          <section className="edit-article-pane edit-article-editor-pane">
            <header className="edit-article-pane-header">Editor</header>
            <div className="edit-article-pane-body">
              <div className="form-group">
                <label htmlFor="title">Article Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                />
              </div>
              <div className="form-group edit-article-public-row">
                <label htmlFor="isPublic" style={{ marginRight: 8 }}>
                  Public
                </label>
                <input
                  id="isPublic"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              </div>
              <div className="form-group edit-article-textarea-wrap">
                <label htmlFor="content">Article Content (Markdown format)</label>
                <textarea
                  className="form-control edit-article-textarea"
                  id="content"
                  ref={editorRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onScroll={syncPreviewScroll}
                  placeholder="Enter content in Markdown format"
                />
              </div>
            </div>
          </section>

          <section className="edit-article-pane edit-article-preview-pane">
            <header className="edit-article-pane-header">Preview</header>
            <div
              className="preview-panel p-3 edit-article-preview-panel"
              ref={previewRef}
            >
              <h3 style={{ textAlign: "center" }}>{title}</h3>
              <MarkdownRenderer content={content} className="markdown-body--preview" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EditArticle;
