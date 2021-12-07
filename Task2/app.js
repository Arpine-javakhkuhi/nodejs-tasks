#!/usr/bin/env node

const fs = require("fs");
const Stream = require("stream");
const moment = require('moment');

const transformStream = new Stream.Transform({
    transform(chunk, encoding, next) {
        this.push(`${chunk}\n`);
        next();
    }
});

const readableStream = new Stream.Readable({
    read(size) {
        setTimeout(() => {
            this.push(moment(new Date()).format("MMMM DD YYYY hh:mm:ss"));
        }, 1000);
    }
});

const writableStream = fs.createWriteStream('./output.txt');

readableStream.pipe(transformStream).pipe(writableStream);
