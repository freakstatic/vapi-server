import {EntityRepository, getConnection, Repository} from "typeorm";
import {Detection} from "../entity/Detection";
import {DetectionObject} from "../entity/DetectionObject";

@EntityRepository(Detection)
export class DetectionRepository extends Repository<Detection>{

 

}