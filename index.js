var currentSelected = 3;

$(document).ready(function(){
    loadLayer(layer3text);
    $("#layer3").click(function () {
        loadLayer(layer3text);
        toggleNavigation(3);
    });
    $("#layer4").click(function () {
        loadLayer(layer4text);
        toggleNavigation(4);
    });
    $("#layer5").click(function () {
        loadLayer(layer5text);
        toggleNavigation(5);
    });
    $("#layer6").click(function () {
        loadLayer(layer6text);
        toggleNavigation(6);
    });
});

function toggleNavigation(newSelected) {
    if (currentSelected == newSelected) return;
    $("#layer" + currentSelected + " > i").removeClass("bi-" + currentSelected + "-square-fill");
    $("#layer" + currentSelected + " > i").addClass("bi-" + currentSelected + "-square");    
    $("#layer" + newSelected + " > i").removeClass("bi-" + newSelected + "-square");
    $("#layer" + newSelected + " > i").addClass("bi-" + newSelected + "-square-fill");
    currentSelected = newSelected;
}

function loadLayer(text) {
    $("#tableBody").empty();
    var rows = text.split(/\r?\n/);
    if (!text || rows.length <= 1) return;
    
    for (let i in rows.sort()) {        
        //Bleeding Heart,575,?,1,1,1,1
        var columns = rows[i].split(',');
        
        var code = columns[0];
        var name = columns[1];
        var savannah = columns[2];
        var forest = columns[3];
        var arctic = columns[4];
        var mystic = columns[5];
        var genesis = columns[6];

        var newRow = document.createElement("tr");

        var col1 = document.createElement("td");
        $(col1).addClass("item");
        $(col1).append(displayCode(code));

        var col2 = document.createElement("td");
        var col2text = displayPlant(name, savannah);
        $(col2).addClass("item " + (col2text == "Admonitus" ? "admonitus" : "savannah"));
        $(col2).append(col2text);

        var col3 = document.createElement("td");
        var col3text = displayPlant(name, forest);
        $(col3).addClass("item " + (col3text == "Admonitus" ? "admonitus" : "forest"));        
        $(col3).append(col3text);

        var col4 = document.createElement("td");
        var col4text = displayPlant(name, arctic);
        $(col4).addClass("item " + (col4text == "Admonitus" ? "admonitus" : "arctic"));
        $(col4).append(col4text);

        var col5 = document.createElement("td");
        var col5text = displayPlant(name, mystic);
        $(col5).addClass("item " + (col5text == "Admonitus" ? "admonitus" : "mystic"));
        $(col5).append(col5text);

        var col6 = document.createElement("td");
        var col6text = displayPlant(name, genesis);
        $(col6).addClass("item " + (col6text == "Admonitus" ? "admonitus" : "genesis"));
        $(col6).append(col6text);
        
        $(newRow).append(col1).append(col2).append(col3).append(col4).append(col5).append(col6);        
        $("#tableBody").append(newRow);
    }
}

function displayCode(code) {
    var div = document.createElement("div");
    var digits = [...code];
    for (let i in digits) {
        var button = document.createElement("button");        
        var digit = document.createElement("i");
        switch (digits[i]) {
            case "1":
                $(button).addClass("btn edenite");
                break;
            case "2":
                $(button).addClass("btn aqua");
                break;
            case "3":
                $(button).addClass("btn beastium");
                break;
            case "4":
                $(button).addClass("btn serpentine");
                break;
            case "5":
                $(button).addClass("btn amber");
                break;
            case "6":
                $(button).addClass("btn aerium");
                break;
            case "7":
                $(button).addClass("btn mechanium");
                break;
            case "8":
                $(button).addClass("btn solar");
                break;
            case "9":
                $(button).addClass("btn obsidian");
                break;
            default:
                $(button).addClass("btn citrine");
                break;
        };
        $(button).append(digits[i]);
        $(div).append(button);
    }

    return div;
}

function displayPlant(name, val) {
    return val == "?" ? val : val == "1" ? name : "Admonitus";
}