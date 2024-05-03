import React, { useEffect, useState } from "react";
import { KanbanCard, KanbanCardItem } from "./KanbanCard";
import { KanbanNewCard } from "./KanbanNewCard";
import { COLUMN_KEY_DONE } from "./KanbanBoard";

export interface KanbanColumnProp {
  className: string;
  title: React.ReactNode;
  setDraggedItem?: (item: KanbanCardItem) => void;
  setIsDragSource?: (value: boolean) => void;
  setIsDragTarget?: (value: boolean) => void;
  onDrop?: React.DragEventHandler<HTMLElement>;
  cardList?: KanbanCardItem[];
  canAddNew?: boolean;
  onAdd?: (newCard: KanbanCardItem) => void;
  onRemove?: (target: string, card: KanbanCardItem) => void;
}

export const KanbanColumn = ({
  title,
  className,
  onDrop,
  onAdd,
  onRemove = undefined,
  canAddNew = false,
  setDraggedItem = () => {},
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  cardList = [],
}: KanbanColumnProp) => {
  const combinedClassName = `kanban-column ${className}`;
  const [showAdd, setShowAdd] = useState(false);

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

  const handleSubmit = (newCard: KanbanCardItem) => {
    onAdd && onAdd(newCard);
    setShowAdd(false);
  };

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
      <h2>
        {title}
        {canAddNew && (
          <button
            onClick={() => {
              setShowAdd(true);
            }}
            disabled={showAdd}
          >
            &#8853; 添加新卡片
          </button>
        )}
      </h2>
      <ul>
        {canAddNew && showAdd && <KanbanNewCard onSumbit={handleSubmit} />}
        {cardList.map((props: KanbanCardItem) => (
          <KanbanCard
            onDragStart={() => setDraggedItem(props)}
            key={props.title}
            item={props}
            onRemove={onRemove?.bind(null, COLUMN_KEY_DONE)}
          />
        ))}
      </ul>
    </section>
  );
};
