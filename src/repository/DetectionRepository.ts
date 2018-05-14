import {Between, EntityRepository, LessThan, MoreThan, Repository} from "typeorm";
import {Detection} from "../entity/Detection";

@EntityRepository(Detection)
export class DetectionRepository extends Repository<Detection>
{
 public async get(startDate: Date, endDate: Date): Promise<Detection[]>
 {
  let options = this.populateOptionDate(startDate, endDate);
  return await this.find(options);
 }

 public async getStats(startDate: Date, endDate: Date): Promise<Number>
 {
  let options = this.populateOptionDate(startDate, endDate);
  let result = await this.createQueryBuilder()
   .select("COUNT(*)", "numberDetections")
   .where(options)
   .getRawOne();
  if (result == null || result.numberDetections < 1)
  {
   return null;
  }
  return result.numberDetections;
 }

 private populateOptionDate(startDate: Date, endDate: Date): Object
 {
  let options = {};
  let hasStartDate = startDate !== undefined && startDate !== null;
  let hasEndDate = endDate !== undefined && endDate !== null;

  if (hasStartDate && hasEndDate)
  {
   options['date'] = Between(startDate, endDate);
  }
  else if (hasStartDate)
  {
   options['date'] = MoreThan(startDate);
  }
  else if (hasEndDate)
  {
   options['date'] = LessThan(endDate);
  }
  return options;
 }
}