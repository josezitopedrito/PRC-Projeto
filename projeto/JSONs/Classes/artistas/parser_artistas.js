var a = require('./artistas_A-Cayetano_Alberto_Silva.json')
var b = require('./artistas_Cayo_Sila_Godoy-Faiz_Karizi.json')
var c = require('./artistas_Faiz_Mohammad_Faizok-Jill_Parr.json')
var d = require('./artistas_Jill_Phillips-M_Doc.json')
var e = require('./artistas_M_Dot-Paul_Stacey.json')
var f = require('./artistas_Paul_Stanley-Steve_Arguelles.json')
var g = require('./artistas_Steve_Arrington-Ștefan_Stan.json')


function normalize(response) {
    return response.results.bindings.map(obj =>
        Object.entries(obj)
            .reduce((new_obj, [k,v]) => (new_obj[k] = v.value, new_obj),
                    new Object()));
};

a = normalize(a)
b = normalize(b)
c = normalize(c)
d = normalize(d)
e = normalize(e)
f = normalize(f)
g = normalize(g)


const result = [];
let key;

for (key in a) {
  result.push(a[key])
}

for (key in b) {
    result.push(b[key])
}

for (key in c) {
    result.push(c[key])
  }
  
for (key in d) {
    result.push(d[key])
}

for (key in e) {
    result.push(e[key])
}

for (key in f) {
    result.push(f[key])
}

for (key in g) {
    result.push(g[key])
}


console.log(JSON.stringify(result))
