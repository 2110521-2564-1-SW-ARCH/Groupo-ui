import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

const itemsFromBackend = [
  { id: 1, content: "Sornram 1" },
  { id: 2, content: "Sornram 2" },
  { id: 3, content: "Sornram 3" },
  { id: 4, content: "Sornram 4" },
  { id: 5, content: "Sornram 5" },
];

const columnsFromBackend = {
  [1]: {
    name: "Ungrouped",
    items: itemsFromBackend,
  },
  [2]: {
    name: "Group-1",
    items: [],
  },
  [3]: {
    name: "Group-2",
    items: [],
  },
  [4]: {
    name: "Group-3",
    items: [],
  },
  [5]: {
    name: "Group-4",
    items: [],
  },
  [6]: {
    name: "Group-5",
    items: [],
  },
  [7]: {
    name: "Group-6",
    items: [],
  },
};

const onDragEnd = (result: DropResult, columns: any, setColumns: any) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });

    // TODO: send an event to the server regarding the change in group
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function GroupBoard() {
  const [columns, setColumns] = useState(columnsFromBackend);

  useEffect(() => {
    // TODO: fetch the initial (at start) board state, keep it in columns
    const fetchedColumns = columnsFromBackend;

    setColumns(fetchedColumns);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "start",
        height: "100%",
        width: "100%",
        overflow: "scroll",
      }}
    >
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: 4,
                          width: 250,
                          minHeight: 500,
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={`${item.id}`}
                              index={index}
                              isDragDisabled={
                                // TODO: check if we have right to change group for this person
                                // ex. item.id !== owner.id
                                false
                              }
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#263B4A"
                                        : "#456C86",
                                      color: "white",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default GroupBoard;
