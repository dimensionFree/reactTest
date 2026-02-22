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
  showReadHistoryButton
) => (
  <article className="article-card" key={item.id}>
    <div className="article-card__main">
      <a href={`/article/read/${item.id}`} className="article-card__title">
        {item.title}
      </a>
      <p className="article-card__preface">{item.preface}</p>
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
            isShowReadHistoryButton
          )
        }
        showDeleteButton={isShowDeleteButton}
        showEditButton={isShowEditButton}
        crudApiBasePath="/article"
        initFilter={filters}
      />
    </div>
  );
};

export default FindArticle;
