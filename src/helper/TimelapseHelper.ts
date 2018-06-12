import * as util from "util";
import {Socket} from "socket.io";
import {ErrorObject} from "../class/ErrorObject";
import {DetectionImage} from "../entity/DetectionImage";
import {Detection} from "../entity/Detection";
import {Timelapse} from "../entity/Timelapse";
import {getConnection} from "typeorm";
import {User} from "../entity/User";

const config = require('../../config.json');

const ffmpeg = require('fluent-ffmpeg');
const ffmpegOnProgress = require('ffmpeg-on-progress');

const fs = require('fs');
const mkdir = util.promisify(fs.mkdir);
const copyFile = util.promisify(fs.copyFile);
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const rename = util.promisify(fs.rename);

const path = require('path');
const rmdir = require('rmdir');

const sharp = require('sharp');

import {spawn} from 'child_process';

import {format} from 'date-fns'

export class TimelapseHelper {

    private static readonly TIMELAPSES_FOLDER: string = 'timelapses';
    private static readonly TMP_FOLDER: string = TimelapseHelper.TIMELAPSES_FOLDER + '/tmp';
    public static readonly VIDEOS_FOLDER = TimelapseHelper.TIMELAPSES_FOLDER + '/videos';
    public static readonly THUMBNAILS_FOLDER = TimelapseHelper.TIMELAPSES_FOLDER + '/thumbnails';
    private static readonly THUMBNAILS_WIDTH = 1920;
    private static readonly THUMBNAILS_HEIGHT = 1080;

    public static readonly MOSAICS_FOLDER = TimelapseHelper.TIMELAPSES_FOLDER + '/mosaics';

    private static readonly FORMATS_THAT_SUPPORT_CHAPTERS = ['mp4', 'ogg', 'mov'];

    private static readonly NR_OF_LEADING_ZEROS = 5;


    static async create(detections: Detection[], codec: string, format: string, fps: number, socket: Socket, user: User) {

        let imagesPath = [];
        for (let detection of detections) {
            imagesPath.push(detection.image.path);
        }


        let nrOfFoldersInTmp = await TimelapseHelper.getNrOfFiles(TimelapseHelper.TMP_FOLDER);

        let tmpFolderName = TimelapseHelper.TMP_FOLDER + '/' + nrOfFoldersInTmp;
        try {
            await mkdir(tmpFolderName);
        } catch (e) {
            throw new Error('[TimelapseHelper] [create] Trying to create an existing tmp folder');
        }

        if (imagesPath.length) {
            let running = await this.copyFilesToTmp(imagesPath, tmpFolderName, socket);
            if (!running) {
                TimelapseHelper.clean(tmpFolderName);
                return false;
            }

            let nrOfTimelapses = await TimelapseHelper.getNrOfFiles(TimelapseHelper.VIDEOS_FOLDER);

            const durationEstimate = (imagesPath.length / fps) * 1000;

            let filename = nrOfTimelapses + '.' + format;
            let filePath = TimelapseHelper.VIDEOS_FOLDER + '/' + filename;
            let command = new ffmpeg();
            command

                .input(tmpFolderName + '/%0' + TimelapseHelper.NR_OF_LEADING_ZEROS + 'd.jpg')
                .withFpsInput(fps)
                .videoCodec(codec)
                .format(format)
                .on('error', function (err) {
                    if (!err.message.includes('SIGKILL')) {
                        console.error('[TimelapseHelper] [create] Unable to render the file: ' + err.message);
                        let errorObject = new ErrorObject();
                        errorObject.message = err.message;
                        socket.emit('timelapse/error', errorObject);
                    }
                })
                .on('start', function (commandLine) {
                    console.log('Spawned Ffmpeg with command: ' + commandLine);
                })
                .on('progress', ffmpegOnProgress((progress, event) => {
                    // progress is a floating point number from 0 to 1
                    let progressFixed = (progress * 100).toFixed();
                    let data = {'progress': progressFixed};
                    socket.emit('timelapse/progress', data);
                    console.log('progress', progressFixed)
                }, durationEstimate))
                .on('end', async () => {
                    console.log('Timelapse finished!');
                    let timelapse = await this.insertInDb(detections, filename, codec, imagesPath[0], user);

                    if (this.FORMATS_THAT_SUPPORT_CHAPTERS.includes(format)) {
                     await this.addChapters(filename, format, fps, detections);
                    }
                    await this.createMosaic(timelapse, 640, 4, 3);

                    TimelapseHelper.clean(tmpFolderName);
                    socket.emit('timelapse/finish', timelapse);
                })
                .save(filePath);

            let stopFunction = () => {
                command.kill();
                TimelapseHelper.clean(tmpFolderName);
                unlink(filename, (err) => {
                    if (err) {
                        console.error('[TimelapseHelper] [create] Unable to clean file');
                    }
                });
                socket.removeListener('timelapse/stop', stopFunction);
            };

            socket.on('timelapse/stop', stopFunction);
        }
    }

