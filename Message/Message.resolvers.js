import client from "../client";

export default {
    Room:{
        users:({id})=>client.room.findUnique({where:{id}}).users(),
        messages:({id})=>client.message.findMany({
            where:{
                roomId:id
            }
        }),
        unreadTotal:()=>0 //임의로 설정 한 것
    }
}