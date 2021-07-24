import { gql } from "apollo-server";

export default gql`
    type sendMessageResult{
        ok:Boolean!
        error:String
    }
    type Mutation{
        sendMessage(payload:String!,userId:Int,roomId:Int):sendMessageResult!
    }
`;