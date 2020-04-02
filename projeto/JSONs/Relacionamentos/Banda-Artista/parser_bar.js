var a = require('./banda-artista_\'Galway Joe\'_Dolan-Greg_Errico.json')
var b = require('./banda-artista_Greg_Errico-Nate_Kinsella.json')
var c = require('./banda-artista_Nate_Kinsella-Željko_Bebek.json')


function normalize(response) {
    return response.results.bindings.map(obj =>
        Object.entries(obj)
            .reduce((new_obj, [k,v]) => (new_obj[k] = v.value, new_obj),
                    new Object()));
};

a = normalize(a)
b = normalize(b)
c = normalize(c)


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
  

console.log(JSON.stringify(result))
