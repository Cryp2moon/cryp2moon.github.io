var currentSelected = 3;
var includes = [];
var toggles = [];
var filter = -1;
var layer3 = []; var layer4 = []; var layer5 = []; var layer6 = [];
var isWeedLoaded = false;
var layer4weeds = []; var layer5weeds = []; var layer6weeds = [];
var checklist = [];

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

    $(".include").click(function () {        
        toggleInclude(($(this))[0].id);
        loadLayer(currentSelected);
    });

    $(".toggle").click(function () {        
        toggleToggle(($(this))[0].id);
        loadLayer(currentSelected);
    });

    $(".filter").click(function () {        
        toggleFilter(($(this))[0].id);
        loadLayer(currentSelected);
    });

    loadStorage();
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

function toggleChecklist(e) {    
    var id = e.target.id.replace("cb", "");
    var checked = e.target.checked;
    var checklistItem = checklist.find(item => item.code == id);
    if (checklistItem) {
        checklistItem.checked = checked;
    } else {
        checklist.push({
            'code': id,
            'checked': checked
        });
    }
    
    var count = checklist.filter(item => item.checked).length;
    $(".div-count").html(count + " &#x2605;");
    localStorage.setItem('raylights-checklist', JSON.stringify(checklist));
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

function toggleInclude(id) {
    var mineral = id.replace("include", "");
    var includeItem = includes.find(item => item.mineral == mineral);
    includeItem.value = !includeItem.value;
    localStorage.setItem('raylights-includes', JSON.stringify(includes));
    
    switch (mineral) {
        case "1":            
            toggleIncludeClass(id, includeItem.value, "edenite");
            break;
        case "2":            
            toggleIncludeClass(id, includeItem.value, "aqua");
            break;
        case "3":            
            toggleIncludeClass(id, includeItem.value, "beastium");
            break;
        case "4":            
            toggleIncludeClass(id, includeItem.value, "serpentine");
            break;
        case "5":            
            toggleIncludeClass(id, includeItem.value, "amber");
            break;
        case "6":            
            toggleIncludeClass(id, includeItem.value, "aerium");
            break;
        case "7":            
            toggleIncludeClass(id, includeItem.value, "mechanium");
            break;
        case "8":            
            toggleIncludeClass(id, includeItem.value, "solar");
            break;
        case "9":            
            toggleIncludeClass(id, includeItem.value, "obsidian");
            break;
        case "0":            
            toggleIncludeClass(id, includeItem.value, "citrine");
            break;
    };
}

function resetIncludeClass() {
    $("#include1").removeClass("edenite edenite-bg");    
    $("#include2").removeClass("aqua aqua-bg");    
    $("#include3").removeClass("beastium beastium-bg");    
    $("#include4").removeClass("serpentine serpentine-bg");    
    $("#include5").removeClass("amber amber-bg");    
    $("#include6").removeClass("aerium aerium-bg");    
    $("#include7").removeClass("mechanium mechanium-bg");    
    $("#include8").removeClass("solar solar-bg");    
    $("#include9").removeClass("obsidian obsidian-bg");    
    $("#include0").removeClass("citrine citrine-bg");

    var include1 = includes.find(item => item.mineral == "1").value;
    var include2 = includes.find(item => item.mineral == "2").value;
    var include3 = includes.find(item => item.mineral == "3").value;
    var include4 = includes.find(item => item.mineral == "4").value;
    var include5 = includes.find(item => item.mineral == "5").value;
    var include6 = includes.find(item => item.mineral == "6").value;
    var include7 = includes.find(item => item.mineral == "7").value;
    var include8 = includes.find(item => item.mineral == "8").value;
    var include9 = includes.find(item => item.mineral == "9").value;
    var include0 = includes.find(item => item.mineral == "0").value;

    if (include1) $("#include1").addClass("edenite-bg"); else $("#include1").addClass("edenite");
    if (include2) $("#include2").addClass("aqua-bg"); else $("#include2").addClass("aqua");
    if (include3) $("#include3").addClass("beastium-bg"); else $("#include3").addClass("beastium");
    if (include4) $("#include4").addClass("serpentine-bg"); else $("#include4").addClass("serpentine");
    if (include5) $("#include5").addClass("amber-bg"); else $("#include5").addClass("amber");
    if (include6) $("#include6").addClass("aerium-bg"); else $("#include6").addClass("aerium");
    if (include7) $("#include7").addClass("mechanium-bg"); else $("#include7").addClass("mechanium");
    if (include8) $("#include8").addClass("solar-bg"); else $("#include8").addClass("solar");
    if (include9) $("#include9").addClass("obsidian-bg"); else $("#include9").addClass("obsidian");
    if (include0) $("#include0").addClass("citrine-bg"); else $("#include0").addClass("citrine");
}

function toggleIncludeClass(id, selected, name) {
    if (selected) {
        $('#' + id).removeClass(name);
        $('#' + id).addClass(name + "-bg"); 
    } else {    
        $('#' + id).removeClass(name + "-bg");
        $('#' + id).addClass(name);
    }
}

function toggleToggle(id) {
    var toggle = id.replace("toggle", "");
    var toggleItem = toggles.find(item => item.toggle == toggle);
    toggleItem.value = !toggleItem.value;
    localStorage.setItem('raylights-toggles', JSON.stringify(toggles));
    
    switch (toggle) {
        case "Star":            
            toggleIncludeClass(id, toggleItem.value, "starred");
            break;
        case "Savannah":            
            toggleIncludeClass(id, toggleItem.value, "savannah");
            break;
        case "Forest":            
            toggleIncludeClass(id, toggleItem.value, "forest");
            break;
        case "Arctic":            
            toggleIncludeClass(id, toggleItem.value, "arctic");
            break;
        case "Mystic":            
            toggleIncludeClass(id, toggleItem.value, "mystic");
            break;
        case "Genesis":         
            toggleIncludeClass(id, toggleItem.value, "genesis");
            break;
    };
}

function resetToggleClass() {
    $("#toggleStar").removeClass("starred starred-bg");    
    $("#toggleSavannah").removeClass("savannah savannah-bg");    
    $("#toggleForest").removeClass("forest forest-bg");    
    $("#toggleArctic").removeClass("arctic arctic-bg");    
    $("#toggleMystic").removeClass("mystic mystic-bg");    
    $("#toggleGenesis").removeClass("genesis genesis-bg");

    var toggle1 = toggles.find(item => item.toggle == "Star").value;
    var toggle2 = toggles.find(item => item.toggle == "Savannah").value;
    var toggle3 = toggles.find(item => item.toggle == "Forest").value;
    var toggle4 = toggles.find(item => item.toggle == "Arctic").value;
    var toggle5 = toggles.find(item => item.toggle == "Mystic").value;
    var toggle6 = toggles.find(item => item.toggle == "Genesis").value;

    if (toggle1) $("#toggleStar").addClass("starred-bg"); else $("#toggleStar").addClass("starred");
    if (toggle2) $("#toggleSavannah").addClass("savannah-bg"); else $("#toggleSavannah").addClass("savannah");
    if (toggle3) $("#toggleForest").addClass("forest-bg"); else $("#toggleForest").addClass("forest");
    if (toggle4) $("#toggleArctic").addClass("arctic-bg"); else $("#toggleArctic").addClass("arctic");
    if (toggle5) $("#toggleMystic").addClass("mystic-bg"); else $("#toggleMystic").addClass("mystic");
    if (toggle6) $("#toggleGenesis").addClass("genesis-bg"); else $("#toggleGenesis").addClass("genesis");
}

function toggleFilter(id, initial) {
    var mineral = id.replace("filter", "");
    var oldFilter = initial ? -1 : filter;
    switch (mineral) {
        case "1":
            if (oldFilter == 1) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 1;
                toggleFilterClass(id, "edenite");
            }            
            break;
        case "2":
            if (oldFilter == 2) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 2;
                toggleFilterClass(id, "aqua");
            }            
            break;
        case "3":
            if (oldFilter == 3) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 3;
                toggleFilterClass(id, "beastium");
            }
            break;
        case "4":
            if (oldFilter == 4) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 4;
                toggleFilterClass(id, "serpentine");
            }            
            break;
        case "5":
            if (oldFilter == 5) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 5;
                toggleFilterClass(id, "amber");
            }            
            break;
        case "6":
            if (oldFilter == 6) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 6;
                toggleFilterClass(id, "aerium");
            }            
            break;
        case "7":
            if (oldFilter == 7) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 7;
                toggleFilterClass(id, "mechanium");
            }            
            break;
        case "8":
            if (oldFilter == 8) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 8;
                toggleFilterClass(id, "solar");
            }            
            break;
        case "9":
            if (oldFilter == 9) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 9;
                toggleFilterClass(id, "obsidian");
            }            
            break;
        case "0":
            if (oldFilter == 0) { 
                filter = -1;
                clearFilterClass();
            } else {
                filter = 0;
                toggleFilterClass(id, "citrine");
            }            
            break;
    };
    localStorage.setItem('raylights-filter', filter);    
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
    var include1 = includes.find(item => item.mineral == "1").value;
    var include2 = includes.find(item => item.mineral == "2").value;
    var include3 = includes.find(item => item.mineral == "3").value;
    var include4 = includes.find(item => item.mineral == "4").value;
    var include5 = includes.find(item => item.mineral == "5").value;
    var include6 = includes.find(item => item.mineral == "6").value;
    var include7 = includes.find(item => item.mineral == "7").value;
    var include8 = includes.find(item => item.mineral == "8").value;
    var include9 = includes.find(item => item.mineral == "9").value;
    var include0 = includes.find(item => item.mineral == "0").value;
    var excludedRows = [];    
    for (let i in rows) {
        var columns = rows[i].split(',');        
        var code = columns[0];
        if ((!include1 && code.includes("1")) || (!include2 && code.includes("2")) || (!include3 && code.includes("3")) || (!include4 && code.includes("4")) ||
        (!include5 && code.includes("5")) || (!include6 && code.includes("6")) || (!include7 && code.includes("7")) || (!include8 && code.includes("8")) ||
        (!include9 && code.includes("9")) || (!include0 && code.includes("0"))) {
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

    var toggleStar = toggles.find(item => item.toggle == "Star").value;
    var toggleSavannah = toggles.find(item => item.toggle == "Savannah").value;
    var toggleForest = toggles.find(item => item.toggle == "Forest").value;
    var toggleArctic = toggles.find(item => item.toggle == "Arctic").value;
    var toggleMystic = toggles.find(item => item.toggle == "Mystic").value;
    var toggleGenesis = toggles.find(item => item.toggle == "Genesis").value;

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

        var colCb = document.createElement("td");
        var cb = document.createElement("input");
        cb.type = "checkbox";        
        cb.id = "cb" + code;
        var checklistItem = checklist.find(item => item.code == code);
        if (checklistItem) {
            if (checklistItem.checked && !toggleStar) continue;
            cb.checked = checklistItem.checked;
        }
        $(cb).addClass("star");
        $(colCb).append(cb);
        $(newRow).append(colCb);

        var col1 = document.createElement("td");
        $(col1).addClass("item");
        $(col1).append(displayCode(code));
        $(newRow).append(col1);

        if (toggleSavannah) {
            var col2 = document.createElement("td");        
            $(col2).addClass("item " + (savannah == "Admonitus" ? "admonitus" : "savannah"));
            $(col2).append(savannah);
            $(newRow).append(col2);
            $("#colSavannah").show();
        } else $("#colSavannah").hide();

        if (toggleForest) {
            var col3 = document.createElement("td");        
            $(col3).addClass("item " + (forest == "Admonitus" ? "admonitus" : "forest"));        
            $(col3).append(forest);
            $(newRow).append(col3);
            $("#colForest").show();
        } else $("#colForest").hide();

        if (toggleArctic) {
            var col4 = document.createElement("td");        
            $(col4).addClass("item " + (arctic == "Admonitus" ? "admonitus" : "arctic"));
            $(col4).append(arctic);
            $(newRow).append(col4);
            $("#colArctic").show();
        } else $("#colArctic").hide();

        if (toggleMystic) {
            var col5 = document.createElement("td");        
            $(col5).addClass("item " + (mystic == "Admonitus" ? "admonitus" : "mystic"));
            $(col5).append(mystic);
            $(newRow).append(col5);
            $("#colMystic").show();
        } else $("#colMystic").hide();

        if (toggleGenesis) {
            var col6 = document.createElement("td");        
            $(col6).addClass("item " + (genesis == "Admonitus" ? "admonitus" : "genesis"));
            $(col6).append(genesis);
            $(newRow).append(col6);
            $("#colGenesis").show();
        } else $("#colGenesis").hide();
                      
        $("#tableBody").append(newRow);
    }

    $(".star").click(function (e) {        
        toggleChecklist(e);
    });
}

