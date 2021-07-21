import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../User.utils";
import {createWriteStream} from "fs";
import { uploadToS3 } from "../../shared/shared.utils";

export default {
    Mutation:{
        editProfile: protectedResolver(async (_, args,{loggedInUser}) => {
            const {
                firstName,
                lastName,
                username,
                email,
                bio,
                avatar,
                password:newPassword
            } = args;
            let avatarUrl = null;
            if(avatar){
                avatarUrl = await uploadToS3(avatar,loggedInUser.id,"avatars");
            }
            let hashedPassword = null;
            if(newPassword){
                hashedPassword = await bcrypt.hash(newPassword,10);
            }
            const updatedUser = await client.user.update({
                where:{
                    id:loggedInUser.id
                },
                data:{
                    firstName,
                    lastName,
                    username,
                    email,
                    bio,
                    ...(hashedPassword && {password:hashedPassword}),
                    ...(avatarUrl && {avatar:avatarUrl}),
                }
            });
            if(updatedUser.id){
                return {
                    ok:true
                }
            }
            else {
                return {
                    ok:false,
                    error:"업데이트 실패!"
                }
            }
        })
    }
}