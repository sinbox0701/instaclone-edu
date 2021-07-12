import client from "../../client";

export default {
    Query:{
        searchPhoto:async(_,args) => {
            const {keyword} = args;
            return client.photo.findMany({
                where:{
                    caption:{
                        startsWith:keyword
                    }
                }
            });
        }
    }
}
//검색하는 단어로 시작되는 caption이 있는 photo 검색