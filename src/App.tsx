import React, { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

interface KanbanCardProp {
  title: string;
  createTime: string;
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

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

const KanbanCard = ({ title, createTime }: KanbanCardProp) => {
  const [dispalyTime, setDisplayTime] = useState(createTime);

  useEffect(() => {
    const updateDisplayTime = () => {
      const createTimeDate = new Date(createTime);
      const nowDate = new Date();
      const timePassed = nowDate.getTime() - createTimeDate.getTime();

      let relativeTime = "刚刚";

      if (MINUTE <= timePassed && timePassed < HOUR) {
        relativeTime = `${Math.ceil(timePassed / MINUTE)} 分钟前`;
      } else if (HOUR <= timePassed && timePassed < DAY) {
        relativeTime = `${Math.ceil(timePassed / HOUR)} 小时前`;
      } else if (DAY <= timePassed) {
        relativeTime = `${Math.ceil(timePassed / DAY)} 天前`;
      }

      setDisplayTime(relativeTime);
    };

    const intervalID = setInterval(updateDisplayTime, UPDATE_INTERVAL);
    updateDisplayTime();

    return function cleanup() {
      clearInterval(intervalID);
    };
  }, [createTime]);

  return (
    <li className="kanban-card">
      <div className="kanban-card-title">{title}</div>
      <div title={createTime}>{dispalyTime}</div>
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
  const [todoList, setTodoList] = useState<Array<KanbanCardProp>>([
    { title: "Kata1", createTime: "2024-04-29 18:15" },
    { title: "Kata2", createTime: "2024-04-29 18:15" },
    { title: "English", createTime: "2024-04-29 18:15" },
    { title: "Math", createTime: "2024-04-29 18:15" },
  ]);
  const [ongoingList, setOngoingList] = useState<Array<KanbanCardProp>>([
    { title: "Kata11", createTime: "2024-04-29 18:15" },
    { title: "Kata22", createTime: "2024-04-29 18:15" },
  ]);

  const [doneList, setDoneList] = useState<Array<KanbanCardProp>>([
    { title: "English2", createTime: "2024-04-29 18:15" },
    { title: "Math2", createTime: "2024-04-29 18:15" },
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
    setTodoList([{ title, createTime: new Date().toString() }, ...todoList]);
  };

  const KanbanNewCard = ({ onSumbit }: NewCardProp) => {
    const [title, setTitle] = useState("");
    const inputElem = useRef<HTMLInputElement>(null);
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(evt.target.value);
    };
    const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === "Enter") {
        onSumbit(title);
      }
    };

    useEffect(() => {
      if (inputElem.current) {
        inputElem.current.focus();
      }
    }, []);

    return (
      <li className="kanban-card">
        <h3>添加新卡片</h3>
        <div className="kanban-card-title">
          <input
            type="text"
            value={title}
            onChange={handleChange}
            ref={inputElem}
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
          {showAdd && <KanbanNewCard onSumbit={handleSubmit} />}
          {todoList.map((item) => (
            <KanbanCard key={item.title} {...item} />
          ))}
        </KanbanColumn>

        <KanbanColumn title="进行中" className="kanban-column-ongoing">
          {ongoingList.map((item) => (
            <KanbanCard key={item.title} {...item} />
          ))}
        </KanbanColumn>

        <KanbanColumn className="kanban-column-done" title="已完成">
          {doneList.map((item) => (
            <KanbanCard key={item.title} {...item} />
          ))}
        </KanbanColumn>
      </KanbanBoard>
    </div>
  );
}

export default App;
