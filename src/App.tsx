import React, { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

interface CardItem {
  title: string;
  create_time: string;
}

interface NewCardProp {
  onSumbit: (title: string) => void;
}

function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useState<Array<CardItem>>([
    { title: "Kata1", create_time: "24-04-29 18:15" },
    { title: "Kata2", create_time: "24-04-29 18:15" },
    { title: "English", create_time: "24-04-29 18:15" },
    { title: "English", create_time: "24-04-29 18:15" },
    { title: "English", create_time: "24-04-29 18:15" },
    { title: "English", create_time: "24-04-29 18:15" },
    { title: "English", create_time: "24-04-29 18:15" },
    { title: "Math", create_time: "24-04-29 18:15" },
  ]);
  const [ongoingList, setOngoingList] = useState<Array<CardItem>>([
    { title: "Kata11", create_time: "24-04-29 18:15" },
    { title: "Kata22", create_time: "24-04-29 18:15" },
  ]);

  const [doneList, setDoneList] = useState<Array<CardItem>>([
    { title: "English2", create_time: "24-04-29 18:15" },
    { title: "Math2", create_time: "24-04-29 18:15" },
  ]);

  useEffect(() => {
    const handleClick = (evt: MouseEvent) => {
      console.log(evt.target);
      const isOutsideComponent = !document
        .querySelector(".column-todo")
        ?.contains(evt.target as Node);
      if (isOutsideComponent) {
        setShowAdd(false);
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  const Card = (c: CardItem) => {
    return (
      <li className="card">
        <div className="card-title">{c.title}</div>
        <div className="card-create_time">{c.create_time}</div>
      </li>
    );
  };

  const handleSubmit = (title: string) => {
    setTodoList([{ title, create_time: new Date().toString() }, ...todoList]);
    // setShowAdd(false);
  };

  const NewCard = ({ onSumbit }: NewCardProp) => {
    const [title, setTitle] = useState("");
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(evt.target.value);
    };
    const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === "Enter") {
        onSumbit(title);
      }
    };

    return (
      <li className="card">
        <h3>添加新卡片</h3>
        <div className="card-title">
          <input
            type="text"
            value={title}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </li>
    );
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Tiny Trello</h1>
        <img src={reactLogo} className="logo" alt="logo" />
      </header>
      <main className="main-board">
        <section className="column column-todo">
          <h2>
            待处理
            <button
              onClick={() => {
                setShowAdd(true);
              }}
              disabled={showAdd}
            >
              ⊕ 添加新卡片
            </button>
          </h2>
          <ul>
            {showAdd && <NewCard onSumbit={handleSubmit} />}
            {todoList.map((item) => (
              <Card {...item} />
            ))}
          </ul>
        </section>
        <section className="column column-ongoing">
          <h2>进行中</h2>
          <ul>
            {ongoingList.map((item) => (
              <Card {...item} />
            ))}
          </ul>
        </section>
        <section className="column column-done">
          <h2>已完成</h2>
          <ul>
            {doneList.map((item) => (
              <Card {...item} />
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
