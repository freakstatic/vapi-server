import properties = require('properties');
import {ConfigObject} from "../class/ConfigObject";
import {ChildProcess} from "child_process";
import {MotionSettingsError} from "../exception/MotionSettingsError";

const util = require('util');
const stringifyAsync = util.promisify(properties.stringify);
const parseAsync = util.promisify(properties.parse);

const config = require('../../config.json');
const {spawn} = require('child_process');
const fs = require('fs');

const clone = require('clone');

export class MotionHelper {

    private _settings;
    private motion;

    constructor() {
        this.init()
    }

    async init() {
        await this.loadSettings();
        await this.startMotion();
    }


    loadSettings() {
        return new Promise((resolve) => {
            if (!fs.existsSync(__dirname + '/../../' + config.motion.config)) {
                console.log('[MotionHelper] Config file not found, loading default one');
                fs.copyFileSync(config.motion.defaultConfig, config.motion.config);
            }

            parseAsync(config.motion.config, {path: true, comments: [';', '#']}).then((obj) => {
                this._settings = obj;
                if (config.debugMode) {
                    console.log('[MotionHelper] Configs loaded');
                }
                resolve();
            })
        });

    }

    private editConfig(settings, config: ConfigObject) {
        if (settings[config.name] == undefined) {
            throw new Error('[MotionHelper] Config not found!');
        }
        settings[config.name] = config.value;
    }

    async editSettings(settings: ConfigObject[]) {
        if (await this.validSettings(settings)) {
            for (let config of settings) {
                this.editConfig(this._settings, config);
            }
            await this.saveSettings(this._settings);
            if (this.motion) {
                this.stopMotion();
            }
            await this.startMotion();
        } else {
            throw new MotionSettingsError();
        }
    }

    saveSettings(settings, filePath ?: string) {
        if (filePath == undefined) {
            filePath = config.motion.config;
        }

        return new Promise((resolve, reject) => {
            stringifyAsync(settings, {
                path: filePath
            }).then(() => {
                if (config.debugMode) {
                    console.log('[MotionHelper] Configs saved');
                }
                resolve();
            }).catch((error) => {
                if (error) {
                    console.error('[MotionHelper]' + error);
                }
                reject(error);
            });
        });
    }

    async validSettings(newSettings: ConfigObject[]) {
        let allSettings = clone(this._settings);
        for (let config of newSettings) {
            this.editConfig(allSettings, config);
        }

        let filePath = 'motion/temp.conf';
        await this.saveSettings(allSettings, filePath);

        let testMotion = spawn('motion', ['-c ', filePath], {
            shell: true,
            detached: true
        });

        let hasErrors = await this.hasErrors(testMotion);
        if (hasErrors) {
            MotionHelper.clearTestMotion(filePath);
            return false;
        } else {
            MotionHelper.clearTestMotion(filePath);
            process.kill(-testMotion.pid, 'SIGKILL');
            if (config.debugMode) {
                console.log('[MotionHelper] [clearTestMotion] Signal sent to testMotion (' + testMotion.pid + ')');
            }
            return true;
        }

    }

    static clearTestMotion(filePath) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('[MotionHelper] [clearTestMotion] Unable to remove the temp.conf file. ' + err);
            }
        });
    }

    hasErrors(motion: ChildProcess) {
        return new Promise((resolve) => {
            let errorDetect: boolean = false;
            setTimeout(() => {
                resolve(errorDetect);
            }, 1000);

            motion.stderr.on('data', (data) => {
                if (config.debugMode) {
                    console.log('[Motion] stderr: ' + data);
                }

                let text = Buffer.from(data).toString();

                if (text.includes('[ERR]')) {
                    errorDetect = true;
                }
            });
        });

    }

    async startMotion() {
        this.motion = spawn('motion', ['-c ', config.motion.config], {
            shell: true,
            detached: true
        });

        this.motion.on('error', (err) => {
            console.error('[MotionHelper] Failed to start Motion');
            throw new Error(err);
        });

        this.motion.on('data', (data) => {
            if (config.debugMode) {
                console.log('[Motion] stdout: ' + data);
            }

        });
        let hasErrors = await this.hasErrors(this.motion);

        if (hasErrors) {
            this.stopMotion();
            console.log('[MotionHelper] [startMotion] detected error on Motion output, killing it');
            throw new Error('[Motion] [startMotion] errors found on Motion output');
        }
    }


    stopMotion() {
        //  this.motion.kill('SIGKILL');

        try {
            process.kill(-this.motion.pid);
        } catch (e) {
            console.log('[MotionHelper] [stopMotion] trying to kill Motion but is not running')
        }
    }

    get settings() {
        return this._settings;
    }

    async settingsArray() {
        let promises = Object.keys(this._settings).map(async (key) => {
            return new ConfigObject(key, this._settings[key])
        });

        return await Promise.all(promises);

    }
}