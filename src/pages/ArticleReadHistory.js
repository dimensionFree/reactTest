import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Empty, Spin, Table } from "antd";
import Navibar from "../components/Navibar";
import RequestSendUtils from "../Utils/RequestSendUtils";
import "../css/readHistory.css";

const columns = [
  {
    title: "Read Time",
    dataIndex: "readTime",
    key: "readTime",
    render: (value) => (value ? value.replace("T", " ").slice(0, 19) : "-"),
  },
  {
    title: "IP",
    dataIndex: "readerIp",
    key: "readerIp",
  },
  {
    title: "Country",
    dataIndex: "readerIpCountry",
    key: "readerIpCountry",
    render: (value) => value || "UNKNOWN",
  },
  {
    title: "Province",
    dataIndex: "readerIpProvince",
    key: "readerIpProvince",
    render: (value) => value || "UNKNOWN",
  },
  {
    title: "City / District",
    dataIndex: "readerIpCity",
    key: "readerIpCity",
    render: (value) => value || "UNKNOWN",
  },
  {
    title: "User",
    dataIndex: "readerUserId",
    key: "readerUserId",
    render: (value) => value || "Anonymous",
  },
  {
    title: "User Agent",
    dataIndex: "readerUserAgent",
    key: "readerUserAgent",
    ellipsis: true,
    render: (value) => value || "-",
  },
];

const ArticleReadHistory = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const token = RequestSendUtils.getToken();
        const response = await RequestSendUtils.sendGetWithReturn(
          `/article/read/detail/${id}?recordLimit=100&dayLimit=30`,
          token
        );
        setDetail(response?.dataContent || null);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load read history.");
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  const dailyStats = detail?.dailyStats || [];
  const latestRecords = detail?.latestRecords || [];

  return (
    <div className="read-history-page">
      <Navibar />
      <div className="container mt-5 pt-5">
        <h1 className="read-history-title">Article Read History</h1>
        <p className="read-history-subtitle">articleId: {id}</p>
        {error && (
          <Alert
            className="mb-3"
            type="error"
            showIcon
            message="Load failed"
            description={error}
          />
        )}
        {loading ? (
          <div className="read-history-loading">
            <Spin />
          </div>
        ) : !detail ? (
          <Empty description="No data" />
        ) : (
          <>
            <section className="read-history-kpis">
              <div className="read-history-kpi">
                <div className="label">Total Reads</div>
                <div className="value">{detail.totalReadCount ?? 0}</div>
              </div>
              <div className="read-history-kpi">
                <div className="label">Unique IPs</div>
                <div className="value">{detail.uniqueIpCount ?? 0}</div>
              </div>
              <div className="read-history-kpi">
                <div className="label">Days</div>
                <div className="value">{dailyStats.length}</div>
              </div>
            </section>

            <section className="read-history-section">
              <h2>Daily Stats</h2>
              {dailyStats.length === 0 ? (
                <Empty description="No daily stats" />
              ) : (
                <table className="table table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Read Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyStats.map((item, idx) => (
                      <tr key={`${item.readDate}-${idx}`}>
                        <td>{item.readDate}</td>
                        <td>{item.readCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            <section className="read-history-section">
              <h2>Latest Records</h2>
              <Table
                rowKey={(record) => record.id}
                dataSource={latestRecords}
                columns={columns}
                pagination={{ pageSize: 10, showSizeChanger: false }}
                locale={{ emptyText: "No read records" }}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleReadHistory;
