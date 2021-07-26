import client from "../../client";
import { NEW_MESSAGE } from "../../constant";
import pubsub from "../../pubsub";
import { protectedResolver } from "../../User/User.utils";

export default{
    Mutation:{
        sendMessage:protectedResolver(async(_,args,{loggedInUser})=>{
            const {payload,roomId,userId} = args;
            let room = null;
            if(userId){
                const user = await client.user.findUnique({
                    where:{
                        id:userId
                    },
                    select:{
                        id:true
                    }
                });

                if(!user){
                    return{
                        ok:false,
                        error:"사용자가 존재하지 않습니다!"
                    };
                }
                room = await client.room.create({
                    data:{
                        users:{
                            connect:[
                                {
                                    id:userId
                                },
                                {
                                    id:loggedInUser.id
                                }
                            ]
                        }
                    }
                });
            }
            else if(roomId){
                room = await client.room.findUnique({
                    where:{
                        id:roomId
                    },
                    select:{
                        id:true
                    }
                });
                if(!room){
                    return{
                        ok:false,
                        error:"방을 찾을 수 없습니다!"
                    };
                }
            }
            const message = await client.message.create({
                data:{
                    payload,
                    room:{
                        connect:{
                            id:room.id
                        }
                    },
                    user:{
                        connect:{
                            id:loggedInUser.id
                        }
                    }
                }
            });
            pubsub.publish(NEW_MESSAGE,{roomUpdates:{...message}});
            return {
                ok:true
            }
        })
    }
}