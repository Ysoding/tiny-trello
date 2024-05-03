import React, { useEffect, useRef, useState } from "react";
import { KanbanCardItem } from "./KanbanCard";
interface NewCardProp {
  onSumbit: (newCard: KanbanCardItem) => void;
}

export const KanbanNewCard = ({ onSumbit }: NewCardProp) => {
  const [title, setTitle] = useState("");
  const inputElem = useRef<HTMLInputElement>(null);
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  };
  const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      const newCard = { title, createTime: new Date().toString() };
      onSumbit(newCard);
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
