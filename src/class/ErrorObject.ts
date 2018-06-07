export class ErrorObject {
    private code: string;
    private readonly message: string;

    static errorMessages = {
        EMPTY_USERNAME: 'Empty username',
        EMPTY_PASSWORD: 'Empty password',
     EMPTY_USER_ID: 'Empty user id',
     EMPTY_TOKEN: 'Empty token',
        INVALID_USERNAME_OR_PASSWORD: 'Username and password combination not found',
     INVALID_TOKEN: 'token invalid',
        MOTION_INVALID_SETTINGS: 'Invalid Motion settings',
     CANNOT_UPDATE_USER_TOKEN:'Cannot update the user token'
    };

    static readonly EMPTY_USERNAME = 'EMPTY_USERNAME';
    static readonly EMPTY_PASSWORD = 'EMPTY_PASSWORD';
 static readonly EMPTY_USER_ID = 'EMPTY_ID';
 static readonly EMPTY_TOKEN = 'EMPTY_TOKEN';
    static readonly INVALID_USERNAME_OR_PASSWORD = 'INVALID_USERNAME_OR_PASSWORD';
 static readonly INVALID_TOKEN = 'INVALID_TOKEN';
    static readonly MOTION_INVALID_SETTINGS = 'MOTION_INVALID_SETTINGS';
 static readonly CANNOT_UPDATE_USER_TOKEN='CANNOT_UPDATE_USER_TOKEN';
 static readonly TIMELAPSE_NO_DETECTIONS = 'TIMELAPSE_NO_DETECTIONS';

 constructor(code: string) {
        this.message = ErrorObject.errorMessages[code];
        if (!this.message){
            throw new Error("Invalid error code");
        }
        this.code = code;
    }
}