function loadStorage() {
    var checklistFromStorage = localStorage.getItem('raylights-checklist');
    if (checklistFromStorage) {
        checklist = JSON.parse(checklistFromStorage);
        var count = checklist.filter(item => item.checked).length;
        $(".div-count").html(count + " &#x2605;");
    }

    var includesFromStorage = localStorage.getItem('raylights-includes');
    if (includesFromStorage) {
        includes = JSON.parse(includesFromStorage);        
    } else {
        includes = [
            {'mineral': '1', 'value': true},
            {'mineral': '2', 'value': true},
            {'mineral': '3', 'value': true},
            {'mineral': '4', 'value': true},
            {'mineral': '5', 'value': true},
            {'mineral': '6', 'value': true},
            {'mineral': '7', 'value': true},
            {'mineral': '8', 'value': true},
            {'mineral': '9', 'value': true},
            {'mineral': '0', 'value': true}
        ];
        localStorage.setItem('raylights-includes', JSON.stringify(includes));
    }
    resetIncludeClass();

    var togglesFromStorage = localStorage.getItem('raylights-toggles');
    if (togglesFromStorage) {
        toggles = JSON.parse(togglesFromStorage);        
    } else {
        toggles = [
            {'toggle': 'Star', 'value': true},
            {'toggle': 'Savannah', 'value': true},
            {'toggle': 'Forest', 'value': true},
            {'toggle': 'Arctic', 'value': true},
            {'toggle': 'Mystic', 'value': true},
            {'toggle': 'Genesis', 'value': true}
        ];
        localStorage.setItem('raylights-toggles', JSON.stringify(toggles));
    }
    resetToggleClass();

    var filterFromStorage = localStorage.getItem('raylights-filter');
    if (filterFromStorage) {
        filter = parseInt(filterFromStorage);        
    } else {
        localStorage.setItem('raylights-filter', filter);
    }    
    toggleFilter("filter" + filter, true);    
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