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
import { Add as AddIcon, AdjustOutlined, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { Button, IconButton, Box,Grid,Typography,Dialog, Tooltip } from "@mui/material";
import AddGroupModal from "../AddGroupModal";
import EditGroupModal from "../EditGroupModal";
import { useHistory } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

type Column = 
  { groupID: string|null, 
    members: Array<string>,
    membersObj: Array<memberObject>,
    tags: Array<string>,
    name: string,
    capacity: number,
  }

type memberObject = 
  {
    email: string,
    tags: Array<string>
  }

const onDragEnd = (result: DropResult, columns: any, setColumns: any, socketResponse: boolean, socket:Socket<DefaultEventsMap, DefaultEventsMap>) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.membersObj];
    const destItems = [...destColumn.membersObj];

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
        membersObj: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        membersObj: destItems,
      },
    });
    // TODO: send an event to the server regarding the change in group
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.membersObj];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        membersObj: copiedItems,
      },
    });
  }
};

const renderTooltip = (tags:Array<string>) => {
  let tooltip = "";
  tags.forEach((tag) => {
    tooltip = tooltip+tag+", ";
  })
  if (tooltip=="") {tooltip = "No tag"}
  else {tooltip = tooltip.substr(0, tooltip.length - 2)}
  
  return tooltip;
}

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

const socketDeleteBoard = async (socket: Socket<DefaultEventsMap, DefaultEventsMap>, deleteBoardId:string, goToBoardList:any) => {
  socket.emit("board","delete",deleteBoardId);
}

