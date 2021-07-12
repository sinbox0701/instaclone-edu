import client from "../../client";
import {protectedResolver} from "../../User/User.utils";
import { processHashtags } from "../Photo.utils";

export default {
    Mutation: {
        uploadPhoto: protectedResolver(
            async (_,args,{loggedInUser}) => {
                const {file, caption} = args;
                //file은 추후 이미지 업로드로 바꿀 것 잠시 String Type인척
                let hashtagObj = [];
                if(caption){
                    hashtagObj = processHashtags(caption);
                }
                return client.photo.create({
                    data:{
                        file,
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