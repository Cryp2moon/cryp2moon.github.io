var currentSelected = 3;
var exclude1 = true; var exclude2 = true; var exclude3 = true; var exclude4 = true; var exclude5 = true; 
var exclude6 = true; var exclude7 = true; var exclude8 = true; var exclude9 = true; var exclude0 = true;
var filter = -1;
var layer3 = []; var layer4 = []; var layer5 = []; var layer6 = [];
var isWeedLoaded = false;
var layer4weeds = []; var layer5weeds = []; var layer6weeds = [];

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
    $("#finder").click(function () {        
        toggleNavigation(0);
    });
    $(".find-button").click(function () {        
        findCode();
    });
    $(".input-text").keyup(function(e){
        if(e.keyCode == 13) findCode();
    });

    $(".exclude").click(function () {        
        toggleExclude(($(this))[0]);
        loadLayer(currentSelected);
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

function fetchWeedData() {
    if (!isWeedLoaded) {
        fetch('https://content-sheets.googleapis.com/v4/spreadsheets/10VNPu42hvFeBlWX4i9KCWnrOt_4j7SpgyynMxalZ8i8/values/\'4%20Layer%20Weeds\'!A2%3AF10000?key=AIzaSyBwDJgNRk0l73tI9YQUwMp7OXdIAsPzWa4').then(function (response) {
            // The API call was successful!
            return response.json();
        }).then(function (data) {
            // Clean data from API
            for (let i = 0; i < data.values.length; i++) {
                var row = data.values[i];
                if (!row[0]) break;
                if (row.length < 6) {
                    for (let j = row.length; j < 6; j++) {
                        row.push("");
                    }
                }

                layer4weeds.push(row[0] + "," +
                    processWeed(row[1]) + "," +
                    processWeed(row[2]) + "," +
                    processWeed(row[3]) + "," +
                    processWeed(row[4]) + "," +
                    processWeed(row[5]));
            }
            //console.log(layer4weeds);
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });

        fetch('https://content-sheets.googleapis.com/v4/spreadsheets/10VNPu42hvFeBlWX4i9KCWnrOt_4j7SpgyynMxalZ8i8/values/\'5%20Layer%20Weeds\'!A2%3AF10000?key=AIzaSyBwDJgNRk0l73tI9YQUwMp7OXdIAsPzWa4').then(function (response) {
            // The API call was successful!
            return response.json();
        }).then(function (data) {
            // Clean data from API
            for (let i = 0; i < data.values.length; i++) {
                var row = data.values[i];
                if (!row[0]) break;
                if (row.length < 6) {
                    for (let j = row.length; j < 6; j++) {
                        row.push("");
                    }
                }

                layer5weeds.push(row[0] + "," +
                    processWeed(row[1]) + "," +
                    processWeed(row[2]) + "," +
                    processWeed(row[3]) + "," +
                    processWeed(row[4]) + "," +
                    processWeed(row[5]));
            }
            //console.log(layer5weeds);
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });

        fetch('https://content-sheets.googleapis.com/v4/spreadsheets/10VNPu42hvFeBlWX4i9KCWnrOt_4j7SpgyynMxalZ8i8/values/\'6%20Layer%20Weeds\'!A2%3AF20000?key=AIzaSyBwDJgNRk0l73tI9YQUwMp7OXdIAsPzWa4').then(function (response) {
            // The API call was successful!
            return response.json();
        }).then(function (data) {
            // Clean data from API
            for (let i = 0; i < data.values.length; i++) {
                var row = data.values[i];
                if (!row[0]) break;
                if (row.length < 6) {
                    for (let j = row.length; j < 6; j++) {
                        row.push("");
                    }
                }

                layer6weeds.push(row[0] + "," +
                    processWeed(row[1]) + "," +
                    processWeed(row[2]) + "," +
                    processWeed(row[3]) + "," +
                    processWeed(row[4]) + "," +
                    processWeed(row[5]));
            }
            //console.log(layer6weeds);
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });

        isWeedLoaded = true;
    }
}

function processWeed(val) {
    return val == "" ? "?" : val;
}

function toggleNavigation(newSelected) {
    if (currentSelected == newSelected) return;
    if (currentSelected == 0) {
        $("#finder > i").removeClass("bi-eye-fill");
        $("#finder > i").addClass("bi-eye");
        $("#layer" + newSelected + " > i").removeClass("bi-" + newSelected + "-square");
        $("#layer" + newSelected + " > i").addClass("bi-" + newSelected + "-square-fill");
        toggleView(false);
    } else if (newSelected == 0) {
        $("#layer" + currentSelected + " > i").removeClass("bi-" + currentSelected + "-square-fill");
        $("#layer" + currentSelected + " > i").addClass("bi-" + currentSelected + "-square");
        $("#finder > i").removeClass("bi-eye");
        $("#finder > i").addClass("bi-eye-fill");
        fetchWeedData();
        toggleView(true);
    } else {
        $("#layer" + currentSelected + " > i").removeClass("bi-" + currentSelected + "-square-fill");
        $("#layer" + currentSelected + " > i").addClass("bi-" + currentSelected + "-square");
        $("#layer" + newSelected + " > i").removeClass("bi-" + newSelected + "-square");
        $("#layer" + newSelected + " > i").addClass("bi-" + newSelected + "-square-fill");
        toggleView(false);
    }
    currentSelected = newSelected;
}

function toggleView(isFinder) {
    if (isFinder) {
        $(".recipes").hide();
        $(".finder").show();
    } else {
        $(".recipes").show();
        $(".finder").hide();
    }
}

function toggleExclude(button) {    
    switch (button.id) {
        case "exclude1":
            exclude1 = !exclude1;
            toggleExcludeClass(button.id, exclude1, "edenite");
            break;
        case "exclude2":
            exclude2 = !exclude2;
            toggleExcludeClass(button.id, exclude2, "aqua");
            break;
        case "exclude3":
            exclude3 = !exclude3;
            toggleExcludeClass(button.id, exclude3, "beastium");
            break;
        case "exclude4":
            exclude4 = !exclude4;
            toggleExcludeClass(button.id, exclude4, "serpentine");
            break;
        case "exclude5":
            exclude5 = !exclude5;
            toggleExcludeClass(button.id, exclude5, "amber");
            break;
        case "exclude6":
            exclude6 = !exclude6;
            toggleExcludeClass(button.id, exclude6, "aerium");
            break;
        case "exclude7":
            exclude7 = !exclude7;
            toggleExcludeClass(button.id, exclude7, "mechanium");
            break;
        case "exclude8":
            exclude8 = !exclude8
            toggleExcludeClass(button.id, exclude8, "solar");
            break;
        case "exclude9":
            exclude9 = !exclude9;
            toggleExcludeClass(button.id, exclude9, "obsidian");
            break;
        case "exclude0":
            exclude0 = !exclude0;
            toggleExcludeClass(button.id, exclude0, "citrine");
            break;
    };
}

function toggleExcludeClass(id, selected, name) {
    if (selected) {
        $('#' + id).removeClass(name);
        $('#' + id).addClass(name + "-bg"); 
    } else {    
        $('#' + id).removeClass(name + "-bg");
        $('#' + id).addClass(name);
    }
}

function toggleFilter(button) {
    var oldFilter = filter;
    switch (button.id) {
        case "filter1":
            if (oldFilter == 1) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 1;
                toggleFilterClass(button.id, "edenite");
            }            
            break;
        case "filter2":
            if (oldFilter == 2) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 2;
                toggleFilterClass(button.id, "aqua");
            }            
            break;
        case "filter3":
            if (oldFilter == 3) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 3;
                toggleFilterClass(button.id, "beastium");
            }
            break;
        case "filter4":
            if (oldFilter == 4) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 4;
                toggleFilterClass(button.id, "serpentine");
            }            
            break;
        case "filter5":
            if (oldFilter == 5) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 5;
                toggleFilterClass(button.id, "amber");
            }            
            break;
        case "filter6":
            if (oldFilter == 6) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 6;
                toggleFilterClass(button.id, "aerium");
            }            
            break;
        case "filter7":
            if (oldFilter == 7) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 7;
                toggleFilterClass(button.id, "mechanium");
            }            
            break;
        case "filter8":
            if (oldFilter == 8) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 8;
                toggleFilterClass(button.id, "solar");
            }            
            break;
        case "filter9":
            if (oldFilter == 9) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 9;
                toggleFilterClass(button.id, "obsidian");
            }            
            break;
        case "filter0":
            if (oldFilter == 0) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 0;
                toggleFilterClass(button.id, "citrine");
            }            
            break;
    };
}

