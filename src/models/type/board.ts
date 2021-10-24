import { BoardResponse } from "groupo-shared-service/apiutils/messages"


export type BoardResult = BoardResponse

export type BoardItem = {
	boardID: string;
	name: string;
	totalGroup: number;
	totalMember: number;
	isAssign: boolean;
}