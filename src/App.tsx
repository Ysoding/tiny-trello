import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { KanbanBoard } from "./KanbanBoard";
import { KanbanCard, KanbanCardItem } from "./KanbanCard";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanNewCard } from "./KanbanNewCard";

const DATA_LOCAL_STORE_KEY = "KANBAN_DATA_STORE";
const COLUMN_KEY_TODO = "todo";
const COLUMN_KEY_ONGOING = "ongoing";
const COLUMN_KEY_DONE = "done";

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
