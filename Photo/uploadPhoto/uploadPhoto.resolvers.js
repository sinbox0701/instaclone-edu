import client from "../../client";
import { uploadToS3 } from "../../shared/shared.utils";
import {protectedResolver} from "../../User/User.utils";
import { processHashtags } from "../Photo.utils";

export default {
    Mutation: {
        uploadPhoto: protectedResolver(
            async (_,args,{loggedInUser}) => {
                const {file, caption} = args;
                const fileUrl = await uploadToS3(file,loggedInUser.id,"uploads");
                let hashtagObj = [];
                if(caption){
                    hashtagObj = processHashtags(caption);
                }
                return client.photo.create({
                    data:{
                        file:fileUrl,
                        caption,
                        user:{
                            connect:{
                                id:loggedInUser.id
                            }
                        },
                        ...(hashtagObj.length > 0 && {hashtags:{connectOrCreate:hashtagObj}})//hastag가 처음 만들어지는 거라면 생성 있는거라면 있는 곳에 연결
                    }
                });
            }
        )
    }
};