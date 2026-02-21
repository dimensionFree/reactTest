import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../css/assistantWidget.css";

const PUBLIC_BASE = process.env.PUBLIC_URL || "";
const toPublicPath = (path) => `${PUBLIC_BASE}${path}`;
const LIVE2D_MODEL_PATH = toPublicPath("/live2d/hiyori/hiyori_pro_t11.model3.json");
const FALLBACK_IMAGE_PATH = toPublicPath("/static/assistant/hiyori-placeholder.jpg");
const PIXI_CDN = "https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js";
const CUBISM_CORE_PATH = toPublicPath("/live2d/lib/live2dcubismcore.min.js");
const LIVE2D_CDN = "https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.4.0/dist/cubism4.min.js";

const AVATAR_WIDTH = 320;
const AVATAR_HEIGHT = 420;
const GAZE_SENSITIVITY_X = 3.3;
const GAZE_SENSITIVITY_Y = 2.925;
const HEAD_FOLLOW_STRENGTH = 48;
const HEAD_FOLLOW_SMOOTH = 0.3;
const HEAD_ROLL_STRENGTH = 13.5;
const TRACK_HORIZONTAL_DIRECTION = 1;
const EYE_HORIZONTAL_DIRECTION = 1;
const MODEL_SCALE_FACTOR = 0.94;
const MODEL_BASELINE_RATIO = 1.0;
const EYE_CENTER_BIAS_X = 0.0;
const EYE_CENTER_BIAS_Y = 0.0;
const GREETING_DELAY_MS = 5000;
const GREETING_VISIBLE_MS = 6000;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getPointerPoint = (event) => {
  if (event.touches && event.touches[0]) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  if (event.changedTouches && event.changedTouches[0]) {
    return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
  }
  return { x: event.clientX, y: event.clientY };
};

const ensureScript = (src, checkFn) => {
  if (checkFn()) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const verifyReady = () => {
      if (checkFn()) {
        resolve();
      } else {
        reject(new Error(`スクリプトは読み込み済みですが、実行時に未初期化です: ${src}`));
      }
    };

    const existed = document.querySelector(`script[data-src='${src}']`);
    if (existed) {
      if (existed.dataset.loaded === "true") {
        verifyReady();
        return;
      }
      existed.addEventListener("load", verifyReady, { once: true });
      existed.addEventListener("error", () => reject(new Error(`読み込み失敗: ${src}`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.src = src;
    script.onload = () => {
      script.dataset.loaded = "true";
      verifyReady();
    };
    script.onerror = () => reject(new Error(`読み込み失敗: ${src}`));
    document.body.appendChild(script);
  });
};

const toNum = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) {
    return "おはよう";
  }
  if (hour < 18) {
    return "こんにちは";
  }
  return "こんばんは";
};

const getWeatherIcon = (weatherCode) => {
  if (weatherCode === 0) {
    return "☀";
  }
  if (weatherCode === 1 || weatherCode === 2) {
    return "⛅";
  }
  if (weatherCode === 3 || weatherCode === 45 || weatherCode === 48) {
    return "☁";
  }
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return "🌧";
  }
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return "❄";
  }
  if ([95, 96, 99].includes(weatherCode)) {
    return "⛈";
  }
  return "🌤";
};

const getTemperatureComment = (temp) => {
  if (!Number.isFinite(temp)) {
    return "空気の感じを見て、無理しないでね。";
  }
  if (temp <= 2) {
    return "かなり冷えるね。手先を温めていこう。";
  }
  if (temp <= 10) {
    return "体感が下がる温度だね。今日は暖かくしてね。";
  }
  if (temp <= 18) {
    return "少しひんやり。羽織りがあると安心だよ。";
  }
  if (temp <= 27) {
    return "過ごしやすいけど、水分はこまめにね。";
  }
  return "暑いね。無理せず涼しい場所で休もう。";
};

