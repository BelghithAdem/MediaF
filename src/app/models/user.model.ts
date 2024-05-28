export interface UserModel {
    id:number;
    nom: string;
    prenom:string;
    email: string;
    currentCity:string;
    followerCount:number;
    followingCount:number
    password: string;
    photoProfile:string;
    qrCodeUri:string;
  }