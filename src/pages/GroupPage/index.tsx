import { useEffect, useState } from "react";
import { useParams } from "react-router";
import GroupBoard from "../../components/GroupBoard";
import { BoardResult } from "../../models/type/board";

import "./style.css";

const MOCK = {
  boardID: "12",
  name: "Software Architecture",
  totalGroup: 3,
  totalMember: 12,
  owner: "Sorn",
  isAssign: false,
  members: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
};

const GroupPage = () => {
  const { id: groupId } = useParams<{ id?: string }>();
  const [groupInfo, setGroupInfo] = useState<BoardResult>();

  useEffect(() => {
    //TODO: fetch the group info for the given groupId, keep it in groupInfo
    const fetchedGroupInfo = MOCK;

    setGroupInfo(fetchedGroupInfo);
  }, [groupId]);
  return (
    <div className="board-container">
      <h1>{groupInfo?.name}</h1>
      <GroupBoard />
    </div>
  );
};

export default GroupPage;
