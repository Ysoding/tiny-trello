import React from "react";

interface KanbanBoardProp {
  children: React.ReactNode;
}

export const KanbanBoard = ({ children }: KanbanBoardProp) => {
  return <main className="kanban-board">{children}</main>;
};