const getWeatherRoast = (weatherCode, temp) => {
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    return `雨って、寒いね。${getTemperatureComment(temp)}`;
  }
  if ([95, 96, 99].includes(weatherCode)) {
    return "雷雨の可能性があるよ。今日は慎重にいこう。";
  }
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return `雪の気配だね。${getTemperatureComment(temp)}`;
  }
  if (weatherCode === 0) {
    return `晴れてるね。${getTemperatureComment(temp)}`;
  }
  if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3 || weatherCode === 45 || weatherCode === 48) {
    return `空が落ち着いた色だね。${getTemperatureComment(temp)}`;
  }
  return `天気が変わりやすそう。${getTemperatureComment(temp)}`;
};

const fetchGeoContext = async () => {
  try {
    const resp = await fetch("https://ipapi.co/json/");
    if (resp.ok) {
      const data = await resp.json();
      const city = typeof data.city === "string" ? data.city : "";
      const latitude = toNum(data.latitude);
      const longitude = toNum(data.longitude);
      if (city || (latitude !== null && longitude !== null)) {
        return { city, latitude, longitude };
      }
    }
  } catch (_) {
    // noop
  }

  try {
    const resp = await fetch("https://ipwho.is/");
    if (resp.ok) {
      const data = await resp.json();
      if (data.success !== false) {
        const city = typeof data.city === "string" ? data.city : "";
        const latitude = toNum(data.latitude);
        const longitude = toNum(data.longitude);
        if (city || (latitude !== null && longitude !== null)) {
          return { city, latitude, longitude };
        }
      }
    }
  } catch (_) {
    // noop
  }

  return { city: "", latitude: null, longitude: null };
};

const fetchWeatherContext = async (latitude, longitude) => {
  if (latitude === null || longitude === null) {
    return { weatherCode: null, temp: null };
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
    const resp = await fetch(url);
    if (!resp.ok) {
      return { weatherCode: null, temp: null };
    }
    const data = await resp.json();
    const weatherCode = toNum(data?.current?.weather_code);
    const temp = toNum(data?.current?.temperature_2m);
    return { weatherCode, temp };
  } catch (_) {
    return { weatherCode: null, temp: null };
  }
};

