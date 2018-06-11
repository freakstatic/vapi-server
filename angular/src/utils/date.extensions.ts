export {}

declare global
{
 interface Date
 {
  toDateISOString(): string,
  getDayName(): string
 }
}

Date.prototype.toDateISOString = function (): string
{
 return this.getFullYear() +
  '-' + pad(this.getMonth() + 1) +
  '-' + pad(this.getDate());
};

Date.prototype.getDayName = function (): string
{
 const weekday = new Array(7);
 weekday[0] = 'Sunday';
 weekday[1] = 'Monday';
 weekday[2] = 'Tuesday';
 weekday[3] = 'Wednesday';
 weekday[4] = 'Thursday';
 weekday[5] = 'Friday';
 weekday[6] = 'Saturday';

 return weekday[this.getDay()];
};

function pad(number)
{
 if (number < 10)
 {
  return '0' + number;
 }
 return number;
}
