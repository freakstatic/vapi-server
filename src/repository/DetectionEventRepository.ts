import {EntityRepository, Repository} from "typeorm";
import {DetectionEvent} from "../entity/DetectionEvent";

@EntityRepository(DetectionEvent)
export class DetectionEventRepository extends Repository<DetectionEvent> {

    async getLast() {
        return await this.createQueryBuilder("detectionEvent")
            .leftJoinAndSelect("detectionEvent.detections", "detections")
            .orderBy('detectionEvent.id', 'DESC')
            .getOne();
    }
}