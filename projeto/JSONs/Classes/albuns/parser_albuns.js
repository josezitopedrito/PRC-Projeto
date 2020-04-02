var a = require('./albuns_!-Ashanti.json')
var b = require('./albuns_Ashanti\'s_Christmas-Captain_Frodo.json')
var c = require('./albuns_Captain_Holojoy\'s_Space_Diner-Discipline.json')
var d = require('./albuns_Discipline-For_Every_Curse.json')
var e = require('./albuns_For_Every_Heart-Hindu_Love_Gods.json')
var f = require('./albuns_Hindu_Windmills-Keeps_Gettin\'_Better:_A_Decade_of_Hits.json')
var g = require('./albuns_Keeps_Us_Off_the_Streets-Love_the_Sin,_Hate_the_Sinner.json')
var h = require('./albuns_Love_the_Woman-Niles_Littlebig.json')
var i = require('./albuns_Nils-Project_Rocket_Fall_Out_Boy.json')
var j = require('./albuns_Project_Success-Shock_City_Maverick.json')
var k = require('./albuns_Shock_Front-Take_It_While_It\'s_Hot.json')
var l = require('./albuns_Take_It_from_Me-The_Official_Fuzzy_Warbles_Collector\'s_Album.json')
var m = require('./albuns_The_Official_Music_of_"Weird_Al"_Yankovic-Two_for_the_Show.json')
var n = require('./albuns_Two_for_the_show-Yume_Bitsu.json')
var o = require('./albuns_Yume_Miru_Uchuu-コレクション_(Collection).json')

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
m = normalize(m)
n = normalize(n)
o = normalize(o)

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

for (key in m) {
    result.push(m[key])
}

for (key in n) {
    result.push(n[key])
}

for (key in o) {
    result.push(o[key])
}

console.log(JSON.stringify(result))
