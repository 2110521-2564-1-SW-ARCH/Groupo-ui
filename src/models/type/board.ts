export type BoardResult = {
	title: string
	totalGroups: number
	totalMembers: number
	creator: string
	tag: string
	choices: string[]
}

export type BoardItem = {
	boardID: string;
	title: string;
	totalGroups: number;
	totalMembers: number;
	isAssign: boolean;
}