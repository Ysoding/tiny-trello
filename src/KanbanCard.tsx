import React, { DragEvent, useContext, useEffect, useState } from "react";
import AdminContext from "./context/AdminContext";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const UPDATE_INTERVAL = MINUTE;

export interface KanbanCardItem {
  title: string;
  createTime: string;
}

export interface KanbanCardProp {
  item: KanbanCardItem;
  onDragStart: React.DragEventHandler<HTMLLIElement>;
  onRemove?: (item: KanbanCardItem) => void;
}

export const KanbanCard = ({ item, onDragStart, onRemove }: KanbanCardProp) => {
  const [dispalyTime, setDisplayTime] = useState(item.createTime);

  useEffect(() => {
    const updateDisplayTime = () => {
      const createTimeDate = new Date(item.createTime);
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
  }, [item.createTime]);

  const handleDragStart = (evt: DragEvent<HTMLLIElement>) => {
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("text/plain", item.title);
    onDragStart && onDragStart(evt);
  };

  const isAdmin = useContext(AdminContext);

  return (
    <li className="kanban-card" draggable onDragStart={handleDragStart}>
      <div className="kanban-card-title">{item.title}</div>
      <div className="kanban-card-status" title={item.createTime}>
        {dispalyTime}{" "}
        {isAdmin && onRemove && (
          <button onClick={() => onRemove(item)}>X</button>
        )}{" "}
      </div>
    </li>
  );
};
