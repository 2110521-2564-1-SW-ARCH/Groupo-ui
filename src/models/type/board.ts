export type BoardResult = {
	name: string
	totalGroup: number
	totalMember: number
	owner: string
	isAssign: boolean
	// tag: string
	// choices: string[]
}

export type BoardItem = {
	boardID: string;
	name: string;
	totalGroup: number;
	totalMember: number;
	isAssign: boolean;
}