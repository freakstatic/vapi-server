import {Between, EntityRepository, LessThan, MoreThan, Repository} from "typeorm";
import {Detection} from "../entity/Detection";

@EntityRepository(Detection)
export class DetectionRepository extends Repository<Detection>
{
 public async get(startDate: Date, endDate: Date): Promise<Detection[]>
 {
  let options = {};
  let hasStartDate=startDate !== undefined && startDate !== null;
  let hasEndDate=endDate !== undefined && endDate !== null;

  if(hasStartDate&&hasEndDate)
  {
   options['date'] = Between(startDate,endDate);
  }
  else if (hasStartDate)
  {
   options['date'] = MoreThan(startDate);
  }
  else if(hasEndDate)
  {
   options['date'] = LessThan(endDate);
  }

  return await this.find(options);
 }
}