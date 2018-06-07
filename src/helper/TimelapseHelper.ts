import {create} from "domain";
import * as util from "util";
import {Socket} from "socket.io";



const ffmpeg = require('fluent-ffmpeg');
const ffmpegOnProgress = require('ffmpeg-on-progress');


const fs = require('fs');
const mkdir = util.promisify(fs.mkdir);
const copyFile = util.promisify(fs.copyFile);
const readdir = util.promisify(fs.readdir);


const path = require('path');
const rmdir = require('rmdir');


export class TimelapseHelper {

    private static readonly TIMELAPSES_FOLDER: string = 'timelapses';
    private static readonly TMP_FOLDER: string = TimelapseHelper.TIMELAPSES_FOLDER + '/tmp';

    static readonly NR_OF_LEADING_ZEROS = 5;

    constructor() {
        TimelapseHelper.createFolders().then(() => {
         //   TimelapseHelper.create();
        });
    }


    static async create(imageUrls: string[], codec : string, format: string, fps: number, socket: Socket) {
        const folder = '/mnt/barracuda/tmp/';

      //  fs.readdir(folder, async (err, files) => {

            let nrOfFoldersInTmp = await TimelapseHelper.getNrOfFiles(TimelapseHelper.TMP_FOLDER);

            let newFolderName = TimelapseHelper.TMP_FOLDER + '/' + nrOfFoldersInTmp;
            try {
                await mkdir(newFolderName);
            } catch (e) {
                throw new Error('[TimelapseHelper] [create] Trying to create an existing tmp folder');
            }

            if (imageUrls.length) {

                let copyPromises = [];
                console.log('[TimelapseHelper] [create] copying files');
                for (let index of imageUrls.keys()) {

                    let format = path.extname(imageUrls[index]);
                    let filename = TimelapseHelper.pad(index, TimelapseHelper.NR_OF_LEADING_ZEROS) + format;
                    try {
                        copyPromises.push(copyFile(imageUrls[index], newFolderName + '/' + filename));
                    } catch (e) {
                        throw new Error('[TimelapseHelper] [create] Unable to copy file');
                    }
                }
                await Promise.all(copyPromises);


                let nrOfTimelapses = await TimelapseHelper.getNrOfFiles(TimelapseHelper.TIMELAPSES_FOLDER);

                const durationEstimate = (imageUrls.length / fps) * 1000;

                let filename = TimelapseHelper.TIMELAPSES_FOLDER + '/' + nrOfTimelapses + '.' + format;
                let command = new ffmpeg();
                command

                    .input(newFolderName + '/%0' + TimelapseHelper.NR_OF_LEADING_ZEROS + 'd.jpg')
                    .withFpsInput(fps)
                    .videoCodec(codec)
                    .format(format)
                    .on('error', function (err) {
                        console.error('[TimelapseHelper] [create] Unable to render the file: ' + err.message);
                        socket.emit('timelapse/error', err.message);
                    })
                    .on('start', function (commandLine) {
                        console.log('Spawned Ffmpeg with command: ' + commandLine);
                    })
                    .on('progress', ffmpegOnProgress((progress, event) => {
                        // progress is a floating point number from 0 to 1
                        let progressFixed =(progress * 100).toFixed();
                        let data = {'progress' : progressFixed};
                        socket.emit('timelapse/progress', data);
                        console.log('progress', progressFixed)
                    }, durationEstimate))
                    .on('end', function () {
                        console.log('Timelapse finished!');
                        TimelapseHelper.clean(newFolderName);
                        socket.emit('timelapse/finish', filename);
                    })
                    .save(filename);
            }
       // });
    }


    static getCodecs(): Promise<any> {
        return new Promise(resolve => {
            ffmpeg().getAvailableEncoders((err, encoders) => {
                encoders = Array.from(Object.keys(encoders), k => {
                    encoders[k].name = k;
                    return encoders[k];
                });

                encoders = encoders.filter((encoder) => {
                    return encoder.type == 'video';
                });
                if (err) {
                    console.error('[TimelapseHelper] [getCodecs] Unable to get codecsDescription');
                } else {
                    resolve(encoders);
                }

            });
        });
    }

    static getFormats(): Promise<any> {
        return new Promise(resolve => {
            ffmpeg().getAvailableFormats((err, formats) => {
                formats = Array.from(Object.keys(formats), k => {
                    formats[k].name = k;
                    return formats[k];
                });

                if (err) {
                    console.error('[TimelapseHelper] [getFormats] Unable to get formats');
                } else {
                    resolve(formats);
                }
            });
        });

    }

    static getNrOfFiles(folder: string): Promise<number> {
        return new Promise<number>((resolve) => {
            readdir(folder).then((files) => {
                let nrOfFiles = files ? files.length : 0;
                resolve(nrOfFiles);
            });
        });
    }

    static clean(folderName) {
        rmdir(folderName, (err => {
            if (err) {
                console.error('[TimelapseHelper] [clean] Unable to delete folder ' + folderName);
            }
        }))
    }

    static pad(number, length) {
        let str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }

        return str;
    }

    static async createFolders() {
        try {
            await this.createFolderIfNotExist(TimelapseHelper.TIMELAPSES_FOLDER);
            await this.createFolderIfNotExist(TimelapseHelper.TMP_FOLDER);
        } catch (e) {
            console.log('[TimelapseHelper] [createFolders] Unable to create folder ' + e);
        }
    }

    static async createFolderIfNotExist(folder: string) {
        return new Promise((resolve) => {
            fs.stat(folder, async (err) => {
                let exists = !err;
                if (!exists) {
                    await mkdir(folder);
                }
                resolve();
            });
        });

    }
}