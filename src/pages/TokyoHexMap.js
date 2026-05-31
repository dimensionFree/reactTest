import React, { useEffect, useMemo, useRef, useState } from "react";
import Navibar from "../components/Navibar";
import "../css/tokyoHexMap.css";
import fallbackHexCells from "../data/tokyoHexCells";
import { DEFAULT_ACTIVE_TYPES, HEX_TYPE_META, getHexTypeMeta, getKindLabels } from "../data/tokyoHexTaxonomy";

const MAP_WIDTH = 920;
const MAP_HEIGHT = 620;
const HEX_RADIUS = 42;
const SQRT_3 = Math.sqrt(3);
const MIN_ZOOM = 0.68;
const MAX_ZOOM = 1.7;

const buildHexPoints = (x, y, radius) =>
  getHexVertices(x, y, radius).map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");

const getHexVertices = (x, y, radius) =>
  Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 180) * (60 * index - 30);
    return {
      x: x + radius * Math.cos(angle),
      y: y + radius * Math.sin(angle)
    };
  });

const getCellCenter = (q, r) => {
  const x = 120 + HEX_RADIUS * SQRT_3 * (q + r / 2);
  const y = 82 + HEX_RADIUS * 1.5 * r;
  return { x, y };
};

const HEX_EDGE_NEIGHBORS = [
  [1, 0],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [0, -1],
  [1, -1]
];

