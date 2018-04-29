import {EntityRepository, getConnection, Repository} from "typeorm";
import {DetectableObject} from "../entity/DetectableObject";
import {Detection} from "../entity/Detection";

@EntityRepository(DetectableObject)
export class DetectableObjectRepository  extends Repository<DetectableObject>{

    async findByName(name: string) {
        return await this.findOne({
            name: name
        })

    }
}

