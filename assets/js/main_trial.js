
//function to connect to the API of World of tanks, extended with the search type and parameter//
//option 1: search player name to Get Account ID//
//option 2: search account_id to get player statistics//
//option 3: search account_id to get player vs vehicle stats
//option 4: search for all tanks to get the tank name, level, nation//
var TankStats = [];


function getData(type, arg, cb) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
    };

    if (type == 'nickname') {
        xhr.open("GET", "https://api.worldoftanks.eu/wot/account/list/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&search=" + arg);
    }
    else if (type == 'account_id') {
        xhr.open("GET", "https://api.worldoftanks.eu/wot/account/info/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&account_id=" +  arg + "&fields=global_rating%2C+statistics");
    }
    else if (type == 'Player-vehicle') {
        xhr.open("GET", "https://api.worldoftanks.eu/wot/account/tanks/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&account_id=" + arg);
    }
    else if (type == 'vehicle') {
        xhr.open("GET", "https://api.worldoftanks.eu/wot/encyclopedia/tanks/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&fields=level%2C+nation%2C+tank_id%2C+type%2C+name");
    }
    else {
        //not a valid search
    }
    xhr.send();
}

//function to write to console//
function printDataToConsole(data) {
    console.log(data);
}

//function that is called from the form on submition of a players nickname//
function writeToDocument() {
    
    //first type is always nickname
    var type = "nickname"
    var arg = document.getElementById("uname").value;
    //var type = "search=" + document.getElementById("uname").value;
    var Accountid = "" ;
    // get the account_id from the player that is filled in the input field//
    getData(type, arg,  function(data) {
        data = data.data["0"];

        Accountid = data['account_id']
        document.getElementById("NickName").innerHTML = "Overall player statistics for: " + data['nickname'] ;
       
    data = "";
    writeAccount(Accountid);
    return false;
    });
}

function writeAccount(acc_id) {

    //should trigger automatically to search the player stats based on the found account_id//
    var type = "account_id"
    var arg = acc_id.toString();
    getData(type, arg, function(data) {
        var account = acc_id;
        data = data.data[account].statistics.all;
        var win = data['wins'] / data['battles'] ;
        
        var winpercent = (win * 100).toFixed(2) + "%";
        var losspercent = ((1-win) * 100).toFixed(2) + "%";
        var battlesFought = data['battles'];
        //push to table
        var TableRows = [];
        var DataRow = [];
        DataRow.push(`<td>Balltes Fought</td><td>${battlesFought}</td>`)
        TableRows.push(`<tr>${DataRow}</tr>`)
        DataRow = [];
        DataRow.push(`<td>Winrate</td><td>${winpercent}</td>`)
        TableRows.push(`<tr>${DataRow}</tr>`)

        document.getElementById("results").innerHTML=`<table>${TableRows}</table>`.replace(/,/g, "");
        
        var myarray = [];
        
        myarray.push({
            "Name": 'Wins',
            "Amount":  data['wins']
        });
        myarray.push({
            "Name": 'Losses',
            "Amount":  data['losses']
        });
        myarray.push({
            "Name": 'Draws',
            "Amount":  data['draws']
        });

        var error = "";
        // makeGraphs(error, myarray)
        writeAccountTankData(account)
        // ------------------------------------------------------------Get now the data of the player on his specific tanks
    return false;
    });
}

