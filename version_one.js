const fs = require('fs');

const htmlContent = ()=>{
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

const mkdirTest = ()=>{
    return new Promise(resolve => {
        fs.mkdir('./test', { recursive: true }, (err, data)=>{
            if(err) {
                throw Error(err)
            }
            console.log('文件夹写入成功！--NO2')
            resolve()
        })
    })
}

(async ()=>{
    let cssReg = /<style>[\s|\S]*?<\/style>/g;
    let jsReg = /<script>[\s|\S]*?<\/script>/g;
    let cssLink = '<link rel="stylesheet" href="./test.css">';
    let jsrc = '<script src="./test.js"></script>';
    let originContent = await htmlContent();
    await mkdirTest();
    console.log('我应该是第三处理！--NO3')
    let cssContent, jsContent, htmlContentStr;

    cssContent = JSON.stringify(originContent.match(cssReg)).replace('<style>','').replace('</style>', '');
    jsContent = JSON.stringify(originContent.match(jsReg)).replace('<script>','').replace('</script>', '');

    htmlContentStr = originContent.replace(cssReg, cssLink).replace(jsReg, jsrc);
    
    fs.writeFile('./test/test.css', JSON.parse(cssContent), (err)=>{
        if(err) {
            console.log(err)
        }
        console.log('css 抽取成功！')
    })

    fs.writeFile('./test/test.js', JSON.parse(jsContent), (err)=>{
        if(err) {
            console.log(err)
        }
        console.log('js 抽取成功！')
    })

    console.log('copyTest.html 准备写入')
    fs.writeFile('./test/copyTest.html', htmlContentStr, (err) =>{
        if(err) {
            console.log('err', err)
            return
        }
        console.log('copyTest.html 写入成功')
    })

})()