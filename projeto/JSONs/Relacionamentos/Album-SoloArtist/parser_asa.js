var a = require('./album-soloartist_!Arriba!_La_Pachanga-Craig_Campbell_(album).json')
var b = require('./album-soloartist_Craig_Campbell_(album)-Hungary_for_the_Blues.json')
var c = require('./album-soloartist_Hunger_(Janis_Ian_album)-More_of_the_Great_Lorez_Alexandria.json')
var d = require('./album-soloartist_More_than_This_(compilation_album)-Slide_(album).json')
var e = require('./album-soloartist_Slide_Don\'t_Fret-To_Record_Only_Water_for_Ten_Days.json')
var f = require('./album-soloartist_To_Sail,_to_Sail-...with_Love.json')

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
