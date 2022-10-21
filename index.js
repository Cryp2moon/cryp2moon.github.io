var currentSelected = 3;
var filter1 = false; var filter2 = false; var filter3 = false; var filter4 = false; var filter5 = false; 
var filter6 = false; var filter7 = false; var filter8 = false; var filter9 = false; var filter0 = false;
var layer3 = []; var layer4 = []; var layer5 = []; var layer6 = [];

$(document).ready(function(){    
    $("#layer3").click(function () {
        loadLayer(3);
        toggleNavigation(3);
    });
    $("#layer4").click(function () {
        loadLayer(4);
        toggleNavigation(4);
    });
    $("#layer5").click(function () {
        loadLayer(5);
        toggleNavigation(5);
    });
    $("#layer6").click(function () {
        loadLayer(6);
        toggleNavigation(6);
    });

    $(".filter").click(function () {        
        toggleFilter(($(this))[0]);
        loadLayer(currentSelected);
    });

    fetchData();
});

function fetchData() {
    fetch('https://content-sheets.googleapis.com/v4/spreadsheets/10VNPu42hvFeBlWX4i9KCWnrOt_4j7SpgyynMxalZ8i8/values/\'Discovery%20Overview\'!L5%3AX593?key=AIzaSyBwDJgNRk0l73tI9YQUwMp7OXdIAsPzWa4').then(function (response) {
        // The API call was successful!
        return response.json();
    }).then(function (data) {
        // Clean data from API
        var list = []; 
        for (let i = 0; i < data.values.length; i++) {
            var row = data.values[i];
            if (row.length < 13) {
                for (let j = row.length; j < 13; j++) {
                    row.push("");
                }
            }

            if (row[12] && row[12].toLowerCase() != 'x' && row[12].toLowerCase() != 'code shorthand') {
                list.push({
                    'Code': row[12],
                    'Name': row[0],
                    'Savannah': row[7],
                    'Forest': row[8],
                    'Arctic': row[9],
                    'Mystic': row[10],
                    'Genesis': row[11]
                });
            }
        }
        //console.log(list);
        processData(list);
        loadLayer(3);
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });        
}

function processData(list) {
    var processed = []
    for (let i = 0; i < list.length; i++) {
        var found = processed.find(o => o.Code == list[i].Code);
        if (found) {
            found.Savannah = mergeValue(list[i].Savannah, list[i].Name, found.Savannah);
            found.Forest = mergeValue(list[i].Forest, list[i].Name, found.Forest);
            found.Arctic = mergeValue(list[i].Arctic, list[i].Name, found.Arctic);
            found.Mystic = mergeValue(list[i].Mystic, list[i].Name, found.Mystic);
            found.Genesis = mergeValue(list[i].Genesis, list[i].Name, found.Genesis);
        } else {
            processed.push({
                'Code': list[i].Code,
                'Savannah': processValue(list[i].Savannah, list[i].Name),
                'Forest': processValue(list[i].Forest, list[i].Name),
                'Arctic': processValue(list[i].Arctic, list[i].Name),
                'Mystic': processValue(list[i].Mystic, list[i].Name),
                'Genesis': processValue(list[i].Genesis, list[i].Name)
            });
        }            
    }

    for (let i = 0; i < processed.length; i++) {
        var row = processed[i].Code + ",";
        row += processed[i].Savannah + ",";
        row += processed[i].Forest + ",";
        row += processed[i].Arctic + ",";
        row += processed[i].Mystic + ",";
        row += processed[i].Genesis;

        if (processed[i].Code.length == 3) {            
            layer3.push(row);
        } else if (processed[i].Code.length == 4) {
            layer4.push(row);
        } else if (processed[i].Code.length == 5) {
            layer5.push(row);
        } else if (processed[i].Code.length == 6) {
            layer6.push(row);
        }
    }
    // console.log(layer3);
    // console.log(layer4);
    // console.log(layer5);
    // console.log(layer6);
}

function processValue(val, name) {
    return val == "" ? "?" : val.toLowerCase() == "x" ? name : "Admonitus";
}

function mergeValue(val, newName, oldName) {    
    return val.toLowerCase() == "x" ? newName : oldName;
}

function toggleNavigation(newSelected) {
    if (currentSelected == newSelected) return;
    $("#layer" + currentSelected + " > i").removeClass("bi-" + currentSelected + "-square-fill");
    $("#layer" + currentSelected + " > i").addClass("bi-" + currentSelected + "-square");    
    $("#layer" + newSelected + " > i").removeClass("bi-" + newSelected + "-square");
    $("#layer" + newSelected + " > i").addClass("bi-" + newSelected + "-square-fill");
    currentSelected = newSelected;
}

