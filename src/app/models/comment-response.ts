import { Comment } from './comment';

export interface CommentResponse {
  likedByAuthUser: boolean;
  comment: Comment;
}
