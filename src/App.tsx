import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { KanbanBoard } from "./KanbanBoard";
import { KanbanCardItem } from "./KanbanCard";
import { KanbanColumn } from "./KanbanColumn";

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
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<KanbanCardItem>();
  const [dragSource, setDragSource] = useState<string>("");
  const [dragTarget, setDragTarget] = useState<string>("");

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

  const handleAdd = (newCard: KanbanCardItem) => {
    setTodoList([newCard, ...todoList]);
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
              title="待处理"
              setIsDragSource={(isSrc) =>
                setDragSource(isSrc ? COLUMN_KEY_TODO : "")
              }
              setIsDragTarget={(isTgt) =>
                setDragTarget(isTgt ? COLUMN_KEY_TODO : "")
              }
              onDrop={handleDrop}
              cardList={todoList}
              setDraggedItem={setDraggedItem}
              onAdd={handleAdd}
              canAddNew
            />

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
              cardList={ongoingList}
              setDraggedItem={setDraggedItem}
            />

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
              cardList={doneList}
              setDraggedItem={setDraggedItem}
            />
          </>
        )}
      </KanbanBoard>
    </div>
  );
}

export default App;
