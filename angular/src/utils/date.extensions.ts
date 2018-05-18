export {}

declare global
{
 interface Date
 {
  toDateISOString(): string;
 }
}

Date.prototype.toDateISOString = function(): string
{
 return this.getFullYear() +
  '-' + pad(this.getMonth() + 1) +
  '-' + pad(this.getDate());
};

function pad(number)
{
 if (number < 10)
 {
  return '0' + number;
 }
 return number;
}