const WARD_NAMES = {
  13101: "千代田区",
  13102: "中央区",
  13103: "港区",
  13104: "新宿区",
  13105: "文京区",
  13106: "台東区",
  13107: "墨田区",
  13108: "江東区",
  13109: "品川区",
  13110: "目黒区",
  13111: "大田区",
  13112: "世田谷区",
  13113: "渋谷区",
  13114: "中野区",
  13115: "杉並区",
  13116: "豊島区",
  13117: "北区",
  13118: "荒川区",
  13119: "板橋区",
  13120: "練馬区",
  13121: "足立区",
  13122: "葛飾区",
  13123: "江戸川区"
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const assetUrl = (path) => `${process.env.PUBLIC_URL || ""}${path}`;

const sendAssistantSpeech = (text) => {
  window.dispatchEvent(
    new CustomEvent("assistant:say", {
      detail: { text, visibleMs: 3200 }
    })
  );
};

const PAGE_TEXT = {
  zh: {
    languageLabel: "语言",
    lead: "用 QGIS 把东京 23 区切成六边形格子，再把公开 GIS 数据和 POI 信号抽象成文明风格的区域、改良和地形。",
    sampleData: "样例数据",
    mapControls: "地图控制",
    detailRule: "GIS 分类规则",
    detailAttributes: "当前格子属性",
    detailMapping: "文明式映射",
    thinkingTitle: "分类思路",
    thinkingBody: "当前真实接入的是东京都土地利用、行政边界、学校、铁路/车站、水系、绿地/公园等公开 GIS 数据。土地利用代码用 LU_1/LU_2 细分，能稳定支持社区、商业中心、工业区、农场、公园、河川等；航空港、港口、水渠、堤坝等类型暂时用高辨识度地标规则补充，后续可替换为更细的国土数值信息或设施数据。",
    privacyTitle: "隐私边界",
    privacyBody: "这个页面不使用访客当前位置，不读取 IP 位置，也不请求浏览器 geolocation。它只展示公开地理数据经过 QGIS 处理后的策略游戏风格抽象结果。",
    assistantToggle: (label, enabled) => `${label}, ${enabled ? "ON" : "OFF"}!`
  },
  ja: {
    languageLabel: "言語",
    lead: "QGIS で東京 23 区を六角形グリッドに分割し、公開 GIS データと POI シグナルを Civilization 風の区域・施設・地形として抽象化しています。",
    sampleData: "サンプルデータ",
    mapControls: "地図操作",
    detailRule: "GIS 分類ルール",
    detailAttributes: "現在タイルの属性",
    detailMapping: "Civilization 風マッピング",
    thinkingTitle: "分類方針",
    thinkingBody: "現在は東京都の土地利用、行政界、学校、鉄道・駅、水系、緑地・公園などの公開 GIS データを使っています。土地利用コードは LU_1/LU_2 で細分化し、住宅、商業ハブ、工業地帯、農場、都市公園、河川などを安定して分類します。飛行場、港、用水路、ダムは現時点では認知度の高いランドマークルールで補い、後続で国土数値情報や施設データに置き換えられる設計にしています。",
    privacyTitle: "プライバシー境界",
    privacyBody: "このページは訪問者の現在地を使わず、IP 位置情報も読まず、ブラウザの geolocation も要求しません。公開地理データを QGIS で処理した、戦略ゲーム風の抽象結果だけを表示します。",
    assistantToggle: (label, enabled) => `${label}, ${enabled ? "ON" : "OFF"}!`
  }
};

const normalizeType = (rawType) => {
  const aliases = {
    water: "river",
    green: "park",
    transit: "railway",
    urban: "urban_plain"
  };
  const type = aliases[rawType] || rawType;
  return HEX_TYPE_META[type] ? type : "urban_plain";
};

const normalizeHexFeature = (feature) => {
  const properties = feature?.properties || {};
  if (!properties.id || !Number.isFinite(Number(properties.q)) || !Number.isFinite(Number(properties.r))) {
    return null;
  }

  const type = normalizeType(properties.type);
  const meta = getHexTypeMeta(type);
  const wardCode = properties.ward_code ? String(properties.ward_code) : "";
  return {
    id: String(properties.id),
    q: Number(properties.q),
    r: Number(properties.r),
    wardCode,
    wardName: WARD_NAMES[wardCode] || properties.ward_name || "",
    type,
    kind: properties.kind || meta.kind,
    name: properties.name || `Tokyo Hex ${properties.id}`,
    areaHint: properties.areaHint || "东京 23 区",
    attributes: properties.attributes || "暂无 GIS 属性",
    description: properties.description || meta.description,
    counts: {
      green: Number(properties.green_count || 0),
      water: Number(properties.water_count || 0),
      campus: Number(properties.campus_count || 0),
      commercial: Number(properties.commercial_count || 0),
      industrial: Number(properties.industrial_count || 0),
      culture: Number(properties.culture_count || 0),
      holy: Number(properties.holy_count || 0),
      station: Number(properties.station_count || 0),
      farm: Number(properties.farm_count || 0)
    }
  };
};

const loadTokyoHexCells = async () => {
  const response = await fetch(`${process.env.PUBLIC_URL || ""}/data/tokyo-hex-cells.geojson`, {
    cache: "no-cache"
  });
  if (!response.ok) {
    throw new Error("tokyo-hex-cells.geojson not found");
  }
  const geojson = await response.json();
  const cells = Array.isArray(geojson?.features)
    ? geojson.features.map(normalizeHexFeature).filter(Boolean)
    : [];
  if (cells.length === 0) {
    throw new Error("tokyo-hex-cells.geojson has no usable features");
  }
  return cells;
};

const normalizeFallbackCell = (cell) => {
  const type = normalizeType(cell.type);
  const meta = getHexTypeMeta(type);
  return {
    ...cell,
    type,
    kind: meta.kind,
    description: cell.description || meta.description,
    counts: {}
  };
};

const buildWardHexOverlay = (cells) => {
  const cellByGrid = new Map(cells.map((cell) => [`${cell.q},${cell.r}`, cell]));
  const wardState = new Map();

  cells.forEach((cell) => {
    if (!cell.wardCode) {
      return;
    }
    const center = getCellCenter(cell.q, cell.r);
    const vertices = getHexVertices(center.x, center.y, HEX_RADIUS);
    const ward = wardState.get(cell.wardCode) || {
      code: cell.wardCode,
      name: cell.wardName || cell.wardCode,
      edges: [],
      labelX: 0,
      labelY: 0,
      count: 0
    };

    ward.labelX += center.x;
    ward.labelY += center.y;
    ward.count += 1;

    HEX_EDGE_NEIGHBORS.forEach(([dq, dr], edgeIndex) => {
      const neighbor = cellByGrid.get(`${cell.q + dq},${cell.r + dr}`);
      if (neighbor?.wardCode === cell.wardCode) {
        return;
      }
      const start = vertices[edgeIndex];
      const end = vertices[(edgeIndex + 1) % vertices.length];
      ward.edges.push({
        id: `${cell.id}-${edgeIndex}`,
        x1: Number(start.x.toFixed(2)),
        y1: Number(start.y.toFixed(2)),
        x2: Number(end.x.toFixed(2)),
        y2: Number(end.y.toFixed(2))
      });
    });

    wardState.set(cell.wardCode, ward);
  });

  return Array.from(wardState.values()).map((ward) => ({
    ...ward,
    label: [ward.labelX / ward.count, ward.labelY / ward.count]
  }));
};

const HexIcon = ({ meta, className = "" }) => {
  if (meta.icon) {
    return <img className={`tokyo-hex-icon ${className}`} src={assetUrl(meta.icon)} alt="" aria-hidden="true" />;
  }
  return <span className={`tokyo-hex-text-icon ${className}`} aria-hidden="true">{meta.shortLabel}</span>;
};

const TokyoHexMap = () => {
  const fallbackCells = useMemo(() => fallbackHexCells.map(normalizeFallbackCell), []);
  const [lang, setLang] = useState("ja");
  const [hexCells, setHexCells] = useState(fallbackCells);
  const [dataSourceLabel, setDataSourceLabel] = useState("样例数据");
  const [activeTypes, setActiveTypes] = useState(DEFAULT_ACTIVE_TYPES);
  const [selectedCellId, setSelectedCellId] = useState(fallbackCells[0].id);
  const [hoveredWardCode, setHoveredWardCode] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [mapView, setMapView] = useState({ x: -60, y: -18, zoom: 0.82 });
  const dragRef = useRef({
    active: false,
    moved: false,
    frame: 0,
    pendingX: 0,
    pendingY: 0,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0
  });

  useEffect(() => {
    return () => {
      if (dragRef.current.frame) {
        window.cancelAnimationFrame(dragRef.current.frame);
      }
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    loadTokyoHexCells()
      .then((cells) => {
        if (disposed) {
          return;
        }
        setHexCells(cells);
        setSelectedCellId(cells[0].id);
        setDataSourceLabel("QGIS GeoJSON");
      })
      .catch(() => {
        if (!disposed) {
          setDataSourceLabel(PAGE_TEXT.zh.sampleData);
        }
      });
    return () => {
      disposed = true;
    };
  }, []);

  const selectedCell = useMemo(
    () => hexCells.find((cell) => cell.id === selectedCellId) || hexCells[0],
    [hexCells, selectedCellId]
  );

  const text = PAGE_TEXT[lang];
  const kindLabels = getKindLabels(lang);
  const selectedMeta = getHexTypeMeta(selectedCell.type, lang);
  const displayedDataSourceLabel = dataSourceLabel === PAGE_TEXT.zh.sampleData ? text.sampleData : dataSourceLabel;
  const wardOverlay = useMemo(() => buildWardHexOverlay(hexCells), [hexCells]);
  const activeWard = useMemo(
    () => wardOverlay.find((ward) => ward.code === hoveredWardCode),
    [hoveredWardCode, wardOverlay]
  );

  const visibleCells = useMemo(
    () => hexCells.filter((cell) => activeTypes.includes(cell.type)),
    [activeTypes, hexCells]
  );

  const typesByKind = useMemo(() => {
    return Object.entries(HEX_TYPE_META).reduce((grouped, [type, meta]) => {
      const localizedMeta = getHexTypeMeta(type, lang);
      grouped[meta.kind] = grouped[meta.kind] || [];
      grouped[meta.kind].push([type, localizedMeta]);
      return grouped;
    }, {});
  }, [lang]);

  const toggleType = (type) => {
    const meta = getHexTypeMeta(type, lang);
    const currentlyEnabled = activeTypes.includes(type);
    const nextEnabled = !(currentlyEnabled && activeTypes.length > 1);
    setActiveTypes((current) => {
      if (current.includes(type)) {
        if (current.length === 1) {
          return current;
        }
        return current.filter((item) => item !== type);
      }
      return [...current, type];
    });
    sendAssistantSpeech(text.assistantToggle(meta.label, nextEnabled));
  };

  const selectCell = (cell) => {
    if (dragRef.current.moved) {
      return;
    }
    const meta = getHexTypeMeta(cell.type, lang);
    setSelectedCellId(cell.id);
    sendAssistantSpeech(meta.quote);
  };

  const onMapPointerDown = (event) => {
    if (dragRef.current.frame) {
      window.cancelAnimationFrame(dragRef.current.frame);
    }
    dragRef.current = {
      active: true,
      moved: false,
      frame: 0,
      pendingX: mapView.x,
      pendingY: mapView.y,
      startX: event.clientX,
      startY: event.clientY,
      baseX: mapView.x,
      baseY: mapView.y
    };
    setIsDragging(true);
  };

  const onMapPointerMove = (event) => {
    if (!dragRef.current.active) {
      return;
    }
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragRef.current.moved = true;
    }
    dragRef.current.pendingX = dragRef.current.baseX + dx;
    dragRef.current.pendingY = dragRef.current.baseY + dy;

    if (dragRef.current.frame) {
      return;
    }

    dragRef.current.frame = window.requestAnimationFrame(() => {
      dragRef.current.frame = 0;
      setMapView((current) => ({
        ...current,
        x: dragRef.current.pendingX,
        y: dragRef.current.pendingY
      }));
    });
  };

  const onMapPointerUp = () => {
    dragRef.current.active = false;
    setIsDragging(false);
  };

  const onMapPointerLeave = () => {
    dragRef.current.active = false;
    setIsDragging(false);
    setHoveredWardCode("");
  };

  const zoomMap = (delta) => {
    setMapView((current) => ({
      ...current,
      zoom: clamp(Number((current.zoom + delta).toFixed(2)), MIN_ZOOM, MAX_ZOOM)
    }));
  };

  const resetMap = () => {
    setMapView({ x: -60, y: -18, zoom: 0.82 });
  };

  return (
    <>
      <Navibar />
      <main className="tokyo-hex-page">
        <section className="tokyo-hex-hero">
          <div>
            <p className="tokyo-hex-kicker">Geo Lab / Civilization-inspired GIS</p>
            <h1>Tokyo Hex Map</h1>
            <p className="tokyo-hex-lead">
              {text.lead}
            </p>
          </div>
          <div className="tokyo-hex-status">
            <div className="tokyo-hex-lang" aria-label={text.languageLabel}>
              <button type="button" className={lang === "ja" ? "is-active" : ""} onClick={() => setLang("ja")}>日本語</button>
              <button type="button" className={lang === "zh" ? "is-active" : ""} onClick={() => setLang("zh")}>中文</button>

            </div>
            <span>{visibleCells.length}</span>
            <small>{displayedDataSourceLabel}</small>
          </div>
        </section>

        <section className="tokyo-hex-workspace" aria-label="Tokyo civilization style hex map">
          <div className="tokyo-hex-map-shell">
            <div className="tokyo-hex-map-tools" aria-label={text.mapControls}>
              <button type="button" onClick={() => zoomMap(0.12)}>+</button>
              <button type="button" onClick={() => zoomMap(-0.12)}>-</button>
              <button type="button" onClick={resetMap}>Reset</button>
            </div>
            <svg
              className={`tokyo-hex-map ${isDragging ? "is-dragging" : ""}`}
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              role="img"
              aria-label="Civilization inspired Tokyo hex map"
              onMouseDown={onMapPointerDown}
              onMouseMove={onMapPointerMove}
              onMouseUp={onMapPointerUp}
              onMouseLeave={onMapPointerLeave}
            >
              <defs>
                <pattern id="hexNoise" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M0 12H24M12 0V24" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                </pattern>
                <filter id="hexShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#000" floodOpacity="0.32" />
                </filter>
              </defs>

              <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#172126" />
              <g transform={`translate(${mapView.x} ${mapView.y}) scale(${mapView.zoom})`}>
                <path className="tokyo-hex-coast" d="M610 116 C728 174 772 290 738 394 C705 495 596 548 482 540 C562 488 574 414 542 336 C514 268 540 184 610 116Z" />
                <path className="tokyo-hex-river" d="M132 140 C226 190 292 210 374 264 C456 318 522 346 626 360" />
                <path className="tokyo-hex-river tokyo-hex-river--thin" d="M262 96 C332 168 394 198 492 218 C572 235 636 260 714 318" />

                <g className="tokyo-hex-tile-layer">
                  {visibleCells.map((cell) => {
                    const center = getCellCenter(cell.q, cell.r);
                    const meta = getHexTypeMeta(cell.type);
                    const selected = cell.id === selectedCell.id;
                    return (
                      <g key={cell.id} className={`tokyo-hex-cell tokyo-hex-cell--${cell.kind} ${selected ? "tokyo-hex-cell--selected" : ""}`}>
                        <polygon
                          points={buildHexPoints(center.x, center.y, HEX_RADIUS)}
                          fill={meta.color}
                          stroke={selected ? "#f6e39b" : "#25353b"}
                          strokeWidth={selected ? 4 : 2}
                          filter="url(#hexShadow)"
                          onMouseEnter={() => {
                            if (dragRef.current.active || isDragging) {
                              return;
                            }
                            setHoveredWardCode(cell.wardCode);
                          }}
                          onClick={() => selectCell(cell)}
                        />
                        <polygon points={buildHexPoints(center.x, center.y, HEX_RADIUS - 7)} fill="url(#hexNoise)" opacity="0.45" pointerEvents="none" />
                      </g>
                    );
                  })}
                </g>

                <g className="tokyo-ward-overlay" pointerEvents="none">
                  {wardOverlay.map((ward) => (
                    <g key={ward.code}>
                      {ward.edges.map((edge) => (
                        <g key={edge.id}>
                          <line
                            x1={edge.x1}
                            y1={edge.y1}
                            x2={edge.x2}
                            y2={edge.y2}
                            className="tokyo-ward-boundary-halo"
                          />
                          <line
                            x1={edge.x1}
                            y1={edge.y1}
                            x2={edge.x2}
                            y2={edge.y2}
                            className="tokyo-ward-boundary"
                          />
                        </g>
                      ))}
                    </g>
                  ))}
                  {activeWard && (
                    <g className="tokyo-ward-active-boundary">
                      {activeWard.edges.map((edge) => (
                        <g key={`active-${edge.id}`}>
                          <line
                            x1={edge.x1}
                            y1={edge.y1}
                            x2={edge.x2}
                            y2={edge.y2}
                            className="tokyo-ward-boundary-halo is-active"
                          />
                          <line
                            x1={edge.x1}
                            y1={edge.y1}
                            x2={edge.x2}
                            y2={edge.y2}
                            className="tokyo-ward-boundary is-active"
                          />
                        </g>
                      ))}
                    </g>
                  )}
                </g>

                <g className="tokyo-hex-icon-layer">
                  {visibleCells.map((cell) => {
                  const center = getCellCenter(cell.q, cell.r);
                  const meta = getHexTypeMeta(cell.type);
                  return (
                    <g key={cell.id}>
                      {meta.icon ? (
                        <image
                          href={assetUrl(meta.icon)}
                          x={center.x - 17}
                          y={center.y - 17}
                          width="34"
                          height="34"
                          className="tokyo-hex-svg-icon"
                          pointerEvents="none"
                        />
                      ) : (
                        <text x={center.x} y={center.y + 6} textAnchor="middle" className="tokyo-hex-symbol">
                          {meta.shortLabel}
                        </text>
                      )}
                    </g>
                  );
                  })}
                </g>

                {selectedCell && (
                  <g className="tokyo-hex-selected-outline-layer" pointerEvents="none">
                    <polygon
                      points={buildHexPoints(
                        getCellCenter(selectedCell.q, selectedCell.r).x,
                        getCellCenter(selectedCell.q, selectedCell.r).y,
                        HEX_RADIUS
                      )}
                      className="tokyo-hex-selected-outline"
                    />
                  </g>
                )}

                <g className="tokyo-ward-label-layer" pointerEvents="none">
                  {wardOverlay.map((ward) => (
                    Array.isArray(ward.label) && (
                      <text
                        key={ward.code}
                        x={ward.label[0]}
                        y={ward.label[1]}
                        className={`tokyo-ward-label ${hoveredWardCode === ward.code ? "is-active" : ""}`}
                      >
                        {ward.name}
                      </text>
                    )
                  ))}
                </g>
              </g>
            </svg>
          </div>

          <aside className="tokyo-hex-panel">
            <div className="tokyo-hex-filter tokyo-hex-filter--stacked">
              {["district", "improvement", "terrain"].map((kind) => (
                <div key={kind} className="tokyo-hex-filter-group">
                  <p>{kindLabels[kind]}</p>
                  {typesByKind[kind].map(([type, meta]) => (
                    <button
                      key={type}
                      type="button"
                      className={activeTypes.includes(type) ? "is-active" : ""}
                      onClick={() => toggleType(type)}
                      style={{ "--tile-color": meta.color, "--tile-accent": meta.accent }}
                    >
                      <HexIcon meta={meta} />
                      {meta.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="tokyo-hex-detail">
              <p className="tokyo-hex-detail-type">{selectedMeta.kindLabel} / {selectedMeta.label}</p>
              <h2><HexIcon meta={selectedMeta} className="tokyo-hex-detail-icon" />{selectedCell.name}</h2>
              <p>{selectedMeta.description}</p>
              <div className="tokyo-hex-yields" aria-label="hex yields">
                {selectedMeta.yields.map((yieldItem) => (
                  <span key={yieldItem}>{yieldItem}</span>
                ))}
              </div>
              <dl>
                <div>
                  <dt>{text.detailRule}</dt>
                  <dd>{selectedMeta.gisRule}</dd>
                </div>
                <div>
                  <dt>{text.detailAttributes}</dt>
                  <dd>{selectedCell.attributes}</dd>
                </div>
                <div>
                  <dt>{text.detailMapping}</dt>
                  <dd>{selectedMeta.mapping}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </section>

        <section className="tokyo-hex-notes">
          <div>
            <h2>{text.thinkingTitle}</h2>
            <p>{text.thinkingBody}</p>
          </div>
          <div>
            <h2>{text.privacyTitle}</h2>
            <p>{text.privacyBody}</p>
          </div>
        </section>
      </main>
    </>
  );
};

export default TokyoHexMap;
