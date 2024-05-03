import { useState } from "react";
import { KanbanCardItem } from "./KanbanCard";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProp {
  isLoading: boolean;
  todoList: KanbanCardItem[];
  doneList: KanbanCardItem[];
  ongoingList: KanbanCardItem[];
  onAdd: (target: string, newCard: KanbanCardItem) => void;
  onRemove: (source: string, item: KanbanCardItem) => void;
}

export const COLUMN_KEY_TODO = "todo";
export const COLUMN_KEY_ONGOING = "ongoing";
export const COLUMN_KEY_DONE = "done";

export const KanbanBoard = ({
  isLoading,
  todoList,
  doneList,
  ongoingList,
  onAdd,
  onRemove,
}: KanbanBoardProp) => {
  const [draggedItem, setDraggedItem] = useState<KanbanCardItem>();
  const [dragSource, setDragSource] = useState<string>("");
  const [dragTarget, setDragTarget] = useState<string>("");

  const handleDrop = () => {
    if (
      !draggedItem ||
      !dragSource ||
      !dragTarget ||
      dragSource === dragTarget
    ) {
      return;
    }
    dragSource && onRemove(dragSource, draggedItem);
    dragTarget && onAdd(dragTarget, draggedItem);
  };

  return (
    <main className="kanban-board">
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
            onAdd={onAdd.bind(null, COLUMN_KEY_TODO)}
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
            onRemove={onRemove}
          />
        </>
      )}
    </main>
  );
};
