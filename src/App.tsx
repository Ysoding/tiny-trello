import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import {
  COLUMN_KEY_DONE,
  COLUMN_KEY_ONGOING,
  COLUMN_KEY_TODO,
  KanbanBoard,
} from "./KanbanBoard";
import { KanbanCardItem } from "./KanbanCard";
import AdminContext from "./context/AdminContext";

const DATA_LOCAL_STORE_KEY = "KANBAN_DATA_STORE";

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
  const [isAdmin, setIsAdmin] = useState(false);

  const handleToggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

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

  const updaters: {
    [key: string]: (
      arg: (currState: KanbanCardItem[]) => KanbanCardItem[]
    ) => void;
  } = {
    [COLUMN_KEY_TODO]: setTodoList,
    [COLUMN_KEY_ONGOING]: setOngoingList,
    [COLUMN_KEY_DONE]: setDoneList,
  };

  const handleAdd = (target: string, newCard: KanbanCardItem) => {
    updaters[target]((currentState) => [newCard, ...currentState]);
  };

  const handleRemove = (source: string, newCard: KanbanCardItem) => {
    updaters[source]((currentState) =>
      currentState.filter((item) => !Object.is(item, newCard))
    );
  };

  return (
    <div className="app">
      <header className="header">
        <h1>
          Tiny Trello
          <button onClick={handleSaveAll}>保存所有卡片</button>
          <label>
            <input
              type="checkbox"
              value={isAdmin ? "true" : "false"}
              onChange={handleToggleAdmin}
            />
            管理员模式
          </label>
        </h1>
        <img src={reactLogo} className="logo" alt="logo" />
      </header>
      <AdminContext.Provider value={isAdmin}>
        <KanbanBoard
          isLoading={isLoading}
          todoList={todoList}
          doneList={doneList}
          ongoingList={ongoingList}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </AdminContext.Provider>
    </div>
  );
}

export default App;
