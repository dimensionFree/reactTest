import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Input, Popconfirm, Table, Tabs, Tag, message } from "antd";
import Navibar from "../components/Navibar";
import RequestSendUtils from "../Utils/RequestSendUtils";
import SEO from "../components/common/SEO";
import "../css/browseRecordManage.css";

const formatTime = (value) => (value ? value.replace("T", " ").slice(0, 19) : "-");
const toDateInputValue = (date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const buildRecentRange = (dayCount) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - dayCount + 1);
  return {
    start: toDateInputValue(start),
    end: toDateInputValue(end),
  };
};
const buildMonthRange = (months) => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - months);
  return {
    start: toDateInputValue(start),
    end: toDateInputValue(end),
  };
};
const buildYearRange = (years) => {
  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - years);
  return {
    start: toDateInputValue(start),
    end: toDateInputValue(end),
  };
};

const articleColumns = [
  {
    title: "Read Time",
    dataIndex: "readTime",
    key: "readTime",
    render: formatTime,
  },
  {
    title: "Article ID",
    dataIndex: "articleId",
    key: "articleId",
  },
  {
    title: "IP",
    dataIndex: "readerIp",
    key: "readerIp",
    render: (value) => value || "-",
  },
  {
    title: "Country/Province/City",
    key: "location",
    render: (_, record) =>
      `${record.readerIpCountry || "UNKNOWN"} / ${record.readerIpProvince || "UNKNOWN"} / ${record.readerIpCity || "UNKNOWN"}`,
  },
  {
    title: "User",
    dataIndex: "readerUserId",
    key: "readerUserId",
    render: (value) => value || "Anonymous",
  },
];

const assistantColumns = [
  {
    title: "Trigger Time",
    dataIndex: "triggerTime",
    key: "triggerTime",
    render: formatTime,
  },
  {
    title: "Type",
    dataIndex: "interactionType",
    key: "interactionType",
    render: (value) => <Tag>{value || "UNKNOWN"}</Tag>,
  },
  {
    title: "Action",
    dataIndex: "interactionAction",
    key: "interactionAction",
    render: (value) => value || "-",
  },
  {
    title: "IP",
    dataIndex: "clientIp",
    key: "clientIp",
    render: (value) => value || "-",
  },
  {
    title: "Country/Province/City",
    key: "location",
    render: (_, record) =>
      `${record.clientIpCountry || "UNKNOWN"} / ${record.clientIpProvince || "UNKNOWN"} / ${record.clientIpCity || "UNKNOWN"}`,
  },
  {
    title: "User",
    dataIndex: "userId",
    key: "userId",
    render: (value) => value || "Anonymous",
  },
];