function toggleFilter(button) {    
    switch (button.id) {
        case "filter1":
            filter1 = !filter1;
            toggleFilterClass(button.id, filter1, "edenite");
            break;
        case "filter2":
            filter2 = !filter2;
            toggleFilterClass(button.id, filter2, "aqua");
            break;
        case "filter3":
            filter3 = !filter3;
            toggleFilterClass(button.id, filter3, "beastium");
            break;
        case "filter4":
            filter4 = !filter4;
            toggleFilterClass(button.id, filter4, "serpentine");
            break;
        case "filter5":
            filter5 = !filter5;
            toggleFilterClass(button.id, filter5, "amber");
            break;
        case "filter6":
            filter6 = !filter6;
            toggleFilterClass(button.id, filter6, "aerium");
            break;
        case "filter7":
            filter7 = !filter7;
            toggleFilterClass(button.id, filter7, "mechanium");
            break;
        case "filter8":
            filter8 = !filter8
            toggleFilterClass(button.id, filter8, "solar");
            break;
        case "filter9":
            filter9 = !filter9;
            toggleFilterClass(button.id, filter9, "obsidian");
            break;
        default:
            filter0 = !filter0;
            toggleFilterClass(button.id, filter0, "citrine");
            break;
    };
}

function toggleFilterClass(id, selected, name) {
    if (selected) {
        $('#' + id).removeClass(name);
        $('#' + id).addClass(name + "-bg"); 
    } else {    
        $('#' + id).removeClass(name + "-bg");
        $('#' + id).addClass(name);
    }
}

function loadLayer(layer) {
    $("#tableBody").empty();
    //var text = layer == 3 ? layer3text : layer == 4 ? layer4text : layer == 5 ? layer5text : layer6text;
    //var rows = text.split(/\r?\n/);    
    //if (!text || rows.length <= 1) return;
    var rows = layer == 3 ? layer3 : layer == 4 ? layer4 : layer == 5 ? layer5 : layer6;
    //console.log(rows);
    var filteredRows = [];
    if (!filter1 && !filter2 && !filter3 && !filter4 && !filter5 && !filter6 && !filter7 && !filter8 && !filter9 && !filter0) {
        filteredRows = rows;
    } else {
        for (let i in rows) {
            var columns = rows[i].split(',');        
            var code = columns[0];
            if ((filter1 && code.includes("1")) || (filter2 && code.includes("2")) || (filter3 && code.includes("3")) || (filter4 && code.includes("4")) ||
            (filter5 && code.includes("5")) || (filter6 && code.includes("6")) || (filter7 && code.includes("7")) || (filter8 && code.includes("8")) ||
            (filter9 && code.includes("9")) || (filter0 && code.includes("0"))) {
                filteredRows.push(rows[i]);
                continue;
            }        
        }
    }

    for (let i in filteredRows.sort()) {        
        //4232,?,Aloe,Admonitus,Admonitus,?
        var columns = filteredRows[i].split(',');
        var code = columns[0];
        var savannah = columns[1];
        var forest = columns[2];
        var arctic = columns[3];
        var mystic = columns[4];
        var genesis = columns[5];

        var newRow = document.createElement("tr");

        var col1 = document.createElement("td");
        $(col1).addClass("item");
        $(col1).append(displayCode(code));

        var col2 = document.createElement("td");        
        $(col2).addClass("item " + (savannah == "Admonitus" ? "admonitus" : "savannah"));
        $(col2).append(savannah);

        var col3 = document.createElement("td");        
        $(col3).addClass("item " + (forest == "Admonitus" ? "admonitus" : "forest"));        
        $(col3).append(forest);

        var col4 = document.createElement("td");        
        $(col4).addClass("item " + (arctic == "Admonitus" ? "admonitus" : "arctic"));
        $(col4).append(arctic);

        var col5 = document.createElement("td");        
        $(col5).addClass("item " + (mystic == "Admonitus" ? "admonitus" : "mystic"));
        $(col5).append(mystic);

        var col6 = document.createElement("td");        
        $(col6).addClass("item " + (genesis == "Admonitus" ? "admonitus" : "genesis"));
        $(col6).append(genesis);
        
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
                $(button).addClass("btn btn-display edenite-bg");
                break;
            case "2":
                $(button).addClass("btn btn-display aqua-bg");
                break;
            case "3":
                $(button).addClass("btn btn-display beastium-bg");
                break;
            case "4":
                $(button).addClass("btn btn-display serpentine-bg");
                break;
            case "5":
                $(button).addClass("btn btn-display amber-bg");
                break;
            case "6":
                $(button).addClass("btn btn-display aerium-bg");
                break;
            case "7":
                $(button).addClass("btn btn-display mechanium-bg");
                break;
            case "8":
                $(button).addClass("btn btn-display solar-bg");
                break;
            case "9":
                $(button).addClass("btn btn-display obsidian-bg");
                break;
            default:
                $(button).addClass("btn btn-display citrine-bg");
                break;
        };
        $(button).append(digits[i]);
        $(div).append(button);
    }

    return div;
}