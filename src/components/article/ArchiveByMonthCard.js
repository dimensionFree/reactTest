import React, { useMemo, useState } from "react";

const formatYearMonth = (createdDate) => {
  if (!createdDate) {
    return "";
  }
  const date = new Date(createdDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const ArchiveByMonthCard = ({ className = "", articles = [], selected = "", onSelect }) => {
  const [expandedYears, setExpandedYears] = useState(new Set());

  const archiveTree = useMemo(() => {
    const byYear = new Map();
    articles.forEach((article) => {
      const ym = formatYearMonth(article?.createdDate);
      if (!ym) {
        return;
      }
      const [year, month] = ym.split("-");
      if (!byYear.has(year)) {
        byYear.set(year, new Map());
      }
      const monthMap = byYear.get(year);
      monthMap.set(month, (monthMap.get(month) || 0) + 1);
    });

    return Array.from(byYear.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([year, monthMap]) => {
        const months = Array.from(monthMap.entries())
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([month, count]) => ({ month, count }));
        const yearCount = months.reduce((sum, m) => sum + m.count, 0);
        return { year, yearCount, months };
      });
  }, [articles]);

  const toggleYear = (year) => {
    const next = new Set(expandedYears);
    if (next.has(year)) {
      next.delete(year);
    } else {
      next.add(year);
    }
    setExpandedYears(next);
  };

  return (
    <section className={`side-card archive-card ${className}`.trim()}>
      <p className="side-card__kicker">Archive</p>
      <h3>By Year-Month</h3>
      {archiveTree.length === 0 ? (
        <p className="archive-card__empty">No archived articles yet.</p>
      ) : (
        <ul className="archive-tree">
          {archiveTree.map((yearNode) => {
            const yearKey = yearNode.year;
            const isExpanded = expandedYears.has(yearKey);
            const isYearSelected = selected === yearKey;
            return (
              <li key={yearKey} className="archive-tree__year-row">
                <div className="archive-tree__line">
                  <button
                    type="button"
                    className="archive-tree__toggle"
                    onClick={() => toggleYear(yearKey)}
                    aria-label={`toggle-${yearKey}`}
                  >
                    {isExpanded ? "-" : "+"}
                  </button>
                  <button
                    type="button"
                    className={`archive-tree__item ${isYearSelected ? "is-active" : ""}`}
                    onClick={() => onSelect?.(yearKey)}
                  >
                    <span>{yearKey}</span>
                    <span>{yearNode.yearCount}</span>
                  </button>
                </div>
                {isExpanded && (
                  <ul className="archive-tree__months">
                    {yearNode.months.map((monthNode) => {
                      const ym = `${yearKey}-${monthNode.month}`;
                      const isMonthSelected = selected === ym;
                      return (
                        <li key={ym}>
                          <button
                            type="button"
                            className={`archive-tree__item archive-tree__month ${isMonthSelected ? "is-active" : ""}`}
                            onClick={() => onSelect?.(ym)}
                          >
                            <span>{monthNode.month}</span>
                            <span>{monthNode.count}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <button
        type="button"
        className="archive-tree__clear"
        onClick={() => onSelect?.("")}
      >
        Clear Filter
      </button>
    </section>
  );
};

export default ArchiveByMonthCard;
