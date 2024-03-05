import { PostModel } from "./post";

export interface PostResponse {
    likedByAuthUser: boolean;
    post: PostModel;
}
