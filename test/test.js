
        var objOrigin = {
            a: '1',
            b: '2',
            c: '3'
        }

        var objChange = {};

        for(let key in objOrigin) {
            objChange[key] = objOrigin[key]
        }

        document.write('objChange is '+ JSON.stringify(objChange))
    