import { Box, Container, Typography } from "@mui/material";
import { BoardResponse } from "groupo-shared-service/apiutils/messages";
import { useEffect, useState } from "react";
import { getBoards } from "../../client/GroupingClient";
import { BoardItem } from "../../models/type/board";
import BoardListItem from "../BoardListItem";
import { getProfile } from "../../client/AuthClient";

const BoardList = () => {
	const [boards, setBoards] = useState<Array<BoardItem>>([])
	const [userInfo, setUserInfo] = useState<string|undefined>();

	useEffect(() => {
		(async () => {
			const res = await getBoards();
			const boards: Array<BoardItem> = res.map((board: BoardResponse) => {
				return {
					boardID: board.boardID,
					name: board.name,
					totalGroup: board.totalGroups,
					totalMember: board.totalMembers,
					isAssign: board.isAssign,
					owner: board.owner
				}
			})
			setBoards(boards)
			console.log("res =",res);

			const user = getProfile();
    		setUserInfo(user);
		})();
	}, []);

	return (
		<Container component="main" maxWidth="xs">
			<Box sx={{ mt: 3 }}>
				<Typography variant="h5">My boards</Typography>
				<Box display="flex" flexDirection="column" mt={2} gap={1}>
					{boards.map((board: BoardItem) => (
						<BoardListItem board={board} user={userInfo} key={board.boardID}/>
					))}
				</Box>
			</Box>
		</Container>
	);
};

export default BoardList;
