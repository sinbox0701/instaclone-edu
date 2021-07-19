import client from "../../client";
import { protectedResolver } from "../../User/User.utils";

export default {
    Mutation:{
        deleteComment: protectedResolver(async(_,args,{loggedInUser})=>{
            const {id} = args;
            const comment = await client.comment.findUnique({
                where:{
                    id
                },
                select:{
                    userId:true
                }
            });
            if(!comment){
                return {
                    ok:false,
                    error:"댓글이 없습니다!"
                };
            }
            else if(comment.userId !== loggedInUser.id){
                return {
                    ok:false,
                    error:"삭제 권한 없음"
                }
            }
            else {
                await client.comment.delete({
                    where:{
                        id
                    }
                });
                return {
                    ok:false
                };
            }
        })
    }
}