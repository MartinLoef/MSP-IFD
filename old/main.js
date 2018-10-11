
//-----------------------------------------------------------------------------------------------------print to console works!!!
// function getData(callback) {
//     var xhr = new XMLHttpRequest();

//     xhr.open("GET", "https://api.worldoftanks.eu/wot/encyclopedia/tanks/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&fields=level%2C+type%2C+nation%2C+name");
//     xhr.send();

//     xhr.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             callback(JSON.parse(this.responseText));
//             // callback(this.responseText);
//         }
//     };
// }

// function printDataToConsole(data) {
//     console.log(data);
// }

// getData(printDataToConsole);
//-----------------------------------------------------------------------------------------------------print to console works!!!


//-----------------------------------------------------------------------------------------------------print json object to screen works!!!
// const baseURL = "https://api.worldoftanks.eu/wot/account/list/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&";

// function getData(type, cb) {
//     var xhr = new XMLHttpRequest();

//     xhr.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             cb(JSON.parse(this.responseText));
//         }
//     };

//     xhr.open("GET", baseURL + type + "/");
//     xhr.send();
// }

// function writeToDocument(type) {
//     getData(type, function(data) {
//         document.getElementById("data").innerHTML = data;
//     });
// }
//-----------------------------------------------------------------------------------------------------print json object to screen works!!!

//-----------------------------------------------------------------------------------------------------print values of object to screen works!!!
// const baseURL = "https://api.worldoftanks.eu/wot/account/list/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&";

// function getData(type, cb) {
//     var xhr = new XMLHttpRequest();

//     xhr.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             cb(JSON.parse(this.responseText));
//         }
//     };

//     xhr.open("GET", baseURL + type);
//     xhr.send();
// }

// function writeToDocument(type) {
//     var el = document.getElementById("data");
//     el.innerHTML = "";
    
//     getData(type, function(data) {
//         data = data.data;
        
//         data.forEach(function(item){
//             el.innerHTML += "<p>" + item.nickname + "</p>"
//             el.innerHTML += "<p>" + item.account_id + "</p>"
//             // document.getElementById("data").innerHTML = item.account_id;
//         })
//     });
// }
//-----------------------------------------------------------------------------------------------------print values of object to screen works!!!
// https://api.worldoftanks.eu/wot/account/info/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&account_id=509193187

//-----------------------------------------------------------------------------------------------------print values to table on screen works!!!
// const baseURL = "https://api.worldoftanks.eu/wot/account/list/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&";

// function getData(type, cb) {
//     var xhr = new XMLHttpRequest();

//     xhr.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             cb(JSON.parse(this.responseText));
//         }
//     };

//     xhr.open("GET", baseURL + type);
//     xhr.send();
// }

// function getTableHeaders(obj) {
//     var tableHeaders = [];

//     Object.keys(obj).forEach(function(key) {
//         tableHeaders.push(`<td>${key}</td>`);
//     });

//     return `<tr>${tableHeaders}</tr>`;
// }

// function writeToDocument(type) {
//     var tableRows = [];
//     var el = document.getElementById("data");
//     var pagination = "";
//     getData(type, function(data) {
        
//         data = data.data;
//         console.log(data)
//         var tableHeaders = getTableHeaders(data[0]);

//         data.forEach(function(item) {
//             var dataRow = [];

//             Object.keys(item).forEach(function(key) {
//                 var rowData = item[key].toString();
//                 var truncatedData = rowData.substring(0, 15);
//                 dataRow.push(`<td>${truncatedData}</td>`);
//             });
//             tableRows.push(`<tr>${dataRow}</tr>`);
//         });

//         el.innerHTML = `<table>${tableHeaders}${tableRows}</table>`;
//         el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, "");
//     });
// }
//-----------------------------------------------------------------------------------------------------print values to table on screen works!!!
//-----------------------------------------------------------------------------------------------------print values of account_id to screen
// const baseURL = "https://api.worldoftanks.eu/wot/account/list/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&";
// //https://api.worldoftanks.eu/wot/account/info/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&account_id=509193187&fields=global_rating%2C+statistics
// function getData(type, cb) {
//     var xhr = new XMLHttpRequest();

//     xhr.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             cb(JSON.parse(this.responseText));
//         }
//     };
//     // xhr.open("GET", "https://api.worldoftanks.eu/wot/account/info/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&account_id=509193187&fields=global_rating%2C+statistics")
//     // xhr.open("GET", baseURL + type);
//     xhr.send();
// }

//     function writeToDocument(type) {
//     getData(type, function(data) {
        
//         data = data.data[509193187].statistics.all;
//         // data = data.data;
//         console.log(data)
//         var win = data['wins'] / data['battles'] ;
        
//         document.getElementById("data").innerHTML = data;
        
//         document.getElementById("battles").innerHTML = "Battles fought: " + data['battles'];
//         document.getElementById("draws").innerHTML = "Battles ended in a draw: " + data['draws'];
//         document.getElementById("wins").innerHTML = "Battles ended in a victory: " + data['wins'];
//         document.getElementById("losses").innerHTML = "Battles ended in a devastating loss: " + data['losses'];
//         document.getElementById("winrate").innerHTML = "Players winrate: " + win ;
//     });
// }
//-----------------------------------------------------------------------------------------------------print values of account_id to screen



//------------------------------------------------working code  for variable input field
const baseURL = "https://api.worldoftanks.eu/wot/account/list/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&";

function getData(type, cb) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
    };
    
    xhr.open("GET", baseURL + type);
    xhr.send();
}

function getData2(type, cb) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
    };
    var urlextended =  "https://api.worldoftanks.eu/wot/account/info/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&" +  type + "&fields=global_rating%2C+statistics"
    console.log(urlextended);
    // console.log("https://api.worldoftanks.eu/wot/account/info/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&account_id=509193187&fields=global_rating%2C+statistics")
    //xhr.open("GET", "https://api.worldoftanks.eu/wot/account/info/?application_id=5d6d1657c5bc736658f1e6aa3dcb5f6e&account_id=509193187&fields=global_rating%2C+statistics")
    //xhr.open("GET", baseURL + type + fieldspec);
    xhr.open("GET", urlextended);
    xhr.send();
    console.log(cb);
}

function writeToDocument() {
    
    var type = "search=" + document.getElementById("uname").value;
    
    getData(type, function(data) {
        data = data.data["0"];
        // data = data.data;
        // console.log(data)
        document.getElementById("NickName").innerHTML = "Players NickName: " + data['nickname'] ;
        document.getElementById("Account_ID").innerHTML = "Players AccountNumber: " + data['account_id'] ;
        
        var type2 = "account_id=" + data['account_id'];
        
        getData2(type2, function(data2) {
            console.log(data2)
            var account = type2.substr(11, 9);
            data2 = data2.data[account].statistics.all;
            console.log(data2)
            var win = data2['wins'] / data2['battles'] ;
            // document.getElementById("data").innerHTML = data;
            document.getElementById("battles").innerHTML = "Battles fought: " + data2['battles'];
            document.getElementById("draws").innerHTML = "Battles ended in a draw: " + data2['draws'];
            document.getElementById("wins").innerHTML = "Battles ended in a victory: " + data2['wins'];
            document.getElementById("losses").innerHTML = "Battles ended in a devastating loss: " + data2['losses'];
            document.getElementById("winrate").innerHTML = "Players winrate: " + win ;
        
    return false;
    });
        
    return false;
    });
    
    
}

//------------------------------------------------working code for variable input field

