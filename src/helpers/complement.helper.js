
const compleHelper = {};

compleHelper.stringAndNumber = ($data) => {
    $data = $data.trim();
    $data = $data.replace(/ +/g,'');
    $data = $data.replace(/[@$!%*?.-]/g,'');

    return $data;
}

compleHelper.deleteSpace = ($data) => {
    $data = $data.trim();
    $data = $data.replace(/ +/g,' ');
    
    return $data;
}

//exports
module.exports = compleHelper;