import {EntityRepository, Repository, SelectQueryBuilder} from "typeorm";
import {DetectableObject} from "../entity/DetectableObject";
import {DetectionObject} from '../entity/DetectionObject';

@EntityRepository(DetectableObject)
export class DetectableObjectRepository extends Repository<DetectableObject>
{
 public async findByName(name: string)
 {
  return await this.findOne({
   name: name
  });
 }

 public async getTop5(): Promise<DetectableObject[]>
 {
  let dbObjs = null;

  try
  {
   dbObjs = await this.createQueryBuilder('detectable')
    .select(['detectable.id', 'detectable.name', 'detection_object.numberoccurrences'])
    .innerJoin((queryBuilder: SelectQueryBuilder<DetectionObject>) =>
    {
     return queryBuilder
      .select(["COUNT(detection_obj.id) AS 'numberoccurrences'","detection_obj.object_id"])
      .from(DetectionObject,'detection_obj')
      .groupBy('detection_obj.object_id')
    }, 'detection_object', 'detection_object.object_id=detectable.id')
    .orderBy('detection_object.numberoccurrences', 'DESC')
    .limit(5)
    .getMany();
  }
  catch (e)
  {}
  return dbObjs;
 }
}