function writeAccountTankData(acc_id) {

    //should trigger automatically to search the player stats based on the found account_id//
    var type = "Player-vehicle"
    var arg = acc_id.toString();
    getData(type, arg, function(data) {

        var account = acc_id;
        var myTankArray = [];
        //working code to get specific tank stats-----------------------------------------------------------------------------------------------
        data = data.data[account];
        
        data.forEach(function(item) {
            var MoM = item.mark_of_mastery;
            var tankid = item.tank_id;
            var battles = item.statistics.battles;
            var wins = item.statistics.wins;
            myTankArray.push({
            "Name": tankid,
            "WinAmount":  wins,
            "BattleAmount":battles,
            "Mastery": MoM
            });
            
        });

        writeTankData(myTankArray);
        //working code to get specific tank stats-----------------------------------------------------------------------------------------------
    return false;
    });
}
//---------------------------------------------------------------------------------------get all the tank data
function writeTankData(myTankArray) {

    //should trigger automatically to search the player stats based on the found account_id//
    var type = "vehicle"
    var arg = ""; //no need for an accountid
    getData(type, arg, function(data) {
        data = data.data;
        var TankArray = [];
            Object.keys(data).forEach(function(key) {
                var Name = data[key].name;
                var Nation = data[key].nation;
                var Type = data[key].type;
                var Level = data[key].level;
                var Tank_id = data[key].tank_id; 
                TankArray.push({
                "Name": Name,
                "Nation":Nation,
                "Type":Type,
                "Level": Level,
                "Tank_Id": Tank_id
                });
            });
        ConcatArray(TankArray, myTankArray);
        return false;
        });
}
//---------------------------------------------------------------------------------------get all the tank data

function ConcatArray(TankArray, myTankArray) {
    
    var TankStats = [];
    var TankStatsPie = [];
    Object.keys(myTankArray).forEach(function(key1){
    var TID = myTankArray[key1].Name;
    var Wins = myTankArray[key1].WinAmount;
    var Battles = myTankArray[key1].BattleAmount;
    var MoM = myTankArray[key1].Mastery;
        Object.keys(TankArray).forEach(function(key2){
            var TankID = TankArray[key2].Tank_Id;
            var Name = getSecondPart(TankArray[key2].Name);
            var Nation = TankArray[key2].Nation;
            var Type = TankArray[key2].Type;
            var Level = TankArray[key2].Level;
            if (TID == TankID) {
                TankStats.push({
                    "Name": Name,
                    "Nation":Nation,
                    "Type":Type,
                    "Level": Level,
                    // "Tank_Id":TankID,
                    "Wins": Wins,
                    "Battles": Battles,
                    "MasteryBadge": MoM,
                    "Winrate": (Wins / Battles).toFixed(2),
                    }); 
                    TankStatsPie.push({
                    "Name": Name,
                    "Nation":Nation,
                    "Type":Type,
                    "Level": Level,
                    "BattleResults": "Wins",
                    "Amount": Wins
                })
                TankStatsPie.push({
                    "Name": Name,
                    "Nation":Nation,
                    "Type":Type,
                    "Level": Level,
                    "BattleResults": "Losses",
                    "Amount": Battles - Wins
                })
            }
        });
        
    });
    
    var stringie =  JSON.stringify(TankStats)
    document.getElementById("trunkArray").value = stringie;
    document.getElementById("trunkArraySelect").value = stringie;
    document.getElementById("trunkArraySelectBackup").value = stringie;
    var error = "";
    GetUniqueTier(TankStats);
    GetUniqueNation(TankStats);
    GetUniqueType(TankStats);
    // 
    // makeGraphs(error, TankStats, TankStatsPie)
    // makeGraphsPerTier(error,TankStats)
    writeArray(TankStats)
    return false;
}


// ------------------------------------------------------------Get now the data of the player on his specific tanks

function getSecondPart(str) {
    return str.split(':')[1];
}

function removeOptions(selectbox){
    var i;
    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
        selectbox.remove(i);
    }
}
//using the function:


function GetUniqueTier(myArray){
    
    var flags = [], output = [], l = myArray.length, i;
    for( i=0; i<l; i++) {
        if( flags[myArray[i].Level]) continue;
        flags[myArray[i].Level] = true;
        output.push(parseInt(myArray[i].Level));
    }
    output = output.sort(sortNumber);
    removeOptions(document.getElementById("Tier_selector"));
    var sel = document.getElementById('Tier_selector');
    
    var opt = document.createElement('option');
    opt.innerHTML = "All";
    opt.value = "All";
    sel.appendChild(opt);
    for(var i = 0; i < output.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = output[i];
        opt.value = output[i];
        sel.appendChild(opt);
    }
}

