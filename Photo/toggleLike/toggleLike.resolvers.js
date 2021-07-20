import client from "../../client";
import { protectedResolver } from "../../User/User.utils";

export default {
    Mutation:{
        toggleLike: protectedResolver(async (_,args,{loggedInUser})=>{
            const {id} = args;
            const existPhoto = await client.photo.findUnique({
                where:{
                    id
                }
            });
            if(!existPhoto){
                return {
                    ok:false,
                    error:"사진이 없습니다!"
                };
            }
            const likeWhere = {
                userId_photoId:{
                    userId:loggedInUser.id,
                    photoId:id
                }
            };
            /*
                const like = await client.like.findUnique({
                    where:{
                        userId_photoId:{
                            userId:loggedInUser.id,
                            photoId:id
                        }
                    }
                });
                where절이 반복되서 likeWhere를 만들고 사용
             */
            const like = await client.like.findUnique({
                where:likeWhere
            });
            if(like){
                await client.like.delete({
                    where:likeWhere
                })
            }else {
                await client.like.create({
                    data:{
                        user:{
                            connect:{
                                id:loggedInUser.id
                            }
                        },
                        photo:{
                            connect:{
                                id:existPhoto.id
                            }
                        }
                    }
                });
            }
            return {
                ok:true
            }
        })
    }
}