import { useEffect, useState } from "react";
import { useParams } from "react-router";
import GroupBoard from "../../components/GroupBoard";
import { BoardResult } from "../../models/type/board";

import { getBoards, getBoard } from "../../client/GroupingClient";
import { BoardItem } from "../../models/type/board";
import { BoardResponse } from "groupo-shared-service/apiutils/messages";

import "./style.css";
import Chatbox from "../../components/Chatbox";

const MOCK = {
  boardID: "12",
  name: "Software Architecture",
  totalGroup: 3,
  totalMember: 12,
  owner: "Sorn",
  isAssign: false,
  members: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
};

// const [board,setBoard] = useState({});

const GroupPage = () => {
  const { id: groupId } = useParams<{ id?: string }>();
  const [groupInfo, setGroupInfo] = useState<BoardResult>();

  useEffect(() => {
    (async () => {
      //TODO: fetch the group info for the given groupId, keep it in groupInfo
      // const gID:string = '7049fc8d-d67d-45fc-a34b-35e55c0203ff';
      const gid: string = groupId!;
      const res = await getBoard(gid);

      // console.log("res =",res);
      setGroupInfo(res);
    })();
    // console.log("groupID =", groupId);
    // console.log("groupInfo =",groupInfo);
  }, [groupId]);

  return (
    <div className="board-container">
      <h1>{groupInfo?.name}</h1>
      <GroupBoard bid={groupId!} />
      <Chatbox
        messages={[
          "Sorn: hey",
          "thong: ha",
          "Sorn: hey",
          "thong: ha",
          "Sorn: hey",
          "thong: ha",
          "Sorn: hey",
          "thong: ha",
          "Sorn: hey",
          "thong: ha",
        ]}
      />
    </div>
  );
};

export default GroupPage;
