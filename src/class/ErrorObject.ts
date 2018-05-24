export class ErrorObject
{
 static errorMessages = {
  EMPTY_USERNAME: 'Empty username',
  EMPTY_PASSWORD: 'Empty password',
  EMPTY_USER_ID: 'Empty user id',
  INVALID_USERNAME_OR_PASSWORD: 'Username and password combination not found',
  MOTION_INVALID_SETTINGS: 'Invalid Motion settings'
 };
 static readonly EMPTY_USERNAME = 'EMPTY_USERNAME';
 static readonly EMPTY_PASSWORD = 'EMPTY_PASSWORD';
 static readonly EMPTY_USER_ID = 'EMPTY_ID';
 static readonly INVALID_USERNAME_OR_PASSWORD = 'INVALID_USERNAME_OR_PASSWORD';
 static readonly MOTION_INVALID_SETTINGS = 'MOTION_INVALID_SETTINGS';
 private code: string;
 private readonly message: string;

 constructor(code: string)
 {
  this.message = ErrorObject.errorMessages[code];
  if (!this.message)
  {
   throw new Error("Invalid error code");
  }
  this.code = code;
 }
}