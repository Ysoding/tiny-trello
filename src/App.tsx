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

interface KanbanBoardProp {
  children: React.ReactNode;
}

interface KanbanColumnProp {
  className: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

const KanbanCard = (c: CardItem) => {
  return (
    <li className="kanban-card">
      <div className="kanban-card-title">{c.title}</div>
      <div className="kanban-card-create_time">{c.create_time}</div>
    </li>
  );
};

const KanbanColumn = ({ children, title, className }: KanbanColumnProp) => {
  const combinedClassName = `kanban-column ${className}`;
  return (
    <section className={combinedClassName}>
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  );
};

const KanbanBoard = ({ children }: KanbanBoardProp) => {
  return <main className="kanban-board">{children}</main>;
};

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
      const isOutsideComponent = !document
        .querySelector(".kanban-column-todo")
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
      <li className="kanban-card">
        <h3>添加新卡片</h3>
        <div className="kanban-card-title">
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
      <KanbanBoard>
        <KanbanColumn
          className="kanban-column-todo"
          title={
            <>
              待处理
              <button
                onClick={() => {
                  setShowAdd(true);
                }}
                disabled={showAdd}
              >
                ⊕ 添加新卡片
              </button>
            </>
          }
        >
          {showAdd && <NewCard onSumbit={handleSubmit} />}
          {todoList.map((item) => (
            <KanbanCard {...item} />
          ))}
        </KanbanColumn>

        <KanbanColumn title="进行中" className="kanban-column-ongoing">
          {ongoingList.map((item) => (
            <KanbanCard {...item} />
          ))}
        </KanbanColumn>

        <KanbanColumn className="kanban-column-done" title="已完成">
          {doneList.map((item) => (
            <KanbanCard {...item} />
          ))}
        </KanbanColumn>
      </KanbanBoard>
    </div>
  );
}

export default App;