const BrowseRecordManage = () => {
  const defaultRange = buildRecentRange(7);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const token = useMemo(() => RequestSendUtils.getToken(), []);
  const [startDateInput, setStartDateInput] = useState(defaultRange.start);
  const [endDateInput, setEndDateInput] = useState(defaultRange.end);
  const [startDateFilter, setStartDateFilter] = useState(defaultRange.start);
  const [endDateFilter, setEndDateFilter] = useState(defaultRange.end);

  const [articleLoading, setArticleLoading] = useState(false);
  const [articleData, setArticleData] = useState([]);
  const [articleTotal, setArticleTotal] = useState(0);
  const [articlePage, setArticlePage] = useState(1);
  const [articlePageSize, setArticlePageSize] = useState(20);
  const [articleIdFilterInput, setArticleIdFilterInput] = useState("");
  const [articleIdFilter, setArticleIdFilter] = useState("");

  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantData, setAssistantData] = useState([]);
  const [assistantTotal, setAssistantTotal] = useState(0);
  const [assistantPage, setAssistantPage] = useState(1);
  const [assistantPageSize, setAssistantPageSize] = useState(20);
  const [interactionTypeInput, setInteractionTypeInput] = useState("");
  const [interactionTypeFilter, setInteractionTypeFilter] = useState("");
  const [interactionActionInput, setInteractionActionInput] = useState("");
  const [interactionActionFilter, setInteractionActionFilter] = useState("");
  const [ignoreIpLoading, setIgnoreIpLoading] = useState(false);
  const [ignoreIpList, setIgnoreIpList] = useState([]);
  const [ignoreIpInput, setIgnoreIpInput] = useState("");
  const [ignoreIpSubmitting, setIgnoreIpSubmitting] = useState(false);
  const [removingIp, setRemovingIp] = useState("");

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.user4Display && userInfo.user4Display.role) {
      setIsAdmin(userInfo.user4Display.role.roleName === "admin");
    }
  }, []);

  const loadArticleRecords = async (
    page = articlePage,
    size = articlePageSize,
    articleId = articleIdFilter,
    startDate = startDateFilter,
    endDate = endDateFilter
  ) => {
    try {
      setArticleLoading(true);
      setError("");
      let query = `currentPage=${page}&pageSize=${size}`;
      if (articleId) {
        query += `&articleId=${encodeURIComponent(articleId)}`;
      }
      if (startDate) {
        query += `&startDate=${encodeURIComponent(startDate)}`;
      }
      if (endDate) {
        query += `&endDate=${encodeURIComponent(endDate)}`;
      }
      const response = await RequestSendUtils.sendGetWithReturn(`/article/read/manage/records?${query}`, token);
      const pageInfo = response?.dataContent || {};
      setArticleData(pageInfo.list || []);
      setArticleTotal(pageInfo.total || 0);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load article read records.");
      setArticleData([]);
      setArticleTotal(0);
    } finally {
      setArticleLoading(false);
    }
  };

  const loadAssistantRecords = async (
    page = assistantPage,
    size = assistantPageSize,
    interactionType = interactionTypeFilter,
    interactionAction = interactionActionFilter,
    startDate = startDateFilter,
    endDate = endDateFilter
  ) => {
    try {
      setAssistantLoading(true);
      setError("");
      let query = `currentPage=${page}&pageSize=${size}`;
      if (interactionType) {
        query += `&interactionType=${encodeURIComponent(interactionType)}`;
      }
      if (interactionAction) {
        query += `&interactionAction=${encodeURIComponent(interactionAction)}`;
      }
      if (startDate) {
        query += `&startDate=${encodeURIComponent(startDate)}`;
      }
      if (endDate) {
        query += `&endDate=${encodeURIComponent(endDate)}`;
      }
      const response = await RequestSendUtils.sendGetWithReturn(`/assistant/interaction/manage/records?${query}`, token);
      const pageInfo = response?.dataContent || {};
      setAssistantData(pageInfo.list || []);
      setAssistantTotal(pageInfo.total || 0);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load assistant interaction records.");
      setAssistantData([]);
      setAssistantTotal(0);
    } finally {
      setAssistantLoading(false);
    }
  };

  const loadIgnoredIps = async () => {
    try {
      setIgnoreIpLoading(true);
      setError("");
      const response = await RequestSendUtils.sendGetWithReturn("/record/manage/ignore-ip/list", token);
      const data = response?.dataContent;
      setIgnoreIpList(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load ignored IP list.");
      setIgnoreIpList([]);
    } finally {
      setIgnoreIpLoading(false);
    }
  };

  const handleAddIgnoredIp = async () => {
    const ip = ignoreIpInput.trim();
    if (!ip) {
      message.warning("Please input IP first.");
      return;
    }
    try {
      setIgnoreIpSubmitting(true);
      setError("");
      await RequestSendUtils.sendPostWithReturn("/record/manage/ignore-ip/add", { ip }, token);
      setIgnoreIpInput("");
      await loadIgnoredIps();
      message.success("IP added to ignore list.");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to add ignored IP.");
    } finally {
      setIgnoreIpSubmitting(false);
    }
  };

  const handleRemoveIgnoredIp = async (ip) => {
    if (!ip) {
      return;
    }
    try {
      setRemovingIp(ip);
      setError("");
      await RequestSendUtils.sendDeleteWithReturn(`/record/manage/ignore-ip/remove?ip=${encodeURIComponent(ip)}`, token);
      await loadIgnoredIps();
      message.success("IP removed from ignore list.");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to remove ignored IP.");
    } finally {
      setRemovingIp("");
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    loadArticleRecords(1, articlePageSize, articleIdFilter, startDateFilter, endDateFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, articleIdFilter, articlePageSize, startDateFilter, endDateFilter]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    loadIgnoredIps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    loadAssistantRecords(
      1,
      assistantPageSize,
      interactionTypeFilter,
      interactionActionFilter,
      startDateFilter,
      endDateFilter
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, interactionTypeFilter, interactionActionFilter, assistantPageSize, startDateFilter, endDateFilter]);

  const applyArticleFilter = () => {
    setArticlePage(1);
    setArticleIdFilter(articleIdFilterInput.trim());
  };

  const applyAssistantFilter = () => {
    setAssistantPage(1);
    setInteractionTypeFilter(interactionTypeInput.trim());
    setInteractionActionFilter(interactionActionInput.trim());
  };

  const applyDateFilter = () => {
    setArticlePage(1);
    setAssistantPage(1);
    setStartDateFilter(startDateInput || "");
    setEndDateFilter(endDateInput || "");
  };

  const applyPresetRange = (range) => {
    setStartDateInput(range.start);
    setEndDateInput(range.end);
    setArticlePage(1);
    setAssistantPage(1);
    setStartDateFilter(range.start);
    setEndDateFilter(range.end);
  };

  return (
    <div className="browse-record-manage-page">
      <SEO title={"浏览记录管理"} description={"browse record manage"} />
      <Navibar />
      <div className="container mt-5 pt-5">
        <h1 className="mb-4">Browse Record Management</h1>
        {!isAdmin && <Alert type="warning" showIcon message="Only admin can view this page." />}
        {error && <Alert className="mb-3" type="error" showIcon message={error} />}
        {isAdmin && (
          <Tabs defaultActiveKey="article">
            <Tabs.TabPane tab="Article Read Records" key="article">
              <div className="record-filter-row record-date-row">
                <label htmlFor="startDate">Start</label>
                <input
                  id="startDate"
                  type="date"
                  className="form-control"
                  value={startDateInput}
                  onChange={(e) => setStartDateInput(e.target.value)}
                />
                <label htmlFor="endDate">End</label>
                <input
                  id="endDate"
                  type="date"
                  className="form-control"
                  value={endDateInput}
                  onChange={(e) => setEndDateInput(e.target.value)}
                />
                <Button type="primary" onClick={applyDateFilter}>
                  Apply Date
                </Button>
                <Button onClick={() => applyPresetRange(buildRecentRange(7))}>Past 7 Days</Button>
                <Button onClick={() => applyPresetRange(buildMonthRange(1))}>Past 1 Month</Button>
                <Button onClick={() => applyPresetRange(buildMonthRange(6))}>Past 6 Months</Button>
                <Button onClick={() => applyPresetRange(buildYearRange(1))}>Past 1 Year</Button>
              </div>
              <div className="record-filter-row">
                <Input
                  placeholder="Filter by Article ID"
                  value={articleIdFilterInput}
                  onChange={(e) => setArticleIdFilterInput(e.target.value)}
                  onPressEnter={applyArticleFilter}
                  allowClear
                />
                <Button type="primary" onClick={applyArticleFilter}>
                  Search
                </Button>
              </div>
              <Table
                rowKey={(record) => record.id}
                loading={articleLoading}
                columns={articleColumns}
                dataSource={articleData}
                pagination={{
                  current: articlePage,
                  pageSize: articlePageSize,
                  total: articleTotal,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  onChange: (page, size) => {
                    setArticlePage(page);
                    setArticlePageSize(size);
                    loadArticleRecords(page, size, articleIdFilter, startDateFilter, endDateFilter);
                  },
                }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Assistant Interaction Records" key="assistant">
              <div className="record-filter-row record-date-row">
                <label htmlFor="startDateAssistant">Start</label>
                <input
                  id="startDateAssistant"
                  type="date"
                  className="form-control"
                  value={startDateInput}
                  onChange={(e) => setStartDateInput(e.target.value)}
                />
                <label htmlFor="endDateAssistant">End</label>
                <input
                  id="endDateAssistant"
                  type="date"
                  className="form-control"
                  value={endDateInput}
                  onChange={(e) => setEndDateInput(e.target.value)}
                />
                <Button type="primary" onClick={applyDateFilter}>
                  Apply Date
                </Button>
                <Button onClick={() => applyPresetRange(buildRecentRange(7))}>Past 7 Days</Button>
                <Button onClick={() => applyPresetRange(buildMonthRange(1))}>Past 1 Month</Button>
                <Button onClick={() => applyPresetRange(buildMonthRange(6))}>Past 6 Months</Button>
                <Button onClick={() => applyPresetRange(buildYearRange(1))}>Past 1 Year</Button>
              </div>
              <div className="record-filter-row record-filter-row-wide">
                <Input
                  placeholder="Type (e.g. AVATAR / CHAT)"
                  value={interactionTypeInput}
                  onChange={(e) => setInteractionTypeInput(e.target.value)}
                  onPressEnter={applyAssistantFilter}
                  allowClear
                />
                <Input
                  placeholder="Action (e.g. tap / flick)"
                  value={interactionActionInput}
                  onChange={(e) => setInteractionActionInput(e.target.value)}
                  onPressEnter={applyAssistantFilter}
                  allowClear
                />
                <Button type="primary" onClick={applyAssistantFilter}>
                  Search
                </Button>
              </div>
              <Table
                rowKey={(record) => record.id}
                loading={assistantLoading}
                columns={assistantColumns}
                dataSource={assistantData}
                pagination={{
                  current: assistantPage,
                  pageSize: assistantPageSize,
                  total: assistantTotal,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  onChange: (page, size) => {
                    setAssistantPage(page);
                    setAssistantPageSize(size);
                    loadAssistantRecords(
                      page,
                      size,
                      interactionTypeFilter,
                      interactionActionFilter,
                      startDateFilter,
                      endDateFilter
                    );
                  },
                }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Ignored IP Settings" key="ignoreIp">
              <div className="record-filter-row record-filter-row-wide">
                <Input
                  placeholder="Input IP (e.g. 127.0.0.1 / 2001:db8::1 / localhost)"
                  value={ignoreIpInput}
                  onChange={(e) => setIgnoreIpInput(e.target.value)}
                  onPressEnter={handleAddIgnoredIp}
                  allowClear
                />
                <Button type="primary" loading={ignoreIpSubmitting} onClick={handleAddIgnoredIp}>
                  Add
                </Button>
                <Button onClick={loadIgnoredIps} loading={ignoreIpLoading}>
                  Refresh
                </Button>
              </div>
              <Table
                rowKey={(record) => record}
                loading={ignoreIpLoading}
                dataSource={ignoreIpList}
                pagination={false}
                columns={[
                  {
                    title: "Ignored IP",
                    key: "ip",
                    render: (_, ip) => ip,
                  },
                  {
                    title: "Operation",
                    key: "operation",
                    render: (_, ip) => (
                      <Popconfirm
                        title="Remove this IP from ignore list?"
                        onConfirm={() => handleRemoveIgnoredIp(ip)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger loading={removingIp === ip}>
                          Remove
                        </Button>
                      </Popconfirm>
                    ),
                  },
                ]}
              />
            </Tabs.TabPane>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default BrowseRecordManage;