    private static async addChapters(filename: string, fileExtension: string, fps: number, detections: Detection[]) {

        let events = [];
        for (let detection of detections) {
            if (!events[detection.event.id]) {
                events[detection.event.id] = [];
            }
            events[detection.event.id].push(detection);
        }
        let metadata: string = ';FFMETADATA1\n';

        let picturePerSecond = (detections.length / fps) / detections.length;
        let secondsPassed = 0;
        for (let index in events) {
            let event = events[index];
            metadata += '[CHAPTER]\nTIMEBASE=1/1\n';
            metadata += 'START=' + Math.round(secondsPassed) + '\n';
            secondsPassed += event.length * picturePerSecond;
            metadata += 'END=' + Math.round(secondsPassed) + '\n';
            let startDate = format(event[0].date, 'YYYY/MM/DD HH:mm');
            let endDate = format(event[event.length - 1].date, 'YYYY/MM/DD HH:mm');
            metadata += 'title=' + event.length + ' detections from: ' + startDate + ' to ' + endDate + '\n';
        }

        let filenameWithoutExtension = path.parse(filename).name;
        let txtFullFilename = this.VIDEOS_FOLDER + '/' + filenameWithoutExtension + '.txt';
        fs.writeFile(txtFullFilename, metadata, err => {
            if (err) {
                return console.log(err);
            }
        });

        let fullFilename = this.VIDEOS_FOLDER + '/' + filename;
        let tmpFullFilename = this.VIDEOS_FOLDER + '/' + filenameWithoutExtension + '_new.' + fileExtension;
        let ffmpeg = spawn('ffmpeg', ['-y', '-i',
            fullFilename, '-i', txtFullFilename, '-map_metadata', '1', '-codec', 'copy',
            tmpFullFilename]);


        ffmpeg.on('exit', async (code) => {
            let err = await unlink(txtFullFilename);
            if (err) {
                console.error('[TimelapseHelper] [addChapters] Unable to delete txt chapters file');
            }

            if (code != 0) {
                console.error('[TimelapseHelper] [addChapters] Unable to write chapters to timelapse');
                return;
            }

            err = await unlink(fullFilename);
            if (err) {
                console.error('[TimelapseHelper] [addChapters] Unable to delete chapters old timelapse file');
            }

            err = await rename(tmpFullFilename, fullFilename);
            if (err) {
                console.error('[TimelapseHelper] [addChapters] Unable to rename timelapse with chapters file');
            }


        });
    }

    private static async createMosaic(timelapse: Timelapse, widthPerImage: number, rows: number, lines: number){
        let filenameWithoutExtension = path.parse(timelapse.filename).name;

        let mosaicFileName = filenameWithoutExtension + '.jpg';
        let mosaicFullPath = this.MOSAICS_FOLDER + '/' + mosaicFileName;
            let ffmpeg = spawn('ffmpeg', [
            '-i', this.VIDEOS_FOLDER + '/' + timelapse.filename,
            '-vf', 'select=gt(scene\\,0.1),scale=' + widthPerImage +':-1,tile='+ rows +'x' + lines,
            '-frames:v', '1',
            '-qscale:v', '1',
                mosaicFullPath,
            '-y'
        ]);

        ffmpeg.stderr.on('data', (data) => {
            // if (config.debugMode) {
            //     console.log('[TimelapseHelper] [createMosaic] ffmpeg stderr: ' + data);
            // }
        });


        ffmpeg.on('exit', async (code) => {
            if (code != 0){
                console.error('[TimelapseHelper] [createMosaic] Unable to create mosaic file');
            }
            timelapse.mosaic = mosaicFileName;
            getConnection().getRepository(Timelapse).save(timelapse);
        });
    }

    private static async insertInDb(detections: Detection[],
                                    filename: string, codec: string,
                                    thumbnailFile: string,
                                    user: User): Promise<Timelapse> {

        let thumbnailName = path.parse(filename).name + '.jpg';

        await sharp(thumbnailFile)
            .resize(this.THUMBNAILS_WIDTH, this.THUMBNAILS_HEIGHT)
            .toFile(this.THUMBNAILS_FOLDER + '/' + thumbnailName);

        let timelapse = new Timelapse();
        timelapse.detections = detections;
        timelapse.dateCreated = new Date();
        timelapse.codec = codec;
        timelapse.filename = filename;
        timelapse.thumbnail = thumbnailName;
        timelapse.user = user;

        return await getConnection().getRepository(Timelapse).save(timelapse);
    }

    static async copyFilesToTmp(imageUrls: string[], newFolderName: string, socket: Socket) {
        console.log('[TimelapseHelper] [copyFilesToTmp] copying files');
        let stopped: boolean = false;

        let stopFunction = () => {
            console.log('[TimelapseHelper] [copyFilesToTmp] Received Stop Event');
            stopped = true;
            socket.removeListener('timelapse/stop', stopFunction);
        };

        socket.on('timelapse/stop', stopFunction);

        let copyFileLoop = async (index, max) => {
            if (stopped) {
                console.log('[TimelapseHelper] [copyFilesToTmp] Stopped');
                return true;
            }
           // console.log('[TimelapseHelper] [copyFilesToTmp] Copying ' + (index + 1) + ' of ' + imageUrls.length);
            socket.emit('timelapse/files/progress', {
                currentIndex: index,
                max: imageUrls.length
            });

            let format = path.extname(imageUrls[index]);
            let filename = TimelapseHelper.pad(index, TimelapseHelper.NR_OF_LEADING_ZEROS) + format;
            try {
                await copyFile(imageUrls[index], newFolderName + '/' + filename);
            } catch (e) {
                throw new Error('[TimelapseHelper] [create] Unable to copy file');
            }

            if (++index < max) {
                return new Promise(async (resolve) => {
                    resolve(await copyFileLoop(index, max));
                });

            }
            return true;
        };
        await copyFileLoop(0, imageUrls.length);
        if (!stopped){
            socket.emit('timelapse/files/end');
        }
        socket.removeListener('timelapse/stop', stopFunction);
        return !stopped
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
                console.error(err);
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
            await this.createFolderIfNotExist(this.VIDEOS_FOLDER);
            await this.createFolderIfNotExist(this.THUMBNAILS_FOLDER);
            await this.createFolderIfNotExist(this.MOSAICS_FOLDER);
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