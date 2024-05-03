import React, { DragEvent, useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

interface KanbanCardItem {
  title: string;
  createTime: string;
}

interface KanbanCardProp {
  item: KanbanCardItem;
  onDragStart: React.DragEventHandler<HTMLLIElement>;
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
  children?: React.ReactNode;
  setIsDragSource?: (value: boolean) => void;
  setIsDragTarget?: (value: boolean) => void;
  onDrop?: React.DragEventHandler<HTMLElement>;
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;
const DATA_LOCAL_STORE_KEY = "KANBAN_DATA_STORE";
const COLUMN_KEY_TODO = "todo";
const COLUMN_KEY_ONGOING = "ongoing";
const COLUMN_KEY_DONE = "done";

const KanbanCard = ({
  item: { title, createTime },
  onDragStart,
}: KanbanCardProp) => {
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

  const handleDragStart = (evt: DragEvent<HTMLLIElement>) => {
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("text/plain", title);
    onDragStart && onDragStart(evt);
  };

  return (
    <li className="kanban-card" draggable onDragStart={handleDragStart}>
      <div className="kanban-card-title">{title}</div>
      <div title={createTime}>{dispalyTime}</div>
    </li>
  );
};

const KanbanColumn = ({
  children,
  title,
  className,
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  onDrop,
}: KanbanColumnProp) => {
  const combinedClassName = `kanban-column ${className}`;
  return (
    <section
      onDragStart={() => setIsDragSource(true)}
      onDragOver={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move";
        setIsDragTarget(true);
      }}
      onDragLeave={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "none";
        setIsDragTarget(false);
      }}
      onDrop={(evt) => {
        evt.preventDefault();
        onDrop && onDrop(evt);
      }}
      onDragEnd={(evt) => {
        evt.preventDefault();
        setIsDragSource(false);
        setIsDragTarget(false);
      }}
      className={combinedClassName}
    >
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  );
};

const KanbanBoard = ({ children }: KanbanBoardProp) => {
  return <main className="kanban-board">{children}</main>;
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

function App() {
  const [todoList, setTodoList] = useState<Array<KanbanCardItem>>([
    { title: "Kata1", createTime: "2024-04-29 18:15" },
    { title: "Kata2", createTime: "2024-04-29 18:15" },
    { title: "English", createTime: "2024-04-29 18:15" },
    { title: "Math", createTime: "2024-04-29 18:15" },
  ]);
  const [ongoingList, setOngoingList] = useState<Array<KanbanCardItem>>([
    { title: "Kata11", createTime: "2024-04-29 18:15" },
    { title: "Kata22", createTime: "2024-04-29 18:15" },
  ]);
  const [doneList, setDoneList] = useState<Array<KanbanCardItem>>([
    { title: "English2", createTime: "2024-04-29 18:15" },
    { title: "Math2", createTime: "2024-04-29 18:15" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<KanbanCardItem>();
  const [dragSource, setDragSource] = useState<string>("");
  const [dragTarget, setDragTarget] = useState<string>("");

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

  useEffect(() => {
    const data = window.localStorage.getItem(DATA_LOCAL_STORE_KEY);
    setTimeout(() => {
      if (data) {
        const kanbanColumnData = JSON.parse(data);
        setTodoList(kanbanColumnData.todoList);
        setOngoingList(kanbanColumnData.ongoingList);
        setDoneList(kanbanColumnData.doneList);
        setIsLoading(false);
      }
    }, 1000);
  }, []);

  const handleSubmit = (title: string) => {
    setTodoList([{ title, createTime: new Date().toString() }, ...todoList]);
  };

  const handleSaveAll = () => {
    const data = JSON.stringify({
      todoList,
      ongoingList,
      doneList,
    });

    window.localStorage.setItem(DATA_LOCAL_STORE_KEY, data);
  };

  const handleDrop = () => {
    if (
      !draggedItem ||
      !dragSource ||
      !dragTarget ||
      dragSource === dragTarget
    ) {
      return;
    }

    const updaters: {
      [key: string]: (
        arg: (currState: KanbanCardItem[]) => KanbanCardItem[]
      ) => void;
    } = {
      [COLUMN_KEY_TODO]: setTodoList,
      [COLUMN_KEY_ONGOING]: setOngoingList,
      [COLUMN_KEY_DONE]: setDoneList,
    };

    if (dragSource) {
      updaters[dragSource]((currentState) =>
        currentState.filter((item) => !Object.is(item, draggedItem))
      );
    }

    if (dragTarget) {
      updaters[dragTarget]((currentState) => [draggedItem, ...currentState]);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>
          Tiny Trello <button onClick={handleSaveAll}>保存所有卡片</button>
        </h1>
        <img src={reactLogo} className="logo" alt="logo" />
      </header>
      <KanbanBoard>
        {isLoading ? (
          <KanbanColumn
            title="读取中..."
            className="kanban-column-loading"
          ></KanbanColumn>
        ) : (
          <>
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
              setIsDragSource={(isSrc) =>
                setDragSource(isSrc ? COLUMN_KEY_TODO : "")
              }
              setIsDragTarget={(isTgt) =>
                setDragTarget(isTgt ? COLUMN_KEY_TODO : "")
              }
              onDrop={handleDrop}
            >
              {showAdd && <KanbanNewCard onSumbit={handleSubmit} />}
              {todoList.map((item) => (
                <KanbanCard
                  key={item.title}
                  onDragStart={() => setDraggedItem(item)}
                  item={item}
                />
              ))}
            </KanbanColumn>

            <KanbanColumn
              title="进行中"
              className="kanban-column-ongoing"
              setIsDragSource={(isSrc) =>
                setDragSource(isSrc ? COLUMN_KEY_ONGOING : "")
              }
              setIsDragTarget={(isTgt) =>
                setDragTarget(isTgt ? COLUMN_KEY_ONGOING : "")
              }
              onDrop={handleDrop}
            >
              {ongoingList.map((item) => (
                <KanbanCard
                  onDragStart={() => setDraggedItem(item)}
                  key={item.title}
                  item={item}
                />
              ))}
            </KanbanColumn>

            <KanbanColumn
              className="kanban-column-done"
              title="已完成"
              setIsDragSource={(isSrc) =>
                setDragSource(isSrc ? COLUMN_KEY_DONE : "")
              }
              setIsDragTarget={(isTgt) =>
                setDragTarget(isTgt ? COLUMN_KEY_DONE : "")
              }
              onDrop={handleDrop}
            >
              {doneList.map((item) => (
                <KanbanCard
                  onDragStart={() => setDraggedItem(item)}
                  key={item.title}
                  item={item}
                />
              ))}
            </KanbanColumn>
          </>
        )}
      </KanbanBoard>
    </div>
  );
}

export default App;
