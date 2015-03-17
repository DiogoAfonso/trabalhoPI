
function display (quotes, offst) {
    var arr = quotes.split('|');
    var a = Math.floor(Math.random() * ((arr.length)-1));
    document.getElementById('quotation').innerHTML = arr[a];
    setTimeout ((offst*1));
}
