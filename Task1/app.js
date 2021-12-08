const fs = require("fs");
const path = require("path");

const writeStream = fs.createWriteStream("file sorted_files.txt");
const dir = process.argv[2];

let lineMaxLength = 0; // for creating equal lines
let getAllFiles = (directory) => {
    if (fs.existsSync(directory)) {
        let files = [];
        const allFiles = fs.readdirSync(directory);
        allFiles.forEach((file) => {
            const filePath = path.join(directory, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                files = files.concat(getAllFiles(filePath));
            } else {
                lineMaxLength = filePath.length > lineMaxLength ? filePath.length : lineMaxLength;
                files.push(filePath);
            }
        });
        return files;
    } else {
        return;
    }
}

let convertSize = (size) => {
    const kB = Math.pow(10, 3);
    const mB = Math.pow(10, 6);
    const gB = Math.pow(10, 9);

    if (size < kB) {
        return size + " bytes";
    } else if (size < mB) {
        return (size / kB).toFixed(0) + " kb";
    } else if (size < gB) {
        return (size / mB).toFixed(0) + " mb";
    } else {
        return (size / gB).toFixed(0) + " gb";
    }
}

let sortAndWriteFiles = (directory) => {
    const files = getAllFiles(directory);
    lineMaxLength = lineMaxLength - directory.length + 5; // will be min 5 dashes per line
    if (files && files.length > 0) {
        files.sort((a, b) => {
            return fs.statSync(b).size - fs.statSync(a).size;
        }).forEach(el => {
            let path = el.replace(directory, ".");
            const fileSize = convertSize(fs.statSync(el).size);

            /* add dashes */
            let length = path.length;
            while (length < lineMaxLength) {
                path += '-';
                length++;
            }

            writeStream.write(`${path} ${fileSize}\n`);
        });
    } else {
        console.log(`${dir} doesn't exist or empty`);
        return;
    }
}

sortAndWriteFiles(dir);