function GetUniqueNation(myArray){
    
    var flags = [], output = [], l = myArray.length, i;
    for( i=0; i<l; i++) {
    if( flags[myArray[i].Nation]) continue;
    flags[myArray[i].Nation] = true;
    output.push(myArray[i].Nation);
    }
    output = output.sort();
    removeOptions(document.getElementById("Nation_selector"));
    var sel = document.getElementById('Nation_selector');
    
    var opt = document.createElement('option');
    opt.innerHTML = "All";
    opt.value = "All";
    sel.appendChild(opt);
    for(var i = 0; i < output.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = output[i];
        opt.value = output[i];
        sel.appendChild(opt);
    }
}

function GetUniqueType(myArray){
    
    var flags = [], output = [], l = myArray.length, i;
    for( i=0; i<l; i++) {
    if( flags[myArray[i].Type]) continue;
    flags[myArray[i].Type] = true;
    output.push(myArray[i].Type);
    }
    output = output.sort();
    removeOptions(document.getElementById("Type_selector"));
    var sel = document.getElementById('Type_selector');
    var opt = document.createElement('option');
    opt.innerHTML = "All";
    opt.value = "All";
    sel.appendChild(opt);
    for(var i = 0; i < output.length; i++) {
        var opt = document.createElement('option');
        opt.innerHTML = output[i];
        opt.value = output[i];
        sel.appendChild(opt);
    }
    
}

function sortNumber(a,b) {
    return a - b;
}

function getTableHeaders(obj) {
    var tableHeaders = [];

    Object.keys(obj).forEach(function(key) {
        tableHeaders.push(`<td>${key}</td>`);
    });

    return `<tr>${tableHeaders}</tr>`;
}

function writeArray(myArray) {
    var tableRows = [];
    $( "data" ).empty();
    
    var el = document.getElementById("data");
    
    data = myArray;
    var tableHeaders = getTableHeaders(data[0]);

    data.forEach(function(item) {
        var dataRow = [];

        Object.keys(item).forEach(function(key) {
            var rowData = item[key].toString();
            var truncatedData = rowData.substring(0, 25);
            dataRow.push(`<td>${truncatedData}</td>`);
        });
        tableRows.push(`<tr>${dataRow}</tr>`);
    });

    el.innerHTML = `<table>${tableHeaders}${tableRows}</table>`.replace(/,/g, "");
    $("#collapseTwo").addClass('in');
    var error = "";
    makeGraphs(error, myArray)
}

function ApplySelection(){
    var Nation = document.getElementById("Nation_selector").value;
    var Type = document.getElementById("Type_selector").value;
    var Tier = document.getElementById("Tier_selector").value;
    var myArray = [];
    myArray = $.parseJSON($('#trunkArray').val());
    MakeNewSelectionArray(Nation, Type, Tier, myArray)
}

