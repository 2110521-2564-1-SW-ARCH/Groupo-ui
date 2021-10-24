import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import socketIOClient from "socket.io-client";
import socket from "socket.io";
import { getTokenHeader, groupingServiceHostPrefix } from "../../client/index"
import { BoardResult } from "../../models/type/board";
import { getBoards,getBoard } from "../../client/GroupingClient";
import { getProfile } from "../../client/AuthClient";

type Column = 
  { groupID: string, 
    members: Array<member>,
    name: string
  }

type member = {
  email : string,
  boardID: string,
  groupID: string
}

const itemsFromBackend = [
  { id: 1, email: "a@gmail.com", content: "Sornram 1" },
  { id: 2, email: "b@gmail.com", content: "Sornram 2" },
  { id: 3, email: "c@gmail.com", content: "Sornram 3" },
  { id: 4, email: "d@gmail.com", content: "Sornram 4" },
  { id: 5, email: "e@gmail.com", content: "Sornram 5" },
];

const groupsArrayMock = [
  { groupID: "1", 
    members: [
      { email: "a@gmail.com",
        boardID: "",
        groupID: "1"
      },
      { email: "b@gmail.com",
        boardID: "",
        groupID: "1"
      }
    ],
    name: "group1"
  },
  { groupID: "2", 
    members: [
      { email: "c@gmail.com",
        boardID: "",
        groupID: "2"
      }
    ],
    name: "group2"
  },
]

const groupInitial = [
  {
    groupID: "0", 
    members: [
    { email: "",
      boardID: "",
      groupID: ""
    }
    ],
    name: "No group"
  }
];

const columnsFromBackend = {
  1: {
    name: "Ungrouped",
    groupID:"",
    items: itemsFromBackend,
  },
  2: {
    name: "Group-1",
    groupID:"",
    items: [],
  },
  3: {
    name: "Group-2",
    groupID:"",
    items: [],
  },
  4: {
    name: "Group-3",
    groupID:"",
    items: [],
  }
};

const onDragEnd = (result: DropResult, columns: any, setColumns: any, boardID: string|undefined) => {
  if (!result.destination) return;
  const { source, destination } = result;
  console.log("result =",result);
  console.log("column =",columns);
  console.log("source =",source," destination =",destination);

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.members];
    const destItems = [...destColumn.members];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        members: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        members: destItems,
      },
    });

    // TODO: send an event to the server regarding the change in group
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.members];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        members: copiedItems,
      },
    });
  }
};

// const renderColumn = ( groupsArray : any) => {
//   return Object.assign({},groupsArray);
// }

const socketConnect = async (boardID: string|undefined, destinationGroup:string) => {
  const header = await getTokenHeader()
  console.log("header =",header);

  //const bdid = "560c9bb3-2e71-48ec-a285-4a539e60602b"
  const socket = socketIOClient("http://localhost:8081/?boardID="+boardID+"&token="+header.headers["Authorization"]);
  
  socket.on("transit",(email,groupID) => {
    console.log("email =",email," groupID =",groupID);
  });

  //const gid = "11b0205b-48da-455d-81d1-9ed0d64f7c92"
  socket.emit("transit", destinationGroup);
}

const checkDragDisable = (user:string | undefined, checkEmail:string) => {
  if (user == checkEmail) {return false;}
  else {return true;}
}

function GroupBoard({bid}:{bid:string | undefined}) {
  // const [columns, setColumns] = useState(columnsFromBackend);
  const [groupInfo, setGroupInfo] = useState();
  const [boardID, setBoardID] = useState<string | undefined>(); 
  const [userInfo, setUserInfo] = useState<string | undefined>();
  const [columns, setColumns] = useState<Column[]>([]);

  // const fetchedColumns = props.props.groups;

  // useEffect(() => {
  //   // TODO: fetch the initial (at start) board state, keep it in columns

  //   //const fetchedColumns = groupsArrayMock;
  //   // const fetchedColumns = props.props.groups;
  //   // console.log("fetchedColumns =",fetchedColumns);
  //   console.log('columns', column)
  //   setColumns(column);

  //   // start socket connection
  //   // socketConnect("hello");
  // }, [column]);
  useEffect(() => {
    (async () => {
      //TODO: fetch the group info for the given groupId, keep it in groupInfo
      // const gID:string = '7049fc8d-d67d-45fc-a34b-35e55c0203ff';
      const gid:string = bid!;
      const res = await getBoard(gid);
      console.log("group board =",res);
      setGroupInfo(res);
      setColumns(res.groups);
      setBoardID(res.boardID);

      const user = await getProfile();
      console.log("user =",user);
      setUserInfo(user);
    })();
    console.log("groupboard groupID =", bid);
    console.log("groupInfo =",groupInfo);

    socketConnect(boardID,"11b0205b-48da-455d-81d1-9ed0d64f7c92");
  }, [bid]);
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
        onDragEnd={(result) => onDragEnd(result, columns, setColumns, boardID)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          // console.log("column =",column);
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              key={columnId}
              // key={columnId}
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
                        {column.members.map((item, index) => {
                          return (
                            <Draggable
                              key={item.email}
                              draggableId={`${item.email}`}
                              index={index}
                              isDragDisabled={
                                // TODO: check if we have right to change group for this person
                                // ex. item.id !== owner.id
                                checkDragDisable(userInfo,item.email)
                                // false
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
                                    {item.email}
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
