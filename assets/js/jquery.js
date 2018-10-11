$(document).ready(function() {
    $('#Nation_selector').change(function(){
        var Nation = $('#Nation_selector').val();
        var Type = $('#Type_selector').val();
        var Tier = $('#Tier_selector').val();
        if (Nation != "All"){
            if ((Nation != "All") && (Tier != "All")){
                myArray = $.parseJSON($('#trunkArraySelectBackup').val());
            } else {
                myArray = $.parseJSON($('#trunkArraySelect').val());
            }
            MakeNewSelectionArrayNation(Nation, myArray, Type, Tier)
            $('#Nation_selector').prop('disabled', 'disabled');
             $('#Nation_selector').css("background-color", "orange")
        } else {
            //todefine
        }
         
        });
    $('#Type_selector').change(function(){
        var Nation = $('#Nation_selector').val();
        var Type = $('#Type_selector').val();
        var Tier = $('#Tier_selector').val();
        if (Type != "All"){
            if ((Nation != "All") && (Tier != "All")){
                myArray = $.parseJSON($('#trunkArraySelectBackup').val());
            } else {
                myArray = $.parseJSON($('#trunkArraySelect').val());
            }
            console.log(myArray);
            MakeNewSelectionArrayType(Type, myArray, Nation, Tier)
            $('#Type_selector').prop('disabled', 'disabled');
            $('#Type_selector').css("background-color", "orange")
        } else {
            //todefine
        }
        
        });
    $('#Tier_selector').change(function(){
        var Nation = $('#Nation_selector').val();
        var Type = $('#Type_selector').val();
        var Tier = $('#Tier_selector').val();
        if (Tier != "All"){
            if ((Nation != "All") && (Type != "All")){
                myArray = $.parseJSON($('#trunkArraySelectBackup').val());
            } else {
                myArray = $.parseJSON($('#trunkArraySelect').val());
            }
            console.log(myArray);
            MakeNewSelectionArrayTier(Tier, myArray, Nation, Type)
            $('#Tier_selector').prop('disabled', 'disabled');
            $('#Tier_selector').css("background-color", "orange")
        } else {
            //todefine
        }
        
        });
});

function MakeNewSelectionArrayNation(Nation, TankArray, Type, Tier){
var SelectionArrayNation = [];
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
    
    var stringie =  JSON.stringify(TankArray)
    document.getElementById("trunkArraySelectBackup").value = stringie;
    
    var stringie =  JSON.stringify(SelectionArrayNation)
    document.getElementById("trunkArraySelect").value = stringie;
    if (Tier == "All"){
        GetUniqueTier(SelectionArrayNation);
    }
    if (Type == "All"){
        GetUniqueType(SelectionArrayNation);
    } 
}

function MakeNewSelectionArrayType(Type, TankArray, Nation, Tier){
var SelectionArrayType = [];
    if (Type != "All") {
        Object.keys(TankArray).forEach(function(key){
            var TypeA = TankArray[key].Type;
            
            //makeNewArray if Nation selector is used
            if (TypeA == Type){
                SelectionArrayType.push({
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
        SelectionArrayType = TankArray;
    }
    
    var stringie =  JSON.stringify(TankArray)
    document.getElementById("trunkArraySelectBackup").value = stringie;
    
    var stringie =  JSON.stringify(SelectionArrayType)
    document.getElementById("trunkArraySelect").value = stringie;
    if (Tier == "All"){
        GetUniqueTier(SelectionArrayType);
    }
    if (Nation == "All"){
        GetUniqueNation(SelectionArrayType);
    }
}

function MakeNewSelectionArrayTier(Level, TankArray, Nation, Type){
var SelectionArrayTier = [];
    if (Level != "All") {
        Object.keys(TankArray).forEach(function(key){
            var LevelA = TankArray[key].Level;
            
            //makeNewArray if Nation selector is used
            if (LevelA == Level){
                SelectionArrayTier.push({
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
        SelectionArrayTier = TankArray;
    }
    
    var stringie =  JSON.stringify(TankArray)
    document.getElementById("trunkArraySelectBackup").value = stringie;
    
    var stringie =  JSON.stringify(SelectionArrayTier)
    document.getElementById("trunkArraySelect").value = stringie;
    if (Type == "All"){
        GetUniqueType(SelectionArrayTier);
    }
    if (Nation == "All"){
        GetUniqueNation(SelectionArrayTier);
    }
}