function MakeNewSelectionArray(Nation, Type, Tier, TankArray){
var SelectionArrayNation = [];
var SelectionArrayType = [];
var SelectionArrayTier = [];
    if (Nation != "All") {
        Object.keys(TankArray).forEach(function(key){
            var NationA = TankArray[key].Nation;
            var TypeA = TankArray[key].Type;
            var LevelA = TankArray[key].Level;
            //makeNewArray if Nation selector is used
            if (NationA == Nation){
                SelectionArrayNation.push({
                    "Name": TankArray[key].Name,
                    "Nation":TankArray[key].Nation,
                    "Type":TankArray[key].Type,
                    "Level": TankArray[key].Level,
                    "Wins": TankArray[key].Wins,
                    "Battles": TankArray[key].Battles,
                    "MasteryBadge": TankArray[key].MasteryBadge,
                    "Winrate": (TankArray[key].Wins / TankArray[key].Battles).toFixed(2)
                }); 
            }
        });
    } else {
        SelectionArrayNation = TankArray;
    }
    
    if (Type != "All") {
        Object.keys(SelectionArrayNation).forEach(function(key){
            var NationA = SelectionArrayNation[key].Nation;
            var TypeA = SelectionArrayNation[key].Type;
            var LevelA = SelectionArrayNation[key].Level;
            //makeNewArray if Nation selector is used
            if (TypeA == Type){
                SelectionArrayType.push({
                    "Name": SelectionArrayNation[key].Name,
                    "Nation":SelectionArrayNation[key].Nation,
                    "Type":SelectionArrayNation[key].Type,
                    "Level": SelectionArrayNation[key].Level,
                    "Wins": SelectionArrayNation[key].Wins,
                    "Battles": SelectionArrayNation[key].Battles,
                    "MasteryBadge": SelectionArrayNation[key].MasteryBadge,
                    "Winrate": (SelectionArrayNation[key].Wins / SelectionArrayNation[key].Battles).toFixed(2)
                }); 
            }
        });
    } else {
        SelectionArrayType = SelectionArrayNation;
    }
    
    if (Tier != "All") {
        Object.keys(SelectionArrayType).forEach(function(key){
            var NationA = SelectionArrayType[key].Nation;
            var TypeA = SelectionArrayType[key].Type;
            var LevelA = SelectionArrayType[key].Level;
            //makeNewArray if Nation selector is used
            if (LevelA == Tier){
                SelectionArrayTier.push({
                    "Name": SelectionArrayType[key].Name,
                    "Nation":SelectionArrayType[key].Nation,
                    "Type":SelectionArrayType[key].Type,
                    "Level": SelectionArrayType[key].Level,
                    "Wins": SelectionArrayType[key].Wins,
                    "Battles": SelectionArrayType[key].Battles,
                    "MasteryBadge": SelectionArrayType[key].MasteryBadge,
                    "Winrate": (SelectionArrayType[key].Wins / SelectionArrayType[key].Battles).toFixed(2)
                }); 
            }
        });
    } else {
        SelectionArrayTier = SelectionArrayType;
    }
    writeArray(SelectionArrayTier);
    var error = "";
    makeGraphs(SelectionArrayTier);
}

function ResetSelectors(){
    var myArray = [];
    myArray = $.parseJSON($('#trunkArray').val());
    GetUniqueTier(myArray);
    GetUniqueNation(myArray);
    GetUniqueType(myArray);
    $('#Nation_selector').prop('disabled', false);
    $('#Nation_selector').css("background-color", "white");
    $('#Tier_selector').prop('disabled', false);
    $('#Tier_selector').css("background-color", "white");
    $('#Type_selector').prop('disabled', false);
    $('#Type_selector').css("background-color", "white");
    var stringie =  JSON.stringify(myArray);
    document.getElementById("trunkArraySelect").value = stringie;
    document.getElementById("trunkArraySelectBackup").value = stringie;
    var error = "";
    makeGraphs(myArray);
}

function makeGraphs(error, transactionsData) {
    var List = [];
    console.log(transactionsData)
    var ndx = crossfilter(transactionsData);
    
    transactionsData.forEach(function(d){
        d.Amount = parseInt(d.Amount);
    });
    MakePieChart(ndx);
    MakePieChartTier(ndx);
    MakePieChartNation(ndx);
}

function MakePieChart(ndx){
    
    var name_dim = ndx.dimension(dc.pluck('Type'));
    var total_battles = name_dim.group().reduceSum(dc.pluck('Battles'));
    
    dc.pieChart('#Type-chart')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_battles);
    dc.renderAll();
    
}

function MakePieChartTier(ndx){
    
    var name_dim = ndx.dimension(dc.pluck('Level'));
    var total_battles = name_dim.group().reduceSum(dc.pluck('Battles'));
    
    dc.pieChart('#Tier-chart')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_battles);
    dc.renderAll();
    
}

function MakePieChartNation(ndx){
    
    var name_dim = ndx.dimension(dc.pluck('Nation'));
    var total_battles = name_dim.group().reduceSum(dc.pluck('Battles'));
    
    dc.pieChart('#Nation-chart')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_battles);
    dc.renderAll();
    
}