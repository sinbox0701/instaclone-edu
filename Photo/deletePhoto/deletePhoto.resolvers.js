import client from "../../client";
import { protectedResolver } from "../../User/User.utils";

export default {
    Mutation: {
        deletePhoto: protectedResolver(async(_,args,{loggedInUser})=>{
            const {id} = args;
            const photo = await client.photo.findUnique({
                where:{
                    id
                },
                select:{
                    userId:true
                }
            });
            if(!photo){
                return {
                    ok:false,
                    error:"사진을 찾을 수 없습니다!"
                }
            }else {
                await client.photo.delete({
                    where:{
                        id
                    }
                });
                return {
                    ok:true
                }
            }
        })
    }
}