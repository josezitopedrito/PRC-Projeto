module.exports.protect_special_char_nome = 
    function protect_special_char_nome (id){
        let new_id = ""
        for(let i=0;i<id.length;i++){
            if(id[i].search(/[\/\\\'\`\$\n\'\"\\]/g) == 0){
                new_id = new_id + "\\" + id[i]
            } else {
                new_id = new_id + id[i]
            }
        }
        return new_id.replace(/(\r\n|\n|\r|[^\\]\\[^\\])/gm, "")
    }

module.exports.protect_special_char_abstract = 
    function protect_special_char_abstract (id){
        let new_id = ""
        for(let i=0;i<id.length;i++){
            if(id[i].search(/[\`\n\t\'\"\\]/g) == 0){
                new_id = new_id + "\\" + id[i]
            } else {
                new_id = new_id + id[i]
            }
        }
        return new_id.replace(/(\r\n|\n|\r|[^\\]\\[^\\])/gm, "")
    }

module.exports.protect_special_char_other = 
    function protect_special_char_other (id){
        let new_id = ""
        for(let i=0;i<id.length;i++){
            if(id[i].search(/[\n\`\'\"\\]/g) == 0){
                new_id = new_id + "\\" + id[i]
            } else {
                new_id = new_id + id[i]
            }
        }
        return new_id.replace(/(\r\n|\n|\r|[^\\]\\[^\\])/gm, "")
    }
