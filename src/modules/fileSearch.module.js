const fs = require('fs');
const path = require('path');


function printAllTags(folderPath, substring, ...params) {
    if (!folderPath) {
        throw new Error("Unreal path for directory!");
    }
    if (!substring) {
        throw new Error("Empty substring!");
    }
    if (!fs.existsSync(folderPath)) {
        throw new Error(`Folder with this path: ${folderPath} not exists!`);
    }
    params.slice(4).forEach((fileName) => {
        const filePath = path.join(folderPath, fileName);
        if (fs.statSync(filePath).isFile()) {
            fs.readFile(filePath, 'utf8', (err, htmlString) => {
                if (err) {
                    console.log(`Error for file read: ${filePath}`);
                    return;
                }
                const paragraphs = htmlString.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
                if (!paragraphs) {
                    console.log(`Can't find paragraphs in ${filePath}`);
                    return;
                }
                let count = 0;
                paragraphs.forEach(paragraph => {
                    if (paragraph.includes(substring)) {
                        count += 1;
                    }
                })
                console.log(`File: ${filePath}, count tags p: ${count}`)
            });
        }
    })
}

module.exports = printAllTags;