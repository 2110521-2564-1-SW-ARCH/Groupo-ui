import React, { Fragment, useEffect, useState } from "react";
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
import { getBoards,getBoard, getMemberTags, updateMemberTags } from "../../client/GroupingClient";
import { getProfile } from "../../client/AuthClient";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { Button, IconButton, Box,Grid,Typography,Dialog } from "@mui/material";
import AddGroupModal from "../AddGroupModal";
import EditGroupModal from "../EditGroupModal";

type Column = 
  { groupID: string|null, 
    members: Array<string>,
    tags: Array<string>,
    name: string,
    capacity: number,
  }

const onDragEnd = (result: DropResult, columns: any, setColumns: any, socketResponse: boolean, socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.members];
    const destItems = [...destColumn.members];

    //send socket destination 
    if (!socketResponse){
      socketSend(socket, destColumn.groupID, destination.index);
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

const socketSend = async (socket: Socket<DefaultEventsMap, DefaultEventsMap>, destinationGroup:string|null, position:number) => {
  socket.emit("transit", destinationGroup,position);
}

const socketAddGroup = async (socket: Socket<DefaultEventsMap, DefaultEventsMap>, newGroupName:string,refreshBoard:any) => {
  socket.emit("group","create","", {name:newGroupName, description:null});
}

const socketDeleteGroup = async (socket: Socket<DefaultEventsMap, DefaultEventsMap>, deleteGroupId:string, refreshBoard:any) => {
  socket.emit("group","delete",deleteGroupId);
}

const socketEditGroup = async (socket: Socket<DefaultEventsMap, DefaultEventsMap>, editGroupId:string|null, editContent:string, tags: string[], capacity: number, refreshBoard:any) => {
  socket.emit("group","update",editGroupId, {name:editContent,description:null,tags,capacity});
}

const checkDragDisable = (user:string | undefined, checkEmail:string) => {
  if (user?.toLowerCase() == checkEmail.toLowerCase()) {return false;}
  else {return true;}
}

const isNotBoardOwner = (boardOwner:string | undefined, user:string | undefined) => {
  if (boardOwner?.toLowerCase() == user?.toLowerCase()) {return false;}
  else {return true;}
}

function GroupBoard({bid}:{bid:string | undefined}) {
  const [boardOwner, setBoardOwner] = useState<string | undefined>()
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [groupIdInAction, setGroupIdInAction] = useState<string | null>("")
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<string | undefined>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const [tags, setTags] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  async function refreshBoard() {
    //TODO: fetch the group info for the given groupId, keep it in groupInfo
    const gid:string = bid!;
    const res = await getBoard(gid);
    const noGroup:Column = { 
      groupID: null, 
      members: res.unAssignedMember,
      tags: [],
      name: "No Group",
      capacity: 0,
    }
    setColumns([...res.groups,noGroup]);

    const allTags = new Set();

    for (let group of res.groups) {
      for (let tag of group.tags) {
        allTags.add(tag);
      }
    }

    setTags([...allTags] as string[])
    setActiveTags(await getMemberTags(gid))
    
    const user = getProfile();
    setUserInfo(user);
    setBoardOwner(res.owner);
  }
  
  useEffect(() =>{
    (async () => {
      const header = await getTokenHeader()
      const sock = socketIOClient(`${process.env.REACT_APP_WEBSOCKET_HOST}/?boardID=${bid}&token=${header.headers["Authorization"].replace("Bearer ","")}`);
      
      sock.on("autogroup",() => {
        refreshBoard();
      });

      sock.on("membertag",() => {
        refreshBoard();
      });

      sock.on("transit",(email,groupID,index) => {
        console.log("email =",email," groupID =",groupID, " position =",index);
        refreshBoard();
      });

      sock.on("group",(action,groupID,groupInfo) => {
        console.log("action =",action,"groupId =",groupID,"groupInfo =",groupInfo)
        refreshBoard();
      });

      sock.on("join",(email,groupID) => {
        console.log("email =",email);
        refreshBoard();
      });

      setSocket(sock);

    })();
  },[])

  useEffect(() => {
    refreshBoard();
  }, [bid]);

  function toggleActiveTag(tag: string) {
    let tagIndex = activeTags.indexOf(tag)
    let newActiveTags = [...activeTags];

    if (tagIndex == -1) {
      newActiveTags.push(tag);
    } else {
      newActiveTags.splice(tagIndex, 1);
    }

    updateMemberTags(bid!, newActiveTags);
    setActiveTags(newActiveTags);
  }

  return (
    <Fragment>
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
          onDragEnd={(result) =>
            socket && onDragEnd(result, columns, setColumns, false, socket)
          }
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <Fragment>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  key={columnId}
                >
                  {column.groupID && (
                    <Box>
                      <Grid container columnSpacing={{ xs: 2}}>
                        <Grid item xs={8}>
                          <Typography component="h4" variant="h5">
                            {column.name}
                          </Typography>

                          <div>{(column.tags ?? []).join(', ')}</div>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            color="primary"
                            size="small"
                            disabled={isNotBoardOwner(boardOwner,userInfo)}
                            onClick={() => {
                              setGroupIdInAction(column.groupID);
                              setEditModalOpen(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            color="primary"
                            size="small"
                            disabled={isNotBoardOwner(boardOwner,userInfo)}
                            onClick={() => {
                              setGroupIdInAction(column.groupID);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  {!column.groupID && (
                    <Box>
                      <Grid container direction={'row'}>
                        <Grid item xs={12}>
                          <Typography component="h4" variant="h5">
                            {column.name}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
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
                                    checkDragDisable(userInfo, item)
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
              </Fragment>
            );
          })}
        </DragDropContext>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
      }}>
        <div
          style={{
            marginTop: 24,
            marginBottom: 12,
            fontWeight: "bold",
          }}
        >
          Your favorite tags for auto grouping
        </div>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          marginRight: 36,
          width: "calc(100% - 300px)",
        }}>
          {tags.map(tag => (
            <div 
              style={{
                padding: 12,
                paddingLeft: 24,
                paddingRight: 24,
                marginRight: 12,
                marginBottom: 12,
                borderRadius: 48,
                backgroundColor: '#1a76d2',
                opacity: activeTags.indexOf(tag) == -1 ? 0.6 : 1,
                color: 'white',
              }}
              key={tag}
              onClick={() => toggleActiveTag(tag)}
            >
              {tag}
            </div>
          ))}
        </div>

        {!isNotBoardOwner(boardOwner,userInfo) &&
          <div style={{
            display: "flex"
          }}>
            <Button
              startIcon={<AddIcon />}
              variant="text"
              sx={{ mt: 1, mb: 1 }}
              onClick={() => setAddModalOpen(true)}
            >
              Add group
            </Button>

            <Button
              startIcon={<AddIcon />}
              variant="text"
              sx={{ mt: 1, mb: 1 }}
              onClick={() => setAddModalOpen(true)}
            >
              Auto group
            </Button>
          </div>
        }
      </div>
      <AddGroupModal
        isOpen={isAddModalOpen}
        onAddGroup={(newGroupName: string) => {
          socket && socketAddGroup(socket, newGroupName, refreshBoard);
        }}
        onClose={() => setAddModalOpen(false)}
      />
      <EditGroupModal
        isOpen={isEditModalOpen}
        onEditGroup={(editContent: string, tags: string[], capacity: number) => {
          socket &&
            socketEditGroup(socket, groupIdInAction, editContent, tags, capacity, refreshBoard);
        }}
        onClose={() => setEditModalOpen(false)}
      />
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
      >
        <Box m={2} display="flex" gap={1}>
          <h2>Confirm deletion?</h2>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              groupIdInAction && socket && socketDeleteGroup(socket, groupIdInAction, refreshBoard);
              setDeleteModalOpen(false);
            }}
          >
            Yes
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              setDeleteModalOpen(false);
            }}
          >
            No
          </Button>
        </Box>
      </Dialog>
    </Fragment>
  );
}

export default GroupBoard;
