import client from "../../client";

export default {
    Query:{
        seeLikes: async (_,args)=>{
            const {id} = args;
            const likes = await client.like.findMany({
                where:{
                    photoId:id
                },
                select:{
                    user:true
                }
            });
            return likes.map((like)=>like.user);
        }
    }
}