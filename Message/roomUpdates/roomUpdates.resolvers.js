import { NEW_MESSAGE } from "../../constant";
import pubsub from "../../pubsub";

export default {
    Subscription:{
        roomUpdates:{
            //subscription 규칙 --> subscription function 사용!
            subscribe: () => pubsub.asyncIterator(NEW_MESSAGE)//listen하는 함수 asyncIterator
        }
    }
}