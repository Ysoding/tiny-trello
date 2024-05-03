import React from "react";

export interface KanbanColumnProp {
  className: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  setIsDragSource?: (value: boolean) => void;
  setIsDragTarget?: (value: boolean) => void;
  onDrop?: React.DragEventHandler<HTMLElement>;
}

export const KanbanColumn = ({
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
