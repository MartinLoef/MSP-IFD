
//function to connect to the API of World of tanks, extended with the search type and parameter//
//option 1: search player name to Get Account ID//
//option 2: search account_id to get player statistics//
//option 3: search account_id to get player vs vehicle stats
//option 4: search for all tanks to get the tank name, level, nation//

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
        // data = data.data;
        // console.log(data)
        Accountid = data['account_id']
        document.getElementById("NickName").innerHTML = "Overall player statistics for: " + data['nickname'] ;
        // document.getElementById("Account_ID").innerHTML = "Players AccountNumber: " + data['account_id'] ;
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
        console.log(data)
        var account = acc_id;
        data = data.data[account].statistics.all;
        console.log(data)
        var win = data['wins'] / data['battles'] ;
        // document.getElementById("data").innerHTML = data;
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
        
        // document.getElementById("battles").innerHTML = data['battles'];
        // document.getElementById("losses").innerHTML = losspercent;
        // document.getElementById("winrate").innerHTML = winpercent;
        document.getElementById("results").innerHTML=`<table>${TableRows}</table>`
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
        console.log(myarray);
        var error = "";
        // makeGraphs(error, myarray)
        writeAccountTankData(account)
        // ------------------------------------------------------------Get now the data of the player on his specific tanks
        
        console.log(myarray)
    return false;
    });
}

function writeAccountTankData(acc_id) {

    //should trigger automatically to search the player stats based on the found account_id//
    var type = "Player-vehicle"
    var arg = acc_id.toString();
    getData(type, arg, function(data) {
        console.log(data)
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
        console.log(myTankArray)
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
        console.log(data)
        
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
        console.log(TankArray)
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
            var Name = TankArray[key2].Name;
            var Nation = TankArray[key2].Nation;
            var Type = TankArray[key2].Type;
            var Level = TankArray[key2].Level;
            if (TID == TankID) {
                TankStats.push({
                    "Name": Name,
                    "Nation":Nation,
                    "Type":Type,
                    "Level": Level,
                    "Tank_Id":TankID,
                    "Wins": Wins,
                    "Battles": Battles,
                    "MasteryBadge": MoM,
                    "Game": "Tanks",
                    "Winrate": (Wins / Battles).toFixed(2),
                    "Losses": Battles - Wins
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
    console.log(TankStats);
    console.log(TankStatsPie);
    var error = "";
    
    // 
    makeGraphs(error, TankStats, TankStatsPie)
    makeGraphsPerTier(error,TankStats)
    return false;
}


// ------------------------------------------------------------Get now the data of the player on his specific tanks

function makeGraphs(error, transactionsData, transactionsDataAltered) {
    var List = [];
    
    var ndx = crossfilter(transactionsDataAltered);
    
    transactionsDataAltered.forEach(function(d){
        d.Amount = parseInt(d.Amount);
    });
    show_selectors(ndx);
    MakePieChart(ndx);
    

}

function MakePieChart(ndx){
    
    var name_dim = ndx.dimension(dc.pluck('BattleResults'));
    var total_battles = name_dim.group().reduceSum(dc.pluck('Amount'));
    dc.pieChart('#win-chart')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_battles);
    dc.renderAll();
    
}

    //Make a PIE graph with win/loss ratio
    // makePie(ndx);
    //call function to calculate the total amount of battles
    //call function to calculate the total amount of wins
    //calcultate the (Wins/TotalAmount)*100% to get the winrate
    //based on the selectors it should adjust to winrate per
    //1.    Tier
    //2.    Type    
    //3.    Nation
    
function show_selectors(ndx) {
    var disciplineDimNation = ndx.dimension(dc.pluck("Nation"));
    var disciplineSelectNation = disciplineDimNation.group();

    var disciplineDimLevel = ndx.dimension(dc.pluck("Level"));
    var disciplineSelectLevel = disciplineDimLevel.group();

    var disciplineDimType = ndx.dimension(dc.pluck("Type"));
    var disciplineSelectType = disciplineDimType.group();
    
    dc.selectMenu("#Nation_selector")
        .dimension(disciplineDimNation)
        .group(disciplineSelectNation);
        
    dc.selectMenu("#Tier_selector")
        .dimension(disciplineDimLevel)
        .group(disciplineSelectLevel)
        
    dc.selectMenu("#Type_selector")
        .dimension(disciplineDimType)
        .group(disciplineSelectType);
}


function makeGraphsPerTier(error, transactionsData) {
    var List = [];
    var ndx = crossfilter(transactionsData);
    var name_dim = ndx.dimension(dc.pluck('Level'));
    var total_battles = name_dim.group().reduceSum(dc.pluck('Battles'));
    show_selectors(ndx);
    dc.barChart("#per-tier-chart")
        .width(300)
        .height(150)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(name_dim)
        .group(total_battles)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Tier")
        .yAxis().ticks(4);
        
    var name_dim = ndx.dimension(dc.pluck('Nation'));
    var total_battles = name_dim.group().reduceSum(dc.pluck('Battles'));

    dc.barChart("#per-nation-chart")
        .width(300)
        .height(150)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(name_dim)
        .group(total_battles)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Nation")
        .yAxis().ticks(4);
        
        var name_dim = ndx.dimension(dc.pluck('Type'));
    var total_battles = name_dim.group().reduceSum(dc.pluck('Battles'));

    dc.barChart("#per-type-chart")
        .width(300)
        .height(150)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(name_dim)
        .group(total_battles)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Type")
        .yAxis().ticks(4);
        
        dc.renderAll();
        console.log(name_dim)
}

