import React, { useEffect, useMemo, useRef, useState } from "react";
import Navibar from "../components/Navibar";
import "../css/tokyoHexMap.css";
import fallbackHexCells from "../data/tokyoHexCells";
import { DEFAULT_ACTIVE_TYPES, HEX_TYPE_META, KIND_LABELS, getHexTypeMeta } from "../data/tokyoHexTaxonomy";

const MAP_WIDTH = 920;
const MAP_HEIGHT = 620;
const HEX_RADIUS = 42;
const SQRT_3 = Math.sqrt(3);
const MIN_ZOOM = 0.68;
const MAX_ZOOM = 1.7;

const buildHexPoints = (x, y, radius) =>
  Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 180) * (60 * index - 30);
    return `${(x + radius * Math.cos(angle)).toFixed(2)},${(y + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");

const getCellCenter = (q, r) => {
  const x = 120 + HEX_RADIUS * SQRT_3 * (q + r / 2);
  const y = 82 + HEX_RADIUS * 1.5 * r;
  return { x, y };
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
  return {
    id: String(properties.id),
    q: Number(properties.q),
    r: Number(properties.r),
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

const HexIcon = ({ meta, className = "" }) => {
  if (meta.icon) {
    return <img className={`tokyo-hex-icon ${className}`} src={assetUrl(meta.icon)} alt="" aria-hidden="true" />;
  }
  return <span className={`tokyo-hex-text-icon ${className}`} aria-hidden="true">{meta.shortLabel}</span>;
};

const TokyoHexMap = () => {
  const fallbackCells = useMemo(() => fallbackHexCells.map(normalizeFallbackCell), []);
  const [hexCells, setHexCells] = useState(fallbackCells);
  const [dataSourceLabel, setDataSourceLabel] = useState("样例数据");
  const [activeTypes, setActiveTypes] = useState(DEFAULT_ACTIVE_TYPES);
  const [selectedCellId, setSelectedCellId] = useState(fallbackCells[0].id);
  const [mapView, setMapView] = useState({ x: -60, y: -18, zoom: 0.82 });
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

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
          setDataSourceLabel("样例数据");
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

  const selectedMeta = getHexTypeMeta(selectedCell.type);

  const visibleCells = useMemo(
    () => hexCells.filter((cell) => activeTypes.includes(cell.type)),
    [activeTypes, hexCells]
  );

  const typesByKind = useMemo(() => {
    return Object.entries(HEX_TYPE_META).reduce((grouped, [type, meta]) => {
      grouped[meta.kind] = grouped[meta.kind] || [];
      grouped[meta.kind].push([type, meta]);
      return grouped;
    }, {});
  }, []);

  const toggleType = (type) => {
    const meta = getHexTypeMeta(type);
    setActiveTypes((current) => {
      if (current.includes(type)) {
        return current.length === 1 ? current : current.filter((item) => item !== type);
      }
      return [...current, type];
    });
    sendAssistantSpeech(`切换到 ${meta.label}。现在是在把东京当成文明地图来读，不是在背行政区。`);
  };

  const selectCell = (cell) => {
    if (dragRef.current.moved) {
      return;
    }
    const meta = getHexTypeMeta(cell.type);
    setSelectedCellId(cell.id);
    sendAssistantSpeech(meta.quote);
  };

  const onMapPointerDown = (event) => {
    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      baseX: mapView.x,
      baseY: mapView.y
    };
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
    setMapView((current) => ({
      ...current,
      x: dragRef.current.baseX + dx,
      y: dragRef.current.baseY + dy
    }));
  };

  const onMapPointerUp = () => {
    dragRef.current.active = false;
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
              用 QGIS 把东京 23 区切成六边形格子，再把公开 GIS 数据和 POI 信号抽象成文明风格的区域、改良和地形。
            </p>
          </div>
          <div className="tokyo-hex-status">
            <span>{visibleCells.length}</span>
            <small>{dataSourceLabel}</small>
          </div>
        </section>

        <section className="tokyo-hex-workspace" aria-label="Tokyo civilization style hex map">
          <div className="tokyo-hex-map-shell">
            <div className="tokyo-hex-map-tools" aria-label="地图控制">
              <button type="button" onClick={() => zoomMap(0.12)}>+</button>
              <button type="button" onClick={() => zoomMap(-0.12)}>-</button>
              <button type="button" onClick={resetMap}>Reset</button>
            </div>
            <svg
              className={`tokyo-hex-map ${dragRef.current.active ? "is-dragging" : ""}`}
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              role="img"
              aria-label="Civilization inspired Tokyo hex map"
              onMouseDown={onMapPointerDown}
              onMouseMove={onMapPointerMove}
              onMouseUp={onMapPointerUp}
              onMouseLeave={onMapPointerUp}
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
                        onMouseEnter={() => setSelectedCellId(cell.id)}
                        onClick={() => selectCell(cell)}
                      />
                      <polygon points={buildHexPoints(center.x, center.y, HEX_RADIUS - 7)} fill="url(#hexNoise)" opacity="0.45" pointerEvents="none" />
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
            </svg>
          </div>

          <aside className="tokyo-hex-panel">
            <div className="tokyo-hex-filter tokyo-hex-filter--stacked">
              {["district", "improvement", "terrain"].map((kind) => (
                <div key={kind} className="tokyo-hex-filter-group">
                  <p>{KIND_LABELS[kind]}</p>
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
                  <dt>GIS 分类规则</dt>
                  <dd>{selectedMeta.gisRule}</dd>
                </div>
                <div>
                  <dt>当前格子属性</dt>
                  <dd>{selectedCell.attributes}</dd>
                </div>
                <div>
                  <dt>文明式映射</dt>
                  <dd>{selectedMeta.mapping}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </section>

        <section className="tokyo-hex-notes">
          <div>
            <h2>分类思路</h2>
            <p>
              当前真实接入的是东京都公开水系、绿地/公园图层，所以能稳定判定河川和市立公园。
              学院、商业中心、工业区、圣地、剧院广场、社区和农场已经有分类模型，但不会用假规则生成；
              下一步接入 OSM 的 POI / landuse 计数后，再让这些区域真正出现在格子上。
            </p>
          </div>
          <div>
            <h2>隐私边界</h2>
            <p>
              这个页面不使用访客当前位置，不读取 IP 位置，也不请求浏览器 geolocation。
              它只展示公开地理数据经过 QGIS 处理后的策略游戏风格抽象结果。
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default TokyoHexMap;
