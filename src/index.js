import "./index.css";

import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserManage from "./pages/UserManage";
import UserDetail from "./pages/UserDetail";
import ReadArticle from "./pages/ReadArticle";
import EditArticle from "./pages/EditArticle";
import ArticleManage from "./pages/ArticleManage";
import ArticleSearch from "./pages/ArticleSearch";
import ArticleReadHistory from "./pages/ArticleReadHistory";
import About from "./pages/About";
import AssistantWidget from "./components/assistant/AssistantWidget";

const MouseParallax = () => {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || coarsePointer) {
      document.documentElement.style.setProperty("--scene-active", "0");
      return undefined;
    }

    const root = document.documentElement;
    let frameId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetActive = 0;
    let currentActive = 0;
    let targetBeamSoftX = 0;
    let targetBeamSoftY = 0;
    let currentBeamSoftX = 0;
    let currentBeamSoftY = 0;
    let targetBeamCoreX = 0;
    let targetBeamCoreY = 0;
    let currentBeamCoreX = 0;
    let currentBeamCoreY = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      currentBeamSoftX += (targetBeamSoftX - currentBeamSoftX) * 0.1;
      currentBeamSoftY += (targetBeamSoftY - currentBeamSoftY) * 0.1;
      currentBeamCoreX += (targetBeamCoreX - currentBeamCoreX) * 0.1;
      currentBeamCoreY += (targetBeamCoreY - currentBeamCoreY) * 0.1;
      currentActive += (targetActive - currentActive) * 0.08;
      const dim = 0.88 - currentActive * 0.2;
      root.style.setProperty("--parallax-x", `${currentX.toFixed(2)}px`);
      root.style.setProperty("--parallax-y", `${currentY.toFixed(2)}px`);
      root.style.setProperty("--parallax-x-invert", `${(-currentX * 0.6).toFixed(2)}px`);
      root.style.setProperty("--parallax-y-invert", `${(-currentY * 0.6).toFixed(2)}px`);
      root.style.setProperty("--beam-soft-x", `${currentBeamSoftX.toFixed(2)}px`);
      root.style.setProperty("--beam-soft-y", `${currentBeamSoftY.toFixed(2)}px`);
      root.style.setProperty("--beam-core-x", `${currentBeamCoreX.toFixed(2)}px`);
      root.style.setProperty("--beam-core-y", `${currentBeamCoreY.toFixed(2)}px`);
      root.style.setProperty("--scene-active", currentActive.toFixed(3));
      root.style.setProperty("--scene-dim", dim.toFixed(3));
      frameId = requestAnimationFrame(tick);
    };

    const handleMove = (e) => {
      const ratioX = (e.clientX / window.innerWidth - 0.5) * 2;
      const ratioY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX = ratioX * 14;
      targetY = ratioY * 10;
      targetBeamSoftX = ratioX * -58;
      targetBeamSoftY = ratioY * -34;
      targetBeamCoreX = ratioX * -92;
      targetBeamCoreY = ratioY * -56;
      targetActive = 1;
    };

    const handleLeave = () => {
      targetX = 0;
      targetY = 0;
      targetBeamSoftX = 0;
      targetBeamSoftY = 0;
      targetBeamCoreX = 0;
      targetBeamCoreY = 0;
      targetActive = 0;
    };
    const handleVisibility = () => {
      if (document.hidden) {
        handleLeave();
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseenter", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseleave", handleLeave);
    window.addEventListener("blur", handleLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseenter", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
};

const AppRouter = () => (
  <Router>
    <Switch>
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/userManage" component={UserManage} />
      <Route path="/userDetail/:id" component={UserDetail} />
      <Route path="/article/read/:id" component={ReadArticle} />
      <Route path="/article/readHistory/:id" component={ArticleReadHistory} />
      <Route path="/article/edit/:id" component={EditArticle} />
      <Route path="/articleManage" component={ArticleManage} />
      <Route path="/article/search/:keyword" component={ArticleSearch} />
      <Route path="/about" component={About} />
      <Route path="/" component={App} />
    </Switch>
  </Router>
);

ReactDOM.render(
  <>
    <MouseParallax />
    <AppRouter />
    <AssistantWidget />
  </>,
  document.getElementById("root")
);


