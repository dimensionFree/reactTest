import React from "react";
import RequestSendUtils from "../../Utils/RequestSendUtils";
import { Button, Space } from "antd";
import PaginatedCommon from "../common/PaginatedCommon";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../css/articleList.css";

const fetchData = (page, pageSize, filters) => {
  return new Promise((resolve, reject) => {
    let queryParams = `currentPage=${page}&pageSize=${pageSize}`;

    if (filters) {
      const filtersString = JSON.stringify(filters);
      if (filtersString) {
        const encodedFilters = encodeURIComponent(filtersString);
        queryParams += `&filtersStr=${encodedFilters}`;
      }
    }

    RequestSendUtils.sendGet(
      `/article/findAll/?${queryParams}`,
      null,
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
  showEditButton
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
    </div>

    <Space size="middle">
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

const FindArticle = ({ filters = {}, isShowDeleteButton = false, isShowEditButton = false }) => {
  return (
    <div className="article-list">
      <PaginatedCommon
        fetchData={fetchData}
        renderItem={renderItem}
        showDeleteButton={isShowDeleteButton}
        showEditButton={isShowEditButton}
        crudApiBasePath="/article"
        initFilter={filters}
      />
    </div>
  );
};

export default FindArticle;
