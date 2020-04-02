var a = require('./bandas_!!!-Headswim.json')
var b = require('./bandas_Headway-Sing_it_Loud.json')
var c = require('./bandas_Sing_Sing-∆AIMON.json')


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
