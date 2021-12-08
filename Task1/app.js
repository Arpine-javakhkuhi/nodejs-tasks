const fs = require("fs");
const path = require("path");

const writeStream = fs.createWriteStream("file sorted_files.txt");
const dir = process.argv[2];

let getAllFiles = (directory) => {
    if (fs.existsSync(directory)) {
        let files = [];
        const allFiles = fs.readdirSync(directory);
        allFiles.forEach((file) => {
            const filePath = path.join(directory, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                files = files.concat(getAllFiles(filePath));
            } else {
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
    } else if ( size < mB) {
        return (size / kB).toFixed(0) + " kb";
    } else if (size < gB) {
        return (size / mB).toFixed(0) + " mb";
    } else {
        return (size / gB).toFixed(0) + " gb";
    }
}

let sortAndWriteFiles = (directory) => {
    let files = getAllFiles(directory);
    if (files && files.length > 0) {
        files.sort((a, b) => {
            return fs.statSync(b).size - fs.statSync(a).size;
        }).forEach(el => {
            const path = el.replace(directory, ".");
            const fileSize = convertSize(fs.statSync(el).size);
            writeStream.write(`${path} ------------------------- ${fileSize}\n`);
        });
    } else {
        console.log(`${dir} doesn't exist or empty`);
        return;
    }
}

sortAndWriteFiles(dir);