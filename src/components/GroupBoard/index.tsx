import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import socketIOClient, { Socket } from "socket.io-client";
import socket from "socket.io";
import { getTokenHeader, groupingServiceHostPrefix } from "../../client/index"
import { BoardResult } from "../../models/type/board";
import { getBoards,getBoard } from "../../client/GroupingClient";
import { getProfile } from "../../client/AuthClient";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type Column = 
  { groupID: string, 
    members: Array<string>,
    name: string
  }

const itemsFromBackend = [
  { id: 1, email: "a@gmail.com", content: "Sornram 1" },
  { id: 2, email: "b@gmail.com", content: "Sornram 2" },
  { id: 3, email: "c@gmail.com", content: "Sornram 3" },
  { id: 4, email: "d@gmail.com", content: "Sornram 4" },
  { id: 5, email: "e@gmail.com", content: "Sornram 5" },
];

const noGroup = [
  { groupID: undefined, 
    members: [],
    name: "no group"
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

const onDragEnd = (result: DropResult, columns: any, setColumns: any, socketResponse: boolean, socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
  if (!result.destination) return;
  const { source, destination } = result;
  
  console.log("result =",result);
  // console.log("column =",columns);
  // console.log("source =",source," destination =",destination);

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.members];
    const destItems = [...destColumn.members];

    //send socket destination 
    if (!socketResponse){
      console.log("destColumn =",destColumn.groupID);
      socketSend(socket, destColumn.groupID);
    }
    
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

const socketSend = async (socket: Socket<DefaultEventsMap, DefaultEventsMap>, destinationGroup:string) => {
  console.log("destination group =",destinationGroup)
  socket.emit("transit", destinationGroup);
}

const renderDropResult = (email:string, destGroupID:string, columns:Array<Column>) => {
  const src = columns.map(item => item.groupID).indexOf(destGroupID);

  console.log("source =",src);

  const result ={
    combine: null,
    destination: {droppableId: '1', index: 0},
    draggableId: email,
    mode: "FLUID",
    reason: "DROP",
    source: {index: 1, droppableId: '1'},
    type: "DEFAULT",
  }
}

const checkDragDisable = (user:string | undefined, checkEmail:string) => {
  if (user?.toLowerCase() == checkEmail.toLowerCase()) {return false;}
  else {return true;}
}

function GroupBoard({bid}:{bid:string | undefined}) {
  // const [columns, setColumns] = useState(columnsFromBackend);
  const [groupInfo, setGroupInfo] = useState();
  const [userInfo, setUserInfo] = useState<string | undefined>();
  const [columns, setColumns] = useState<Column[]>([]);
  // const [unassignedMember, setUnassignedMember] = useState();
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

  async function refreshBoard() {
    //TODO: fetch the group info for the given groupId, keep it in groupInfo
    const gid:string = bid!;
    const res = await getBoard(gid);
    setGroupInfo(res);
    const noGroup:Column = { 
      groupID: "unassigned", 
      members: res.unAssignedMember,
      name: "No Group"
    }
    setColumns([...res.groups,noGroup]);
    //setColumns(res.groups);
    
    const user = getProfile();
    console.log("user =",user);
    setUserInfo(user);
  }
  
  useEffect(() =>{
    (async () => {
      const header = await getTokenHeader()
      console.log("header =",header);

      const sock = socketIOClient(`${process.env.REACT_APP_WEBSOCKET_HOST}/?boardID=${bid}&token=${header.headers["Authorization"]}`);
      
      sock.on("transit",(email,groupID,index) => {
        console.log("email =",email," groupID =",groupID, " position =",index);
        if (email.toLowerCase() != userInfo?.toLowerCase()){
          renderDropResult(email,groupID,columns)
        }

        refreshBoard();
      });

      sock.on("join",(email,groupID) => {
        console.log("email =",email);
      });

      setSocket(sock);

    })();
  },[])

  useEffect(() => {
    refreshBoard();
    console.log("groupInfo =",groupInfo);
    console.log("columns =",columns);
    // socketReceive(boardID);
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
        onDragEnd={(result) => socket && onDragEnd(result, columns, setColumns,false, socket)}
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
                              key={item}
                              draggableId={`${item}`}
                              index={index}
                              isDragDisabled={
                                // TODO: check if we have right to change group for this person
                                // ex. item.id !== owner.id
                                checkDragDisable(userInfo,item)
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
                                    {item}
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
