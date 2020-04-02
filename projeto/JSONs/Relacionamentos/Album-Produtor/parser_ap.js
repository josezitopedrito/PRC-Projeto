var a = require('./albumProdutor⅋EP.json')
var b = require('./albumProdutorBeAware.json')
var c = require('./albumProdutorCounterpoints.json')
var d = require('./albumProdutorFeedingTheWheel.json')
var e = require('./albumProdutorHighwayRider.json')
var f = require('./albumProdutorLeFuturNoir.json')
var g = require('./albumProdutorMusic&Me.json')
var h = require('./albumProdutorProjecto2501.json')
var i = require('./albumProdutorSoWhat.json')
var j = require('./albumProdutorTheCollegeDropout.json')
var k = require('./albumProdutorThisTimeItsLove.json')
var l = require('./albumProdutorWolfmother.json')

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
h = normalize(h)
i = normalize(i)
j = normalize(j)
k = normalize(k)
l = normalize(l)


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

for (key in h) {
    result.push(h[key])
}

for (key in i) {
    result.push(i[key])
}

for (key in j) {
    result.push(j[key])
}

for (key in k) {
    result.push(k[key])
}

for (key in l) {
    result.push(l[key])
}


console.log(JSON.stringify(result))
