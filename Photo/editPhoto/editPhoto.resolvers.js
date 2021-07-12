import client from "../../client";
import {protectedResolver} from "../../User/User.utils"
import { processHashtags } from "../Photo.utils";

export default {
    Mutation:{
        editPhoto: protectedResolver(async(_,args,{loggedInUser})=>{
            const {id, caption} = args;
            const oldPhoto = await client.photo.findFirst({
                where:{
                    id,
                    userId:loggedInUser.id
                },
                include:{// include data만 받아옴
                    hashtags:{
                        select:{
                            hashtag:true
                        }
                    }
                }
            });
            if(!oldPhoto){
                return {
                    ok:false,
                    error:"사진이 존재하지 않습니다"
                }
            }
            await client.photo.update({
                where:{
                    id
                },
                data:{
                    caption,
                    hashtags:{
                        disconnect:oldPhoto.hashtags,
                        connectOrCreate:processHashtags(caption)
                    }
                }
            })
            return {
                ok:true
            }
        })
    }
}