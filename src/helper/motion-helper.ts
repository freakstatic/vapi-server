import properties = require('properties');

const util = require('util');
const stringifyAsync = util.promisify(properties.stringify);
const parseAsync = util.promisify(properties.parse);

const config = require('../../config.json');
const {spawn} = require('child_process');
const fs = require('fs');

export class MotionHelper {

    private configs;
    private motion;

    constructor() {
        this.init()
    }

    async init() {
        await this.loadConfigs();
        await this.startMotion();
    }


    async loadConfigs() {
        return new Promise((resolve, reject) => {
            if (!fs.exists(config.motion.config)){
                console.log('[MotionHelper] Config file not found, loading default one');
                fs.copyFileSync(config.motion.defaultConfig, config.motion.config);
            }

            parseAsync(config.motion.config, {path: true, comments: [';', '#']}).then((obj) => {
                this.configs = obj;
                if (config.debugMode) {
                    console.log('[MotionHelper] Configs loaded');
                }
                resolve();

            }).catch((error) => {
                reject(error);
            })
        });

    }

    private editConfig(config: any) {
        if (this.configs[config.mame] == undefined) {
            throw new Error('[MotionHelper] Config not found!');
        }
        this.configs[config.mame] = config.value;
    }

    async editConfigs(configs: any) {
        configs.forEach((config) => {
            this.editConfig(config);
        });

        await this.saveConfigs();
        await this.exitMotion();
        await this.startMotion();
    }

    async saveConfigs() {
        return new Promise((resolve, reject) => {
            stringifyAsync(this.configs, {
                path: config.motionConfigLocation
            }).then(() => {
                if (config.debugMode) {
                    console.log('[MotionHelper] Configs saved');
                }
                resolve();
            }).catch((error) => {
                if (error) {
                    reject('[MotionHelper]' + error);
                }
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
                    started = true;
                    resolve();
                }
            });

        });

    }

    async exitMotion() {
        return new Promise((resolve) => {
            this.motion.on('close', (code, signal) => {
                if (config.debugMode) {
                    console.log('[Motion] Closed with signal: ' + signal);
                }
                resolve();
            });
            this.motion.kill();
        });

    }
}