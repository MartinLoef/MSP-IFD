
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
        xhr.open("GET", "https://api.worldoftanks.eu/wot/encyclopedia/tanks/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e");
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
        document.getElementById("NickName").innerHTML = "Players NickName: " + data['nickname'] ;
        document.getElementById("Account_ID").innerHTML = "Players AccountNumber: " + data['account_id'] ;
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
        document.getElementById("battles").innerHTML = "Battles fought: " + data['battles'];
        document.getElementById("draws").innerHTML = "Battles ended in a draw: " + data['draws'];
        document.getElementById("wins").innerHTML = "Battles ended in a victory: " + data['wins'];
        document.getElementById("losses").innerHTML = "Battles ended in a devastating loss: " + data['losses'];
        document.getElementById("winrate").innerHTML = "Players winrate: " + win ;
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
        makeGraphs(error, myarray)
        console.log(myarray)
    return false;
    });
}

function makeGraphs(error, transactionsData) {
    var List = [];
    
    var ndx = crossfilter(transactionsData);

    var name_dim = ndx.dimension(dc.pluck('Name'));
    var total_battles = name_dim.group().reduceSum(dc.pluck('Amount'));

    dc.pieChart('#win-chart')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(name_dim)
        .group(total_battles);

     dc.renderAll();
}