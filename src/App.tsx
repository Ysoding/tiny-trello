import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Tiny Trello</h1>
        <img src={reactLogo} className="logo" alt="logo" />
      </header>
      <main className="main-board">
        <section className="column column-todo">
          <h2>待处理</h2>
        </section>
        <section className="column column-ongoing">
          <h2>进行中</h2>
        </section>
        <section className="column column-done">
          <h2>已完成</h2>
        </section>
      </main>
    </div>
  );
}

export default App;