function clearFilterClass() {
    $("#filter1").removeClass("edenite edenite-bg");
    $("#filter1").addClass("edenite");
    $("#filter2").removeClass("aqua aqua-bg");
    $("#filter2").addClass("aqua");
    $("#filter3").removeClass("beastium beastium-bg");
    $("#filter3").addClass("beastium");
    $("#filter4").removeClass("serpentine serpentine-bg");
    $("#filter4").addClass("serpentine");
    $("#filter5").removeClass("amber amber-bg");
    $("#filter5").addClass("amber");
    $("#filter6").removeClass("aerium aerium-bg");
    $("#filter6").addClass("aerium");
    $("#filter7").removeClass("mechanium mechanium-bg");
    $("#filter7").addClass("mechanium");
    $("#filter8").removeClass("solar solar-bg");
    $("#filter8").addClass("solar");
    $("#filter9").removeClass("obsidian obsidian-bg");
    $("#filter9").addClass("obsidian");
    $("#filter0").removeClass("citrine citrine-bg");
    $("#filter0").addClass("citrine");
}

function toggleFilterClass(id, name) {
    clearFilterClass();
    $('#' + id).removeClass(name);
    $('#' + id).addClass(name + "-bg");     
}

function loadLayer(layer) {
    $("#tableBody").empty();    
    //console.log(rows);
    var rows = layer == 3 ? layer3 : layer == 4 ? layer4 : layer == 5 ? layer5 : layer6;
    
    // Exclude minerals
    var excludedRows = [];    
    for (let i in rows) {
        var columns = rows[i].split(',');        
        var code = columns[0];
        if ((!exclude1 && code.includes("1")) || (!exclude2 && code.includes("2")) || (!exclude3 && code.includes("3")) || (!exclude4 && code.includes("4")) ||
        (!exclude5 && code.includes("5")) || (!exclude6 && code.includes("6")) || (!exclude7 && code.includes("7")) || (!exclude8 && code.includes("8")) ||
        (!exclude9 && code.includes("9")) || (!exclude0 && code.includes("0"))) {
            excludedRows.push(rows[i]);
            continue;
        }        
    }    
    //console.log(excludedRows);
    var filteredRows = rows.filter(row => !excludedRows.includes(row));

    // Filter by mineral
    if (filter > -1) {
        filteredRows = filteredRows.filter(function (row) {
            var columns = row.split(',');        
            var code = columns[0];
            return code.includes(filter.toString());
        });
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

function displayCode(code, match) {
    var div = document.createElement("div");
    var digits = [...code];
    var matchDigits = match ? [...match] : [];
    for (let i in digits) {
        var button = document.createElement("button");        
        switch (digits[i]) {
            case "1":
                if (match && digits[i] != matchDigits[i])
                    $(button).addClass("btn btn-display edenite");
                else $(button).addClass("btn btn-display edenite-bg");
                break;
            case "2":
                if (match && digits[i] != matchDigits[i])
                    $(button).addClass("btn btn-display aqua");
                else $(button).addClass("btn btn-display aqua-bg");
                break;
            case "3":
                if (match && digits[i] != matchDigits[i])
                    $(button).addClass("btn btn-display beastium");
                else $(button).addClass("btn btn-display beastium-bg");
                break;
            case "4":
                if (match && digits[i] != matchDigits[i])
                    $(button).addClass("btn btn-display serpentine");
                else $(button).addClass("btn btn-display serpentine-bg");
                break;
            case "5":
                if (match && digits[i] != matchDigits[i])
                    $(button).addClass("btn btn-display amber");
                else $(button).addClass("btn btn-display amber-bg");
                break;
            case "6":
                if (match && digits[i] != matchDigits[i])
                    $(button).addClass("btn btn-display aerium");
                else $(button).addClass("btn btn-display aerium-bg");
                break;
            case "7":
                if (match && digits[i] != matchDigits[i])
                    $(button).addClass("btn btn-display mechanium");
                else $(button).addClass("btn btn-display mechanium-bg");
                break;
            case "8":
                if (match && digits[i] != matchDigits[i])
                    $(button).addClass("btn btn-display solar");
                else $(button).addClass("btn btn-display solar-bg");
                break;
            case "9":
                if (match && digits[i] != matchDigits[i])
                    $(button).addClass("btn btn-display obsidian");
                else $(button).addClass("btn btn-display obsidian-bg");
                break;
            case "0":
                if (match && digits[i] != matchDigits[i])
                    $(button).addClass("btn btn-display citrine");
                else $(button).addClass("btn btn-display citrine-bg");
                break;
        };
        $(button).append(digits[i]);
        $(div).append(button);
    }

    return div;
}

function findCode() {
    $(".finder-message > span").text("");
    $("#tableBodyFinder").empty();
    var input = $(".input-text").val();
    if (input.length <= 3) return;    
    if (input.length == 4) {        
        var l4map = layer4.map(l => l.split(',')[0]);
        var found = l4map.findIndex(l => l == input);
        if (found >= 0 ) {
            loadFinderData([layer4[found]]);
            $(".finder-message > span").text("*Recipe already found.");
            return;
        }
        var l4wmap = layer4weeds.map(l => l.split(',')[0]);
        found = l4wmap.findIndex(l => l == input);
        if (found >= 0 ) {
            loadFinderData([layer4weeds[found]]);
            $(".finder-message > span").text("*Recipe already found.");
            return;
        }
        generateSuggestions(input, l4map, l4wmap, layer4, layer4weeds);
    } else if (input.length == 5) {
        var l5map = layer5.map(l => l.split(',')[0]);
        var found = l5map.findIndex(l => l == input);
        if (found >= 0 ) {
            loadFinderData([layer5[found]]);
            $(".finder-message > span").text("*Recipe already found.");
            return;
        }
        var l5wmap = layer5weeds.map(l => l.split(',')[0]);
        found = l5wmap.findIndex(l => l == input);
        if (found >= 0 ) {
            loadFinderData([layer5weeds[found]]);
            $(".finder-message > span").text("*Recipe already found.");
            return;
        }
        generateSuggestions(input, l5map, l5wmap, layer5, layer5weeds);
    } else if (input.length == 6) {
        var l6map = layer6.map(l => l.split(',')[0]);
        var found = l6map.findIndex(l => l == input);
        if (found >= 0 ) {
            loadFinderData([layer6[found]]);
            $(".finder-message > span").text("*Recipe already found.");
            return;
        }
        var l6wmap = layer6weeds.map(l => l.split(',')[0]);
        found = l6wmap.findIndex(l => l == input);
        if (found >= 0 ) {
            loadFinderData([layer6weeds[found]]);
            $(".finder-message > span").text("*Recipe already found.");
            return;
        }
        generateSuggestions(input, l6map, l6wmap, layer6, layer6weeds);
    }
}

function loadFinderData(data, input) {    
    for (let i in data) {        
        var columns = data[i].split(',');
        var code = columns[0];
        var savannah = columns[1];
        var forest = columns[2];
        var arctic = columns[3];
        var mystic = columns[4];
        var genesis = columns[5];

        var newRow = document.createElement("tr");

        var col1 = document.createElement("td");
        $(col1).addClass("item");
        $(col1).append(displayCode(code, input));

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
        $("#tableBodyFinder").append(newRow);
    }
}

function generateSuggestions(input, map, wmap, layer, wlayer) {
    var match5 = []; var match4 = []; var match3 = []; var match2 = [];
    var inputDigits = input.split('');
    for (let i = 0; i < map.length; i++) {
        var mapDigits = map[i].split('');
        var matchCounter = 0;
        for (let j = 0; j < inputDigits.length; j++) {
            if (inputDigits[j] == mapDigits[j]) matchCounter++;
        }

        if (matchCounter == 5) match5.push(layer[i]);
        if (matchCounter == 4) match4.push(layer[i]);
        if (matchCounter == 3) match3.push(layer[i]);
        if (matchCounter == 2) match2.push(layer[i]);
    }

    for (let i = 0; i < wmap.length; i++) {
        var wmapDigits = wmap[i].split('');
        var matchCounter = 0;
        for (let j = 0; j < inputDigits.length; j++) {
            if (inputDigits[j] == wmapDigits[j]) matchCounter++;
        }

        if (matchCounter == 5) match5.push(wlayer[i]);
        if (matchCounter == 4) match4.push(wlayer[i]);
        if (matchCounter == 3) match3.push(wlayer[i]);
        if (matchCounter == 2) match2.push(wlayer[i]);
    }

    var merged = match5.concat(match4).concat(match3).concat(match2);
    if (merged.length > 0) {
        $(".finder-message > span").text("*Recipe not yet found or shared with the community.\nThe following are similar patterns that were already tried:");
        loadFinderData(merged, input);
    } else {
        $(".finder-message > span").text("*Recipe not yet found or shared with the community.\nNo similar patterns found.");
    }
}