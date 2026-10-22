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
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const EditArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [draftUpdatedAt, setDraftUpdatedAt] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const { id } = useParams();
  const history = useHistory();
  const restoredRef = useRef(false);
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const imageInputRef = useRef(null);

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

  const insertImageMarkdown = (url, fileName, selectionStart, selectionEnd) => {
    const altText = (fileName || "图片")
      .replace(/\.[^.]+$/, "")
      .replace(new RegExp("[\\[\\]\\r\\n]", "g"), " ")
      .trim() || "图片";
    let nextCursorPosition = 0;
    setContent((previousContent) => {
      const safeStart = Math.min(selectionStart, previousContent.length);
      const safeEnd = Math.min(Math.max(selectionEnd, safeStart), previousContent.length);
      const prefix = safeStart > 0 && previousContent[safeStart - 1] !== "\n" ? "\n\n" : "";
      const suffix = safeEnd < previousContent.length && previousContent[safeEnd] !== "\n" ? "\n\n" : "\n";
      const markdown = `${prefix}![${altText}](${url})${suffix}`;
      nextCursorPosition = safeStart + markdown.length;
      return previousContent.slice(0, safeStart) + markdown + previousContent.slice(safeEnd);
    });
    setTimeout(() => {
      editorRef.current?.focus();
      editorRef.current?.setSelectionRange(nextCursorPosition, nextCursorPosition);
    }, 0);
  };

  const uploadImage = async (file, selectionStart, selectionEnd) => {
    if (!file || isUploadingImage) {
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      message.error("图片大小不能超过 5 MB");
      return;
    }

    setIsUploadingImage(true);
    setImageUploadProgress(0);
    try {
      const response = await RequestSendUtils.uploadArticleImage(file, (event) => {
        if (event.total) {
          setImageUploadProgress(Math.round((event.loaded * 100) / event.total));
        }
      });
      const url = response?.dataContent?.url;
      if (!url) {
        throw new Error("上传响应缺少图片地址");
      }
      insertImageMarkdown(url, file.name, selectionStart, selectionEnd);
      message.success("图片上传成功");
    } catch (error) {
      message.error(error?.response?.data?.message || error.message || "图片上传失败");
    } finally {
      setIsUploadingImage(false);
      setImageUploadProgress(0);
    }
  };

  const handleImageInputChange = (event) => {
    const file = event.target.files?.[0];
    const editor = editorRef.current;
    const selectionStart = editor?.selectionStart ?? content.length;
    const selectionEnd = editor?.selectionEnd ?? selectionStart;
    uploadImage(file, selectionStart, selectionEnd);
    event.target.value = "";
  };

  const handleEditorPaste = (event) => {
    const fileItem = Array.from(event.clipboardData?.items || [])
      .find((item) => item.kind === "file" && item.type?.startsWith("image/"));
    if (!fileItem) {
      return;
    }
    event.preventDefault();
    uploadImage(
      fileItem.getAsFile(),
      event.currentTarget.selectionStart,
      event.currentTarget.selectionEnd
    );
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
          <button
            onClick={handleSave}
            className="btn btn-primary edit-article-save-btn"
            disabled={isUploadingImage}
          >
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
                <div className="edit-article-content-toolbar">
                  <label htmlFor="content">Article Content (Markdown format)</label>
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm"
                    disabled={isUploadingImage}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    {isUploadingImage ? `上传中 ${imageUploadProgress}%` : "上传图片"}
                  </button>
                  <input
                    ref={imageInputRef}
                    className="edit-article-image-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageInputChange}
                  />
                </div>
                <textarea
                  className="form-control edit-article-textarea"
                  id="content"
                  ref={editorRef}
                  value={content}
                  readOnly={isUploadingImage}
                  onChange={(e) => setContent(e.target.value)}
                  onPaste={handleEditorPaste}
                  onScroll={syncPreviewScroll}
                  placeholder="Enter content in Markdown format. You can also paste an image here."
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
