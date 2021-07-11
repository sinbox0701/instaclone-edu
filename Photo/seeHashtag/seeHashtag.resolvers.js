import client from "../../client";

export default {
    Query:{
        seeHashtag: async (_,args) => {
            const {hashtag} = args;
            return client.hashtag.findUnique({
                where:{
                    hashtag
                }
            });
        }
    }
}