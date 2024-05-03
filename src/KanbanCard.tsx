import React, { DragEvent, useEffect, useState } from "react";

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
}

export const KanbanCard = ({
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
