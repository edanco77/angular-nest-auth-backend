import { User } from "./user.entity";


export interface LoginResponse{
    user : User;
    token: string;
}