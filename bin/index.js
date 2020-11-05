const fs = require("fs").promises;
const path = require("path");

const filePath = process.argv[2];
const lookingForString = process.argv[3];

async function findSalesFiles(folderName) {
    // this array will hold sales files as they are found
    let salesFiles = [];

    async function findFiles(folderName) {
        // read all the items in the current folder
        const items = await fs.readdir(folderName, { withFileTypes: true });

        // iterate over each found item
        for (item of items) {
            // if the item is a directory, it will need to be searched
            if (item.isDirectory()) {
                // call this method recursively, appending the folder name to make a new path
                await findFiles(path.join(folderName, item.name));
            } else {
                // Make sure the discovered file is a .json file
                let file = path.join(folderName, item.name);
                let result = await check(file);
                if (result) {
                    salesFiles.push(file);
                }
            }
        }
    }

    await findFiles(folderName);

    return salesFiles;
}

async function check(file)
{
    let data = await fs.readFile(file);
    if (data.toString().search(lookingForString) != -1) {
        return file;
    }
}

async function main() {
    // find paths to all the sales files

    const salesFiles = await findSalesFiles(filePath);
    console.log(salesFiles);
}

main();
