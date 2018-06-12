export class DetectableObject
{
 id: number;
 name: string;
 
 public static Intance(data: any): DetectableObject
 {
  if (!(data.hasOwnProperty('id') && data.hasOwnProperty('name')))
  {
   return null
  }
  
  const detectableObject=new DetectableObject();
  detectableObject.id=data.id;
  detectableObject.name=data.name;
  return detectableObject;
 }
}