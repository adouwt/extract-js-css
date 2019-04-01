const fs = require('fs');
// 读取html 内容
const readHtml = ()=>{
    return new Promise(resolve => {
        fs.readFile('./test.html', 'utf-8', (err, data)=>{
            if(err) {
                throw Error(err)
            }
            console.log('test.html 读取成功！--NO1')
            resolve(data)
        })
    })
}
// 新建文件夹
const mkdirTest = ()=>{
    return new Promise(resolve => {
        fs.mkdir('./test', { recursive: true }, (err)=>{
            if(err) {
                // throw Error(err)
                console.log(err)
            }
            console.log('文件夹写入成功！--NO2')
            resolve()
        })
    })
}
// 写入css 和js
const writeJCss = (path, data, type) => {
    return new Promise(resolve => {
        fs.writeFile(path, data, (err)=>{
            if(err) {
                console.log(err)
            }
            console.log(`${type} 抽取成功！`)
            resolve()
        })
    })
}
// 写一个html
const writeHtml = (path, data) => {
    return new Promise(resolve => {
        fs.writeFile(path, data, (err) =>{
            if(err) {
                console.log('err', err)
                return
            }
            console.log(`${path} 写入成功`);
            resolve() // 必须resolve 。不然 promise 就到此为止，调用该方法后面的代码将不执行
        })
    })
}

// 理解调用方法入口
(async ()=>{
    console.log('==========================game-start=============================');
    let cssReg = /<style\s*>[\s|\S]*?<\/style\s*>/g;
    let jsReg = /<script\s*>[\s|\S]*?<\/script\s*>/g;
    let cssLink = '<link rel="stylesheet" href="./test.css">';
    let jsrc = '<script src="./test.js"></script>';
    let originContent = await readHtml();
    let cssContent, jsContent, htmlContentStr;

    cssContent = JSON.stringify(originContent.match(cssReg)).replace(/<style\s*>/g,'').replace(/<\/style\s*>/g, '');
    jsContent = JSON.stringify(originContent.match(jsReg)).replace(/<script\s*>/g,'').replace(/<\/script\s*>/g, '');
    htmlContentStr = originContent.replace(cssReg, cssLink).replace(jsReg, jsrc);

    await mkdirTest();
    console.log('我应该是第三处理！--NO3')
    
    await writeJCss('./test/test.css', JSON.parse(cssContent), 'css');
    console.log('我应该是第四处理！--NO4');

    await writeJCss('./test/test.js', JSON.parse(jsContent), 'js');
    console.log('我应该是第五处理！--NO5');

    console.log('copyTest.html 准备写入');
    await writeHtml('./test/copyTest.html', htmlContentStr);

    console.log('==========================game-over=============================');
})()