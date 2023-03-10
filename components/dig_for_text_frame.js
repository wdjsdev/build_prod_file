function digForTextFrame(item)
{
    var result; //this is the identified textFrame

    //if the textFrame is already found or if no parent item is passed, just return result
	if(!item || (result && result.typename.match(/textframe/i)))return result;

    dig(item);

    result.name = item.name;
    return result;
	
    function dig(item)
    {
        if (item.typename === "TextFrame") {
            result = item;
        }
        else if (item.typename.match(/group/i)) {
            return afc(item).forEach(function (subItem) {
                dig(subItem)
            });
        }
    }
}