import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../css/assistantWidget.css";

const ASSISTANT_TIPS = [
  "欢迎来到我的博客，要不要看看最新文章？",
  "右下角的我可以陪你聊天，也能帮你找文章。",
  "如果你在看技术文，我可以帮你快速总结重点。"
];

const QUICK_ACTIONS = [
  { label: "介绍博客", answer: "这里主要记录后端开发、AI 工程实践，以及投资和历史相关思考。" },
  { label: "推荐文章", answer: "你可以先看首页最新文章，通常是最近完成的实战记录和复盘。" },
  { label: "作者是谁", answer: "作者是常驻日本的后端工程师，主力技术栈是 Java 和 TypeScript。" }
];

const PUBLIC_BASE = process.env.PUBLIC_URL || "";
const toPublicPath = (path) => `${PUBLIC_BASE}${path}`;
const LIVE2D_MODEL_PATH = toPublicPath("/live2d/hiyori/hiyori_pro_t11.model3.json");
const FALLBACK_IMAGE_PATH = toPublicPath("/static/assistant/hiyori-placeholder.jpg");
const PIXI_CDN = "https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js";
const CUBISM_CORE_PATH = toPublicPath("/live2d/lib/live2dcubismcore.min.js");
const LIVE2D_CDN = "https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.4.0/dist/cubism4.min.js";

const AVATAR_WIDTH = 320;
const AVATAR_HEIGHT = 420;
const GAZE_SENSITIVITY_X = 1.4;
const GAZE_SENSITIVITY_Y = 1.25;
const HEAD_FOLLOW_STRENGTH = 20;
const HEAD_FOLLOW_SMOOTH = 0.14;
const MODEL_SCALE_FACTOR = 1.08;
const MODEL_BASELINE_RATIO = 1.16;
const EYE_CENTER_BIAS_X = 0.0;
const EYE_CENTER_BIAS_Y = 0.0;

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
        reject(new Error(`脚本已加载但运行时未就绪: ${src}`));
      }
    };

    const existed = document.querySelector(`script[data-src='${src}']`);
    if (existed) {
      if (existed.dataset.loaded === "true") {
        verifyReady();
        return;
      }
      existed.addEventListener("load", verifyReady, { once: true });
      existed.addEventListener("error", () => reject(new Error(`加载失败: ${src}`)), { once: true });
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
    script.onerror = () => reject(new Error(`加载失败: ${src}`));
    document.body.appendChild(script);
  });
};

const AssistantWidget = () => {
  const [tip, setTip] = useState(ASSISTANT_TIPS[0]);
  const [miniOpen, setMiniOpen] = useState(false);
  const [quickReply, setQuickReply] = useState("");
  const [checkingModel, setCheckingModel] = useState(true);
  const [modelMissing, setModelMissing] = useState(false);
  const [modelAvailable, setModelAvailable] = useState(false);
  const [modelError, setModelError] = useState("");
  const [position, setPosition] = useState({ x: null, y: null });
  const [dragging, setDragging] = useState(false);

  const live2dRef = useRef(null);
  const shellRef = useRef(null);
  const modelRef = useRef(null);
  const gazeRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const poseRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });

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
    const timer = window.setInterval(() => {
      const idx = Math.floor(Math.random() * ASSISTANT_TIPS.length);
      setTip(ASSISTANT_TIPS[idx]);
    }, 12000);
    return () => window.clearInterval(timer);
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
          throw new Error("Live2D 运行时未正确初始化（Live2DModel.from 不可用）");
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
        setModelError(err instanceof Error ? err.message : "Live2D 加载失败");
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
      if (typeof coreModel.setParameterValueById === "function") {
        coreModel.setParameterValueById(id, value);
      } else if (typeof coreModel.addParameterValueById === "function") {
        coreModel.addParameterValueById(id, value, 1);
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

        const halfW = refRect ? refRect.width * 0.35 : window.innerWidth / 2;
        const halfH = refRect ? refRect.height * 0.28 : window.innerHeight / 2;
        const normX = clamp(((gazeRef.current.x - refCenterX) / halfW) * GAZE_SENSITIVITY_X, -1, 1);
        const normY = clamp(((gazeRef.current.y - refCenterY) / halfH) * GAZE_SENSITIVITY_Y, -1, 1);
        const focusX = refCenterX + normX * halfW;
        const focusY = refCenterY + normY * halfH;

        if (typeof model.focus === "function") {
          model.focus(focusX, focusY);
        } else if (model.internalModel?.focusController?.focus) {
          model.internalModel.focusController.focus(normX, -normY, false);
        }

        poseRef.current.x += (normX - poseRef.current.x) * HEAD_FOLLOW_SMOOTH;
        poseRef.current.y += (normY - poseRef.current.y) * HEAD_FOLLOW_SMOOTH;

        const headXDeg = -poseRef.current.x * HEAD_FOLLOW_STRENGTH;
        const headYDeg = -poseRef.current.y * HEAD_FOLLOW_STRENGTH * 0.7;
        const bodyXDeg = -poseRef.current.x * 4;

        const coreModel = model.internalModel?.coreModel;
        setCoreParam(coreModel, "ParamAngleX", headXDeg);
        setCoreParam(coreModel, "ParamAngleY", headYDeg);
        setCoreParam(coreModel, "ParamBodyAngleX", bodyXDeg);
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

    const moved = dragRef.current.moved;
    dragRef.current.active = false;
    setDragging(false);

    if (!moved) {
      setMiniOpen((prev) => !prev);
    }
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
    <aside ref={shellRef} className="assistant-shell" style={shellStyle} aria-label="博客 AI 小助手">
      {!miniOpen && tip ? <div className="assistant-bubble">{tip}</div> : null}

      {miniOpen ? (
        <section className="assistant-mini" aria-label="助手快捷卡片">
          <div className="assistant-mini__header">
            <strong>快捷助手</strong>
            <button type="button" onClick={() => setMiniOpen(false)}>
              收起
            </button>
          </div>
          <div className="assistant-mini__actions">
            {QUICK_ACTIONS.map((item) => (
              <button key={item.label} type="button" onClick={() => setQuickReply(item.answer)}>
                {item.label}
              </button>
            ))}
          </div>
          <p className="assistant-mini__reply">{quickReply || "点一个问题试试。"}</p>
        </section>
      ) : null}

      <button
        type="button"
        className={`assistant-avatar ${dragging ? "assistant-avatar--dragging" : ""}`}
        aria-expanded={miniOpen}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setMiniOpen((prev) => !prev);
          }
        }}
      >
        {modelAvailable && !modelError ? <div ref={live2dRef} className="assistant-live2d-stage" /> : <img src={FALLBACK_IMAGE_PATH} alt="助手立绘" />}
      </button>

      {modelError ? <p className="assistant-hint">Live2D 错误：{modelError}</p> : null}
      {!checkingModel && modelMissing ? <p className="assistant-hint">未检测到 model3.json，已自动切换立绘模式。</p> : null}
    </aside>
  );
};

export default AssistantWidget;
