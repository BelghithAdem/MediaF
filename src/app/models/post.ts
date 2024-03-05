import { UserModel } from "./user.model";
import { Comment } from "./comment";
export interface PostModel {
    id: number;
    caption: string;
    imageFileName: string;
    videoFileName: string | null;
    likeCount: number;
    liked: boolean; // Déclarer liked comme un booléen
	commentCount: number;
    createdAt: string;
    user: UserModel; // Ajouter la propriété user
    comments: Comment[]; // Ajout de la propriété comments pour stocker les commentaires du post

  }