const socketLeaveBoard = async (socket: Socket<DefaultEventsMap, DefaultEventsMap>, leaveBoardId:string, goToBoardList:any) => {
  socket.emit("board","leave",leaveBoardId);
  setTimeout(() => {
    goToBoardList()
  },500)
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
  const [groupNameInAction,setGroupNameInAction] = useState<string | null>("");
  const [groupIdInAction, setGroupIdInAction] = useState<string | null>("")
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleteBoardModalOpen, setDeleteBoardModalOpen] = useState(false);
  const [isLeaveModalOpen, setLeaveModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<string | undefined>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const [tags, setTags] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const history = useHistory();

  function goToBoardList() {
    history.push("/");
  }

  async function refreshBoard() {
    //TODO: fetch the group info for the given groupId, keep it in groupInfo
    const gid:string = bid!;
    const res = await getBoard(gid);
    const noGroup:Column = { 
      groupID: null, 
      members: res.unAssignedMember,
      membersObj: res.unAssignedMemberObj,
      tags: [],
      name: "No Group",
      capacity: 0,
    }
    setColumns([...res.groups,noGroup]);
    console.log(res)
    
    const user = getProfile();
    setUserInfo(user);
    setBoardOwner(res.owner);

    // const allTags = new Set();

    // for (let group of res.groups) {
    //   for (let tag of group.tags) {
    //     allTags.add(tag);
    //   }
    // }

    const allTags: string[] = res.tags.map((x: any) => x.name);

    setTags(allTags)
    let memberTags = await getMemberTags(gid);
    let memberTagsFiltered = memberTags.filter(x => allTags.indexOf(x) != -1);
    setActiveTags(memberTagsFiltered)
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

      sock.on("board",(action, boardID,email) => {
        console.log("action =",action,"boardID =",boardID,"email =",email);
        if (action == "deleteBoard"){
          goToBoardList()
          // alert("The board has been deleted")
        }
        else {
          refreshBoard()
        }
      })

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
    setTimeout(() => {
      refreshBoard();
    },300)
  }

  function autogroup() {
    socket?.emit("autogroup", bid!);
  }

  return (
    <Fragment>
      {!isNotBoardOwner(boardOwner, userInfo) && (
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            marginBottom: 10
          }}
        >
          <Button type="submit" variant="contained" onClick={() => {setDeleteBoardModalOpen(true)}}>
            <DeleteIcon />delete board
          </Button>
        </div>
      )}
      {isNotBoardOwner(boardOwner, userInfo) && (
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            marginBottom: 10
          }}
        >
          <Button type="submit" variant="contained" onClick={() => {setLeaveModalOpen(true)}}>
            <ExitToAppIcon />leave board
          </Button>
        </div>
      )}
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
                      <Grid container columnSpacing={{ xs: 2 }}>
                        <Grid item xs={8}>
                          <Typography component="h4" variant="h5">
                            {column.name}
                          </Typography>

                          <div>{(column.tags ?? []).join(", ")}</div>
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            color="primary"
                            size="small"
                            disabled={isNotBoardOwner(boardOwner, userInfo)}
                            onClick={() => {
                              setGroupIdInAction(column.groupID);
                              setGroupNameInAction(column.name);
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
                            disabled={isNotBoardOwner(boardOwner, userInfo)}
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
                      <Grid container direction={"row"}>
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
                            {column.membersObj.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.email}
                                  draggableId={`${item.email}`}
                                  index={index}
                                  isDragDisabled={
                                    // TODO: check if we have right to change group for this person
                                    checkDragDisable(userInfo, item.email)
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
                                        <Tooltip title={renderTooltip(item.tags)}>
                                          <IconButton color="inherit">
                                            <LocalOfferIcon />
                                          </IconButton>
                                        </Tooltip>
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            marginTop: 24,
            marginBottom: 12,
            fontWeight: "bold",
          }}
        >
          Your favorite tags for auto grouping
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginRight: 36,
            width: "calc(100% - 300px)",
          }}
        >
          {tags.map((tag) => (
            <div
              style={{
                padding: 12,
                paddingLeft: 24,
                paddingRight: 24,
                marginRight: 12,
                marginBottom: 12,
                borderRadius: 48,
                backgroundColor: "#1a76d2",
                opacity: activeTags.indexOf(tag) == -1 ? 0.6 : 1,
                color: "white",
              }}
              key={tag}
              onClick={() => toggleActiveTag(tag)}
            >
              {tag}
            </div>
          ))}
        </div>

        {!isNotBoardOwner(boardOwner, userInfo) && (
          <div
            style={{
              display: "flex",
            }}
          >
            <Button
              startIcon={<AddIcon />}
              variant="text"
              sx={{ mt: 1, mb: 1 }}
              onClick={() => setAddModalOpen(true)}
            >
              Add group
            </Button>

            <Button
              startIcon={<AdjustOutlined />}
              variant="text"
              sx={{ mt: 1, mb: 1 }}
              onClick={() => autogroup()}
            >
              Auto group
            </Button>
          </div>
        )}
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
        onEditGroup={(
          editContent: string,
          tags: string[],
          capacity: number,
        ) => {
          socket &&
            socketEditGroup(
              socket,
              groupIdInAction,
              editContent,
              tags,
              capacity,
              refreshBoard
            );
        }}
        onClose={() => setEditModalOpen(false)}
        preName={groupNameInAction}
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
              groupIdInAction &&
                socket &&
                socketDeleteGroup(socket, groupIdInAction, refreshBoard);
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
      <Dialog
        open={isDeleteBoardModalOpen}
        onClose={() => {
          setDeleteBoardModalOpen(false);
        }}
      >
        <Box m={2} display="flex" gap={1}>
          <h2>Do you want to delete this board?</h2>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              bid &&
              socket &&
              socketDeleteBoard(socket, bid, goToBoardList);
              setDeleteBoardModalOpen(false);
            }}
          >
            Yes
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              setDeleteBoardModalOpen(false);
            }}
          >
            No
          </Button>
        </Box>
      </Dialog>
      <Dialog
        open={isLeaveModalOpen}
        onClose={() => {
          setLeaveModalOpen(false);
        }}
      >
        <Box m={2} display="flex" gap={1}>
          <h2>Confirm leaving?</h2>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              bid &&
              socket &&
              socketLeaveBoard(socket, bid, goToBoardList);
              setLeaveModalOpen(false);
            }}
          >
            Yes
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={() => {
              setDeleteBoardModalOpen(false);
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