const AssistantWidget = () => {
  const [greetingText, setGreetingText] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);
  const [weatherBadge, setWeatherBadge] = useState({ icon: "🌤", roast: "天気データを取得中..." });
  const [checkingModel, setCheckingModel] = useState(true);
  const [modelMissing, setModelMissing] = useState(false);
  const [modelAvailable, setModelAvailable] = useState(false);
  const [modelError, setModelError] = useState("");
  const [position, setPosition] = useState({ x: null, y: null });
  const [dragging, setDragging] = useState(false);

  const live2dRef = useRef(null);
  const shellRef = useRef(null);
  const modelRef = useRef(null);
  const greetingShowTimerRef = useRef(0);
  const greetingHideTimerRef = useRef(0);
  const gazeRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const poseRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

  useEffect(() => {
    let disposed = false;

    const loadGeoAndWeather = async () => {
      const { city, latitude, longitude } = await fetchGeoContext();
      const greeting = city ? `${getTimeGreeting()}、${city}のあなたへ。` : `${getTimeGreeting()}。`;
      const { weatherCode, temp } = await fetchWeatherContext(latitude, longitude);
      const icon = getWeatherIcon(weatherCode);
      const roast = getWeatherRoast(weatherCode, temp);

      if (disposed) {
        return;
      }

      setGreetingText(greeting);
      setWeatherBadge({ icon, roast });

      greetingShowTimerRef.current = window.setTimeout(() => {
        setShowGreeting(true);
        greetingHideTimerRef.current = window.setTimeout(() => {
          setShowGreeting(false);
        }, GREETING_VISIBLE_MS);
      }, GREETING_DELAY_MS);
    };

    loadGeoAndWeather();

    return () => {
      disposed = true;
      if (greetingShowTimerRef.current) {
        window.clearTimeout(greetingShowTimerRef.current);
      }
      if (greetingHideTimerRef.current) {
        window.clearTimeout(greetingHideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    setCheckingModel(true);

    fetch(LIVE2D_MODEL_PATH, { method: "GET" })
      .then((resp) => {
        if (!disposed) {
          setModelAvailable(resp.ok);
          setModelMissing(!resp.ok);
          setCheckingModel(false);
        }
      })
      .catch(() => {
        if (!disposed) {
          setModelAvailable(false);
          setModelMissing(true);
          setCheckingModel(false);
        }
      });

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    if (!modelAvailable || !live2dRef.current) {
      return undefined;
    }

    let disposed = false;
    let app = null;

    const setupLive2D = async () => {
      try {
        await ensureScript(PIXI_CDN, () => Boolean(window.PIXI));
        await ensureScript(CUBISM_CORE_PATH, () => Boolean(window.Live2DCubismCore));
        await ensureScript(LIVE2D_CDN, () => Boolean(window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel));

        if (disposed || !live2dRef.current || !window.PIXI) {
          return;
        }

        app = new window.PIXI.Application({
          width: AVATAR_WIDTH,
          height: AVATAR_HEIGHT,
          transparent: true,
          antialias: true,
          autoStart: true
        });

        live2dRef.current.innerHTML = "";
        live2dRef.current.appendChild(app.view);

        const Live2DModel = window.PIXI?.live2d?.Live2DModel;
        if (!Live2DModel || typeof Live2DModel.from !== "function") {
          throw new Error("Live2D ランタイムの初期化に失敗しました（Live2DModel.from が利用できません）");
        }

        const model = await Live2DModel.from(LIVE2D_MODEL_PATH, { autoInteract: false });
        if (disposed) {
          model.destroy();
          return;
        }

        const scale = Math.min(AVATAR_WIDTH / model.width, AVATAR_HEIGHT / model.height) * MODEL_SCALE_FACTOR;
        model.scale.set(scale);
        model.x = app.renderer.width / 2;
        model.y = app.renderer.height * MODEL_BASELINE_RATIO;

        if (model.anchor && typeof model.anchor.set === "function") {
          model.anchor.set(0.5, 1);
        } else {
          model.pivot.set(model.width / 2, model.height);
        }

        app.stage.addChild(model);
        modelRef.current = model;
        poseRef.current = { x: 0, y: 0 };
        setModelError("");
      } catch (err) {
        modelRef.current = null;
        setModelError(err instanceof Error ? err.message : "Live2D の読み込みに失敗しました");
      }
    };

    setupLive2D();

    return () => {
      disposed = true;
      modelRef.current = null;
      if (app) {
        app.destroy(true, { children: true, texture: true, baseTexture: true });
      }
    };
  }, [modelAvailable]);

  useEffect(() => {
    const onPointerMove = (event) => {
      const point = getPointerPoint(event);
      gazeRef.current.x = point.x;
      gazeRef.current.y = point.y;
    };

    const setCoreParam = (coreModel, id, value) => {
      if (!coreModel) {
        return;
      }
      if (typeof coreModel.addParameterValueById === "function") {
        coreModel.addParameterValueById(id, value, 1);
      }
      if (typeof coreModel.setParameterValueById === "function") {
        coreModel.setParameterValueById(id, value);
      }
    };

    let rafId = 0;
    const tick = () => {
      const model = modelRef.current;
      if (model) {
        const avatarRect = live2dRef.current?.getBoundingClientRect();
        const refRect = avatarRect || shellRef.current?.getBoundingClientRect();
        const refCenterX = refRect
          ? refRect.left + refRect.width * (0.5 + EYE_CENTER_BIAS_X)
          : window.innerWidth / 2;
        const refCenterY = refRect
          ? refRect.top + refRect.height * (0.5 + EYE_CENTER_BIAS_Y)
          : window.innerHeight / 2;

        const halfW = refRect ? refRect.width * 0.22 : window.innerWidth / 2;
        const halfH = refRect ? refRect.height * 0.18 : window.innerHeight / 2;
        const normX = clamp(((gazeRef.current.x - refCenterX) / halfW) * GAZE_SENSITIVITY_X, -1, 1);
        const normY = clamp(((gazeRef.current.y - refCenterY) / halfH) * GAZE_SENSITIVITY_Y, -1, 1);

        poseRef.current.x += (normX - poseRef.current.x) * HEAD_FOLLOW_SMOOTH;
        poseRef.current.y += (normY - poseRef.current.y) * HEAD_FOLLOW_SMOOTH;

        const trackedX = poseRef.current.x * TRACK_HORIZONTAL_DIRECTION;
        const headXDeg = trackedX * HEAD_FOLLOW_STRENGTH;
        const headYDeg = -poseRef.current.y * HEAD_FOLLOW_STRENGTH * 0.85;
        const headZDeg = trackedX * HEAD_ROLL_STRENGTH + poseRef.current.y * 2.2;
        const bodyXDeg = trackedX * 7;
        const eyeX = trackedX * 1.2 * EYE_HORIZONTAL_DIRECTION;
        const eyeY = -poseRef.current.y * 1.2;

        const coreModel = model.internalModel?.coreModel;
        setCoreParam(coreModel, "ParamAngleX", headXDeg);
        setCoreParam(coreModel, "ParamAngleY", headYDeg);
        setCoreParam(coreModel, "ParamAngleZ", headZDeg);
        setCoreParam(coreModel, "ParamBodyAngleX", bodyXDeg);
        setCoreParam(coreModel, "ParamEyeBallX", eyeX);
        setCoreParam(coreModel, "ParamEyeBallY", eyeY);
      }
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const onDragMove = useCallback((event) => {
    if (!dragRef.current.active || !shellRef.current) {
      return;
    }

    const point = getPointerPoint(event);
    const moveX = point.x - dragRef.current.startX;
    const moveY = point.y - dragRef.current.startY;
    if (Math.abs(moveX) > 3 || Math.abs(moveY) > 3) {
      dragRef.current.moved = true;
    }

    const rect = shellRef.current.getBoundingClientRect();
    const maxX = Math.max(window.innerWidth - rect.width, 0);
    const maxY = Math.max(window.innerHeight - rect.height, 0);
    setPosition({ x: clamp(dragRef.current.baseX + moveX, 0, maxX), y: clamp(dragRef.current.baseY + moveY, 0, maxY) });
    event.preventDefault();
  }, []);

  const onDragEnd = useCallback(() => {
    if (!dragRef.current.active) {
      return;
    }
    dragRef.current.active = false;
    setDragging(false);
  }, []);

  const onDragStart = useCallback((event) => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    const point = getPointerPoint(event);
    const rect = shell.getBoundingClientRect();
    dragRef.current = {
      active: true,
      moved: false,
      startX: point.x,
      startY: point.y,
      baseX: rect.left,
      baseY: rect.top
    };

    setDragging(true);
    setPosition((prev) => (prev.x === null ? { x: rect.left, y: rect.top } : prev));
    event.preventDefault();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => onDragMove(event);
    const handleMouseUp = () => onDragEnd();
    const handleTouchMove = (event) => onDragMove(event);
    const handleTouchEnd = () => onDragEnd();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [onDragMove, onDragEnd]);

  const shellStyle =
    position.x === null
      ? undefined
      : {
          left: `${position.x}px`,
          top: `${position.y}px`,
          right: "auto",
          bottom: "auto"
        };

  return (
    <aside ref={shellRef} className="assistant-shell" style={shellStyle} aria-label="ブログ AI アシスタント">
      {showGreeting && greetingText ? <div className="assistant-bubble">{greetingText}</div> : null}

      <div className="assistant-weather-badge" role="note" aria-label="現在の天気コメント">
        <span className="assistant-weather-icon" aria-hidden="true">
          {weatherBadge.icon}
        </span>
        <div className="assistant-weather-tooltip">{weatherBadge.roast}</div>
      </div>

      <button type="button" className={`assistant-avatar ${dragging ? "assistant-avatar--dragging" : ""}`} onMouseDown={onDragStart} onTouchStart={onDragStart}>
        {modelAvailable && !modelError ? <div ref={live2dRef} className="assistant-live2d-stage" /> : <img src={FALLBACK_IMAGE_PATH} alt="アシスタント立ち絵" />}
      </button>

      {modelError ? <p className="assistant-hint">Live2D エラー: {modelError}</p> : null}
      {!checkingModel && modelMissing ? <p className="assistant-hint">model3.json が見つからないため、立ち絵モードに自動切替しました。</p> : null}
    </aside>
  );
};

export default AssistantWidget;
