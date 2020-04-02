var a = require('./banda-album_!-Closure_(video).json')
var b = require('./banda-album_Closure:_Live-Greatest_Hits_(Restless_Heart_album).json')
var c = require('./banda-album_Greatest_Hits_(Rheostatics_album)-Lust_(Lords_of_Acid_album).json')
var d = require('./banda-album_Lust_In_Space___Live_At_The_National-Risky_Business_(soundtrack).json')
var e = require('./banda-album_Risotto-The_Inner_Sanctum.json')
var f = require('./banda-album_The_Innocence_Mission-Zekū.json')
var g = require('./banda-album_Zelluloid-コレクション_(Collection).json')


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
