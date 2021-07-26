import { gql } from "apollo-server";

export default gql`
    type ReadMessageResult{
        ok:Boolean!
        error:String
    }
    type Mutation {
        readMessage(id:Int!):ReadMessageResult!
    }
`;