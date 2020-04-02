var a = require('./banda-album_!_(The_Dismemberment_Plan_album)-Bad_Azz.json')
var b = require('./banda-album_Bad_Azz-Come_On,_Let_It_Be_Heard,_Come_On,_Let_It_Be_Known.json')
var c = require('./banda-album_Come_Out_Come_Out-Everything.json')
var d = require('./banda-album_Everything-Hate_Crew_Deathroll.json')
var e = require('./banda-album_Hate_Culture-Kailangan_Ko\'y_Ikaw_(soundtrack).json')
var f = require('./banda-album_Kailasa-Marinella_Gia_Panta.json')
var g = require('./banda-album_Marinella_Gia_Panta_(1974_album)-One_for_Sorrow.json')
var h = require('./banda-album_One_for_the_Boys-Room_93.json')
var i = require('./banda-album_Room_Enough_For_All_(Battlefield_Band_album)-Strictly_4_My_NIGGAZ.json')
var j = require('./banda-album_Strictly_4_My_NIGGAZ-The_Medusa.json')
var k = require('./banda-album_The_Medúlla_Videos-Unchained.json')
var l = require('./banda-album_Unchained-⅋_(EP).json')

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


