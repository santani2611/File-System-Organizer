//command line mei jo bhi input tu dega wo ek array mei store kar lega  process.argv use karne ka argv array ka naam hai 
let inputArr= process.argv.slice(2);
console.log(inputArr);
let fs=require("fs");
let path=require("path");
//node main.js tree "directoryPath"
//node main.js organize "directoryPath"
//node main.js help "directoryPath"

let command=inputArr[0];
let types={
media:["mp4","mkv"],
archive:["zip","7z","rar","tar",'gz',"ar","iso","xz"],
documents:["docx","doc","pdf","xlsx","odt","ods","odg","odp","odf","txt","ps","tex"],
app:["exe","dmg","pkg","deb"]
}




switch(command)
{
   case "tree":
       treeFn(inputArr[1]);
       break;
    case "organize":
        organizeFn(inputArr[1])
        break;
    case "help":
        helpFn();
        break;
        default:
            console.log("Please🤞🤞 input correct command");
            break;
}

function treeFn(dirPath) {
    // let destPath;
    if (dirPath == undefined) {

        treeHelper(process.cwd(), "");
        return;
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            treeHelper(dirPath, "");
        } else {

            console.log("Kindly enter the correct path");
            return;
        }
    }
}

function treeHelper(dirPath, indent) {
    // is file or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    if (isFile == true) {
        let fileName = path.basename(dirPath);
        console.log(indent + "├──" + fileName);
    } else {
        let dirName = path.basename(dirPath)
        console.log(indent + "└──" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for (let i = 0; i < childrens.length; i++) {
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
        }
    }


}
module.exports = {
    treeKey: treeFn
}

function organizeFn(dirPath)
{
 //5- agar aap path nhi karte ho toh wo path undefined hoga aur undefined
 // pth ke liye bhi call lag jayegi aisa n aho iss liye undefined path ke liye check karenge.
 let destPath;
if (dirPath==undefined)
{
    console.log("Kindly enter the path");
    return;
}
else{
    // 1- given directory ka path
//check karo ki jo path mila wo kisi directory ka hai bhi ya nhi?
//iske liye fs ka lstat use karenge u
let doesExist=fs.existsSync(dirPath);
if(doesExist)
{
 //2- iss directory path mei ja ke ek organized file ke naam se directory banao
//iske liye fs modle ka mkdirsync use karte hain
 destPath=path.join(dirPath,"organizedFiles");
if(fs.existsSync(destPath)==false)
{
    fs.mkdirSync(destPath);
}


}else{
//path exist nhi kara to user ko bolo sahi path daale
console.log("Kindly enter the correct path");
return;
}
}
organizeHelper(dirPath,destPath);
   
    //console.log("Organize command implemented for ",dirPath);
}

function organizeHelper(src,dest){
//identify categories of all files in path directory
let childNames=fs.readdirSync(src);
// console.log(childNames);
for(let i in childNames)
{
let childAddress=path.join(src,childNames[i]);
let isFile=fs.lstatSync(childAddress).isFile();
if(isFile)
{
    let category=getCategory(childNames[i]);
    //4-  copy/cut to that organized directory ,put them inside their organized category
    console.log(childNames[i],"belongs to--->",category);
sendFiles(childAddress,dest,category);

}
}
}

function sendFiles(srcFilePath,dest,category)
{
let categoryPath=path.join(dest,category);
if(fs.existsSync(categoryPath)==false)
{
fs.mkdirSync(categoryPath);
}


let fileName=path.basename(srcFilePath);
let destFilePath=path.join(categoryPath,fileName);
fs.copyFileSync(srcFilePath,destFilePath );
fs.unlinkSync(srcFilePath);
console.log(fileName,"copied to",category);

}
function getCategory(name)
{
let ext=path.extname(name);
ext=ext.slice(1);
for(let type in types)
{
let cTypeArray=types[type];
for(let i=0;i<cTypeArray.length;i++)
{
    if(cTypeArray[i]===ext)
    return type;
}
}
return "others";
}

function helpFn()
{
    console.log(`
    List of all the commands:
node main.js tree "directoryPath"
node main.js organize "directoryPath"
node main.js help "directoryPath" 
    `);``
}