var a = require('./banda-genero_!!!-Company_Flow.json')
var b = require('./banda-genero_Company_Of_Strangers-Hamfatter.json')
var c = require('./banda-genero_Hamilton,_Joe_Frank_&_Reynolds-Mindflayer.json')
var d = require('./banda-genero_Mindflow-Shaa\'ir_and_Func.json')
var e = require('./banda-genero_Shabak_Samech-The_Material.json')
var f = require('./banda-genero_The_Material-∆AIMON.json')

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


console.log(JSON.stringify(result))
