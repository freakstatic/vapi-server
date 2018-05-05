import properties = require('properties');
import {ConfigObject} from "../class/config-object";

const util = require('util');
const stringifyAsync = util.promisify(properties.stringify);
const parseAsync = util.promisify(properties.parse);

const config = require('../../config.json');
const {spawn} = require('child_process');
const fs = require('fs');

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


    async loadSettings() {
        return new Promise((resolve, reject) => {
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

            }).catch((error) => {
                reject(error);
            })
        });

    }

    private editConfig(config: ConfigObject) {
        if (this._settings[config.name] == undefined) {
            throw new Error('[MotionHelper] Config not found!');
        }
        this._settings[config.name] = config.value;
    }

    async editSettings(settings: ConfigObject[]) {
        settings.forEach((config) => {
            this.editConfig(config);
        });

        await this.saveSettings();
        await this.exitMotion();
        await this.startMotion();

    }

    saveSettings() {
        return new Promise((resolve, reject) => {
            stringifyAsync(this._settings, {
                path: config.motion.config
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

    async startMotion() {
        return new Promise((resolve, reject) => {
            this.motion = spawn('motion', ['-c ', config.motion.config], {
                shell: true
            });

            this.motion.on('error', (err) => {
                console.error('[MotionHelper] Failed to start Motion');
                reject(err);
            });

            this.motion.on('data', (data) => {
                if (config.debugMode) {
                    console.log('[Motion] stdout: ' + data);
                }

            });
            let started = false;
            this.motion.stderr.on('data', (data) => {
                if (config.debugMode) {
                    console.log('[Motion] stderr: ' + data);
                }
                if (!started) {
                    let text = Buffer.from(data).toString();
                    let nrOfClines = text.split('\n').length;

                    if (nrOfClines > 2) {
                        console.log('[MotionHelper] [startMotion] detected more output from Motion than expected, probably error found');
                        this.exitMotion();
                        reject();
                        return;
                    }

                    started = true;
                    resolve();
                }
            });

        });

    }

    exitMotion() {
        return new Promise((resolve) => {
            this.motion.on('exit', (code, signal) => {
                if (config.debugMode) {
                    console.log('[Motion] Closed with signal: ' + signal);
                }
                resolve();
            });
            this.motion.kill('SIGHUP');
        });

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