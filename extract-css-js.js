import fs from 'fs'
import csscomb from 'csscomb'

var comb = new csscomb('zen');

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
        fs.mkdir('./test', { recursive: true }, (err, data)=>{
            if (err) {
                console.log(err)
            };
            console.log('文件夹写入成功！--NO2')
            resolve()
        })
    })
}
// 删除文件夹
const deleteDir = (path)=>{
    return new Promise(resolve => {
        fs.unlink(path, (err) => {
            if (err) {
                console.log(err)
            };
            console.log(`已成功删除 ${path}`);
            resolve()
        });
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
const appendFile = (path, data, type) => {
    return new Promise(resolve => {
        fs.appendFile(path, data, (err) => {
            if (err) {
                console.log(err)
            };
            console.log(`${type}数据已追加到文件`);
            resolve()
        });
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
    let cssReg = /<style>[\s|\S]*?<\/style>/ig;
    let jsReg = /<script>[\s|\S]*?<\/script>/ig;
    // let allStyleReg = /<style>.*<\/style>(.*<style>.*<\/style>)*./ig
    let cssLink = '<link rel="stylesheet" href="./test.css">';
    let jsrc = '<script src="./test.js"></script>';
    let originContent = await readHtml();
    let styleCollection, scriptColletion;
    let cssContent = '', jsContent = '', htmlContentStr;
    await deleteDir('./test');
    console.log('我应该是第一处理，删除文件夹！--NO1')

    await mkdirTest();
    console.log('我应该是第三处理！--NO3')

    styleCollection = originContent.match(cssReg);
    scriptColletion = originContent.match(jsReg);
    // 处理 css
    for (let i =0;i<styleCollection.length;i++) {
        cssContent += JSON.stringify(styleCollection[i]);
    }

    cssContent = cssContent.replace(/<style>/g,'').replace(/<\/style>/g, '').replace(/("")/g,'')
    
    for (let i =0;i<scriptColletion.length;i++) {
        jsContent += JSON.stringify(scriptColletion[i]);
    }
    
    jsContent = jsContent.replace(/<script>/g,'').replace(/<\/script>/g, '')
    .replace(/<\/script>"*<script>/g, '').replace(/("")/g,'')
    
    await appendFile('./test/test.css', JSON.parse(cssContent), 'css');
    
    console.log('写入css后！')

    await appendFile('./test/test.js', JSON.parse(jsContent), 'js');
    console.log('写入js后！')



    htmlContentStr = originContent
    .replace(cssReg, (style)=>{
        style = '';
        return style
    })
    .replace(jsReg, jsrc);
    console.log('copyTest.html 准备写入');
    await writeHtml('./test/copyTest.html', htmlContentStr);

    console.log('==========================game-over=============================');
})()