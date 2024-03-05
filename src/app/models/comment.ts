import { UserModel } from "./user.model";
export interface Comment {
    id: number;
    content: string;
    likeCount: number;
    dateCreated: string;
    dateLastModified: string;
	author: UserModel;
}
