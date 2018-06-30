export class ErrorObject {
    static readonly EMPTY_USERNAME = 'EMPTY_USERNAME';
    static readonly EMPTY_PASSWORD = 'EMPTY_PASSWORD';
    static readonly INVALID_USERNAME_OR_PASSWORD = 'INVALID_USERNAME_OR_PASSWORD';
    static readonly MOTION_INVALID_SETTINGS = 'MOTION_INVALID_SETTINGS';
    static readonly CANNOT_UPDATE_USER_TOKEN = 'CANNOT_UPDATE_USER_TOKEN';
    static readonly EMPTY_USER_ID = 'EMPTY_ID';
    static readonly EMPTY_TOKEN = 'EMPTY_TOKEN';
    static readonly TIMELAPSE_NO_DETECTIONS = 'TIMELAPSE_NO_DETECTIONS';
    static readonly SUBSCRIPTION_INVALID = 'INVALID_SUBSCRIPTION';
    static readonly INVALID_TIMELAPSES_JOBS = 'INVALID_TIMELAPSES_JOBS';

    private static _errorMessages = {
        EMPTY_USERNAME: 'Empty username',
        EMPTY_PASSWORD: 'Empty password',
        EMPTY_USER_ID: 'Empty user id',
        EMPTY_TOKEN: 'Empty token',
        INVALID_USERNAME_OR_PASSWORD: 'Username and password combination not found',
        INVALID_TOKEN: 'token invalid',
        MOTION_INVALID_SETTINGS: 'Invalid Motion settings',
        CANNOT_UPDATE_USER_TOKEN: 'Cannot update the user token',
        TIMELAPSE_NO_DETECTIONS: 'Any detections found for timelapse',
        INVALID_SUBSCRIPTION: 'Invalid subscription',
        INVALID_TIMELAPSES_JOBS: 'Invalid timelapse jobs'
    };
    static readonly INVALID_TOKEN = 'INVALID_TOKEN';

    private _message: string;
    private _code: string;

    constructor(code: string = '') {
        if (ErrorObject._errorMessages[code]){
            this._message = ErrorObject._errorMessages[code];
            if (!this._message) {
                throw new Error("Invalid error code");
            }
            this._code = code;
        }
    }



    get code(): string {
        return this._code;
    }

    get message(): string {
        return this._message;
    }


    set message(value: string) {
        this._message = value;
    }
}