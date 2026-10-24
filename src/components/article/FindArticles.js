import React from "react";
import RequestSendUtils from "../../Utils/RequestSendUtils";
import { Button, Space, Switch, message } from "antd";
import PaginatedCommon from "../common/PaginatedCommon";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../css/articleList.css";

const fetchData = (page, pageSize, filters, manageMode) => {
  return new Promise((resolve, reject) => {
    let queryParams = `currentPage=${page}&pageSize=${pageSize}`;

    if (filters) {
      const filtersString = JSON.stringify(filters);
      if (filtersString) {
        const encodedFilters = encodeURIComponent(filtersString);
        queryParams += `&filtersStr=${encodedFilters}`;
      }
    }

    const listApi = manageMode ? "/article/manage/findAll/" : "/article/findAll/";
    const token = manageMode ? RequestSendUtils.getToken() : null;
    RequestSendUtils.sendGet(
      `${listApi}?${queryParams}`,
      token,
      (response) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject(new Error("Failed to fetch data"));
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};

const highlightKeyword = (value, keyword) => {
  const text = value || "";
  if (!keyword) return text;
  const matchAt = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (matchAt < 0) return text;
  return <>
    {text.slice(0, matchAt)}
    <mark>{text.slice(matchAt, matchAt + keyword.length)}</mark>
    {text.slice(matchAt + keyword.length)}
  </>;
};

const getMatchLabel = (item, keyword) => {
  if (!keyword) return null;
  const includesKeyword = (value) => (value || "").toLowerCase().includes(keyword.toLowerCase());
  if (includesKeyword(item.title)) return "タイトルに一致";
  if (includesKeyword(item.searchSnippet)) return "本文に一致";
  if (includesKeyword(item.preface)) return "概要に一致";
  if (includesKeyword(item.content)) return "本文に一致";
  return null;
};

const renderItem = (
  item,
  index,
  handleDelete,
  handleEdit,
  showDeleteButton,
  showEditButton,
  handleRefresh,
  showPublicSwitch,
  handleTogglePublic,
  manageMode,
  showReadHistoryButton,
  searchKeyword
) => (
  <article className="article-card" key={item.id}>
    <div className="article-card__main">
      {getMatchLabel(item, searchKeyword) && (
        <span className="article-card__match">
          {getMatchLabel(item, searchKeyword)}
        </span>
      )}
      <a href={`/article/read/${item.id}`} className="article-card__title">
        {highlightKeyword(item.title, searchKeyword)}
      </a>
      <p className="article-card__preface">
        {searchKeyword && item.searchSnippet
          ? <>…{highlightKeyword(item.searchSnippet, searchKeyword)}…</>
          : highlightKeyword(item.preface, searchKeyword)}
      </p>
      <p className="article-card__meta">
        {new Date(item.createdDate).toISOString().slice(0, 16).replace("T", " ")}
      </p>
      <div className="article-card__meta article-card__meta-row">
        <p>{item.createdUserName}</p>
        <p>
          <i className="fas fa-eye"></i> {item.viewCount}
        </p>
      </div>
      {showPublicSwitch === true && (
        <div className="article-card__meta article-card__meta-row">
          <span>Public</span>
          <Switch
            checked={item.isPublic !== false}
            checkedChildren="On"
            unCheckedChildren="Off"
            onChange={(checked) => handleTogglePublic(item.id, checked, handleRefresh)}
          />
        </div>
      )}
    </div>

    <Space size="middle">
      {manageMode === true && showReadHistoryButton === true && (
        <Button onClick={() => (window.location.href = `/article/readHistory/${item.id}`)}>
          Read History
        </Button>
      )}
      {showDeleteButton === true && (
        <Button type="primary" danger onClick={() => handleDelete(item.id)}>
          Delete
        </Button>
      )}
      {showEditButton === true && (
        <Button type="primary" danger onClick={() => handleEdit(item.id)}>
          Edit
        </Button>
      )}
    </Space>
  </article>
);

const FindArticle = ({
  filters = {},
  isShowDeleteButton = false,
  isShowEditButton = false,
  isShowPublicSwitch = false,
  isShowReadHistoryButton = false,
  manageMode = false,
  searchKeyword = "",
  onSearchStatusChange,
}) => {
  const handleTogglePublic = async (id, isPublic, handleRefresh) => {
    try {
      const token = RequestSendUtils.getToken();
      await RequestSendUtils.sendPatchWithReturn(
        `/article/manage/public/${id}?isPublic=${isPublic}`,
        null,
        token
      );
      message.success("Visibility updated");
      handleRefresh();
    } catch (error) {
      message.error("Failed to update visibility");
    }
  };

  return (
    <div className="article-list">
      <PaginatedCommon
        fetchData={(page, pageSize, activeFilters) =>
          fetchData(page, pageSize, activeFilters, manageMode)
        }
        renderItem={(item, index, handleDelete, handleEdit, showDeleteButton, showEditButton, handleRefresh) =>
          renderItem(
            item,
            index,
            handleDelete,
            handleEdit,
            showDeleteButton,
            showEditButton,
            handleRefresh,
            isShowPublicSwitch,
            handleTogglePublic,
            manageMode,
            isShowReadHistoryButton,
            searchKeyword
          )
        }
        showDeleteButton={isShowDeleteButton}
        showEditButton={isShowEditButton}
        crudApiBasePath="/article"
        initFilter={filters}
        onResultChange={onSearchStatusChange}
        loadingState={searchKeyword && <div className="article-search-page__feedback">記事を検索しています…</div>}
        emptyState={searchKeyword && (
          <div className="article-search-page__feedback">
            <h2>一致する記事はありません</h2>
            <p>別のキーワードを試してください。</p>
          </div>
        )}
        errorState={searchKeyword && (
          <div className="article-search-page__feedback">
            <h2>検索結果を表示できませんでした</h2>
            <p>時間をおいて、もう一度検索してください。</p>
          </div>
        )}
        hidePaginationWhenSinglePage={Boolean(searchKeyword)}
      />
    </div>
  );
};

export default FindArticle;
