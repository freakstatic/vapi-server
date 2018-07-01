export class Group
{
 public id: number;
 public name: string;
 
 public static Instance(data: any): Group
 {
  if (!data.hasOwnProperty('id') || !data.hasOwnProperty('name'))
  {
   return null;
  }
  
  const group=new Group();
  group.id=data.id;
  group.name=data.name;
  return group;
 }
}