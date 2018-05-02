import properties = require('properties');

export class MotionHelper {

    private configs;

    constructor(){


    }


    async loadConfigs(){
        properties.parse ("../motion.conf", { path: true, comments: [";", "#"] }, (error, obj) =>{
            if (error){
                return console.error (error);
            }
            this.configs = obj;
        });
    }

    async editConfig(configName: string, configValue: any){
        if (this.configs[configName] == undefined){
            throw new Error('[MotionHelper] Config not found!');
        }
    }

    async saveConfigs(){

    }
}