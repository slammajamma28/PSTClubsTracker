/* Overview Page */
// Create the List of lists
var allLists = 0;
function createListOfLists(){
    for(var i = 0; i < lists.length; i++){
        var thisList = lists[i];
        $("#list-of-lists").append("" +
            "<div class=\"list row\" id=\"list-"+ i +"\" data-list-name=\""+ thisList.listName +"\">" +
            "<a href=\"#\">" +
            "<div class=\"col-xs-6 col-md-1\">" +
            "<img src=\""+ thisList.award +"\" alt=\""+ thisList.listName +" Award Image\" class=\"list-icon\">" +
            "</div>" +
            "" +
            "<div class=\"col-xs-6 col-md-2 col-md-push-9\">" +
            "<h3 class=\"text-right list-progress\"><span class=\"total-earned\">0</span>/<span class=\"total-possible\">"+ thisList.games.length +"</span></h3>" +
            "</div>" +
            "" +
            "<div class=\"col-xs-12 col-md-9 col-md-pull-2\">" +
            "<h3 class=\"list-name\">"+ thisList.listName +"</h3>" +
            "</div>" +
            "</a>" +
            "</div>" +
            "");

        allLists = allLists + parseInt(thisList.games.length);
        $("#all-total").html(allLists);
    }
}

// Update lists' progress
var allEarned = 0;
function updateListProgress(){
    $(".list").each(function(k,v){
        var thisList = $(v).data("list-name");
        if(localStorage.getItem(thisList)){
            var totalEarned = localStorage.getItem(thisList);

            $(this).find(".total-earned").html(totalEarned);
            var totalPossible = $(this).find(".total-possible").html();
            // Add class to style based on progress
            if(totalPossible == 4) {
                var color;
                if(totalEarned == 1){ color = "bronze" }
                if(totalEarned == 2){ color = "silver" }
                if(totalEarned == 3){ color = "gold" }
                if(totalEarned == 4){ color = "platinum" }
                $(this).addClass(color);
            } else {
                var color;
                if(totalEarned > 0){ color = "bronze" }
                if(totalEarned == 3){ color = "silver" }
                if(totalEarned == 4){ color = "gold" }
                if(totalEarned == 5){ color = "platinum" }
                $(this).addClass(color);
            }
        }
    });

    allEarned = 0;
    for(var i = 0; i < $(".total-earned").length; i++){
        allEarned = allEarned + parseInt($("#list-" + i).find(".total-earned").html());
    }
    $("#all-earned").html(allEarned);
    allTotal = $("#all-total");
    var color;
    if(allEarned > allTotal*.1){ color = "bronze" }
    if(allEarned > allTotal*.25){ color = "silver" }
    if(allEarned > allTotal*.5){ color = "gold" }
    if(allEarned > allTotal*.75){ color = "platinum" }
    if(allEarned == allTotal){ color = "perfect" }
    $(".list-totals").addClass(color);
}

// Sorting by list progress
function sortByProgress(){
    var sorted = $("#list-of-lists .list").sort(function (a, b) {
        var contentA = parseInt( $(a).find(".total-earned").text());
        var contentB = parseInt( $(b).find(".total-earned").text());
        return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
    });

    $("#list-of-lists").html(sorted);
}

// Sorting by list name
function sortByName(){
    var sorted = $("#list-of-lists .list").sort(function (a, b) {
        var contentA = $(a).data("list-name");
        var contentB = $(b).data("list-name");
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
    });

    $("#list-of-lists").html(sorted);
}

// Sorting By Games by number of clubs game is in
function sortByGamesNumber() {
    var sorted = $("#game-list .game").sort(function (a, b) {
        var contentA = $(a).data("num-of-clubs");
        var contentB = $(b).data("num-of-clubs");
        return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
    });

    $("#game-list").html(sorted);
}

// Sorting By Games alphabetically
function sortByGamesAlpha() {
    var sorted = $("#game-list .game").sort(function (a, b) {
        var contentA = $(a).data("game-name");
        var contentB = $(b).data("game-name");
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
    });

    $("#game-list").html(sorted);
}

// Toggle between Overview and List
function toggleView(){
    $(".all-games").removeClass("all-games");
    $(".list-of-lists, #list-selected").toggle();
}

function calculate() {
    for(var a = 0; a < lists.length; a++){
        var thisLS = localStorage.getItem(lists[a].listName);
        // console.log(lists[a].listName + " was at " + thisLS);
        var actualEarned = 0;
        for (var b = 0; b < lists[a].games.length; b++) {
            if (localStorage.getItem("c-"+lists[a].games[b].game) != null ) {
                // console.log("Completed Game: " + lists[a].games[b].game);
                actualEarned++;
            }
        }
        if (thisLS > 0 || actualEarned > 0) {
            // console. log(lists[a].listName + " is now at " + actualEarned);
            localStorage.setItem(lists[a].listName, actualEarned);
        }
    }
    // window.location.reload();
}

// Show selected list
var selectedListNumber;
function listSelected(clickedList){
    selectedListNumber = clickedList[0].id.replace("list-","");
    var selectedList = lists[selectedListNumber];
    toggleView();

    // Fill out game List
    var gameCount = 0,
        ownedCount = 0;
    $("#game-list").html("");
    for(var i = 0; i < selectedList.games.length; i++){
        var thisGame = selectedList.games[i],
            gameEarned = null,
            gameOwned = null,
            gameChecked = "",
            ownedChecked = "";

        if(localStorage.getItem("c-" + thisGame.game) == "true"){
            gameEarned = "earned_game";
            gameChecked = "checked=\"true\"";
            gameCount++;
        }

        if(localStorage.getItem("g-" + thisGame.game) == "true"){
            ownedCount++;
            ownedChecked = "checked=\"true\"";
            gameOwned = "own_game";
        }

        /* $("#trophy-list").append("" +
            "<div class=\"trophy "+ trophyEarned +" "+ gameOwned +"\" id=\"trophy-"+ i +"\" data-trophy-name=\""+ thisTrophy.name +"\">" +
            "<div class=\"row\">" +
            "<div class=\"col-sm-12\">" +
            "<h3 class=\"game\" data-game-name=\""+ thisTrophy.game +"\">"+ thisTrophy.game +"</h3>" +
            "</div>" +
            "</div>" +
            "" +
            "<div class=\"row\">" +
            "<div class=\"col-sm-1\">" +
            "<img src=\""+ thisTrophy.imag +"\" alt=\""+ thisTrophy.game +" - "+ thisTrophy.name +"\" class=\"img-responsive\">" +
            "</div>" +
            "<div class=\"col-sm-9\">" +
            "<p><strong class=\"name\">"+ thisTrophy.name +"</strong></p>" +
            "<p>"+ thisTrophy.desc +"</p>" +
            "</div>" +
            "<div class=\"col-sm-1 col-xs-6 text-center\">" +
            "<input type=\"checkbox\" id=\"checkbox-trophy-"+ i +"\" class=\"check-trophy\" "+ trophyChecked +"/>" +
            "<label for=\"checkbox-trophy-"+ i +"\" class=\"label-trophy\">&#10004;</label>" +
            "</div>" +
            "<div class=\"col-sm-1 col-xs-6 text-center\">" +
            "<input type=\"checkbox\" id=\"checkbox-game-"+ i +"\" class=\"check-game\" "+ gameChecked +"/>" +
            "<label for=\"checkbox-game-"+ i +"\" class=\"label-game\">&#10004;</label>" +
            "</div>" +
            "</div>" +
            "</div>" +
            ""); */
            $("#game-list").append("" +
            "<div class=\"game "+ gameEarned +" "+ gameOwned +"\" id=\"game-"+ i +"\" data-game-name=\""+ thisGame.game +"\">" +
            "<div class=\"row\">" +
            "<div class=\"col-sm-12\">" +
            "<h3></h3>" +
            "</div>" +
            "</div>" +
            "" +
            "<div class=\"row\">" +
            "<div class=\"col-sm-1\">" +
            "<img src=\""+ thisGame.imag +"\" alt=\""+ thisGame.game +"\" class=\"img-responsive\">" +
            "</div>" +
            "<div class=\"col-sm-9\">" +
            "<h3 class=\"game\" data-game-name=\""+ thisGame.game +"\">"+ thisGame.game +"</h3>" +
            "</div>" +
            "<div class=\"col-sm-1 col-xs-6 text-center\">" +
            "<input type=\"checkbox\" id=\"checkbox-game-"+ i +"\" class=\"check-game\" "+ gameChecked +"/>" +
            "<label for=\"checkbox-game-"+ i +"\" class=\"label-trophy\">&#10004;</label>" +
            "</div>" +
            "<div class=\"col-sm-1 col-xs-6 text-center\">" +
            "<input type=\"checkbox\" id=\"checkbox-owned-"+ i +"\" class=\"check-owned\" "+ ownedChecked +"/>" +
            "<label for=\"checkbox-owned-"+ i +"\" class=\"label-game\">&#10004;</label>" +
            "</div>" +
            "</div>" +
            "</div>" +
            ""); 
            
    }

    // Fill out header
    $("#list-header")
        .html("" +
            "<div class=\"content\">" +
            "<h2 id=\"list_name\">"+ selectedList.listName +"</h2>" +
            "<img src=\""+ selectedList.award +"\" alt=\""+ selectedList.listName +" Site Award\">" +
            "<<h3></h3>" +
            "<p>" + selectedList.blurb + "</p>" +
            "<h3><span id=\"game_count\">"+ gameCount +"</span>/<span id=\"owned_count\">"+ ownedCount +"</span>/"+ selectedList.games.length +"</h3>" +
            "</div>" +
            "");
        //.attr("style","background: url('img/headerbg.png') repeat, url('"+ selectedList.banner +"') no-repeat; background-size: auto, cover;");

    // Reset hide/show button
    /*$("#hide_collected").html("Hide &#10004;");
     hide_toggle = 0;
     $("input.check-trophy:checked").each(function(){
     $(this).closest(".trophy").show();
     });*/

}


/* Trophy list page */
// Hide/Show collected trophies
function hideCollected(){
    $("input.check-game:checked").closest(".game").toggle();
    $(".collected-shown").toggle();
}

// BBCode
// function getBbcode(){
    // $("#bbcode").find("pre").append("" +
        // "[B]" + $("#list_name").text() + "[/B] - " + $("input.check-game:checked").length + "/" + $(".trophy").length +
        // "\n[SPOILER='A" + Math.floor(Math.random() * (100000 + 1)) + "']" +
        // "\n[LIST=1]" +
        // "");
    // $(".check-game").each(function(k,v){
        // if(this.checked){
            // $("#bbcode pre").append("" +
                // "\n[*][B]" + $(v).closest(".trophy").find(".game").text() + "[/B] - [I]" + $(v).closest(".trophy").find(".name").text() + "[/I]" +
                // "");
        // }
    // });
    // $("#bbcode").find("pre").append("" +
        // "\n[/LIST]\n[/SPOILER]\n\n" +
        // "");
    // $("#bbcode, #reset_bbcode").show();
// }

// function resetBbcode(){
    // $("#bbcode").find("pre").html("");
    // $("#bbcode, #reset_bbcode").hide();
// }

// Click Trophy Checkbox
function saveTrophy(e) {
    var gamesChecked = $('input.check-game:checked').length,
        checked = e.target.checked,
        thisGame = $(e.target).closest(".game").data("game-name");

    $(e.target).closest(".game").toggleClass("earned_game");
    $("#game_count").html(gamesChecked);

    if(checked){
        localStorage.setItem("c-" + thisGame, true);
    } else {
        localStorage.removeItem("c-" + thisGame);
    }

    if(gamesChecked > 0){
        localStorage.setItem($("#list_name").html(), gamesChecked);
    } else {
        localStorage.removeItem($("#list_name").html());
    }

    updateListProgress();
}

// Click Game Checkbox
function saveOwned(e) {
    var ownedChecked = $('input.check-owned:checked').length,
        checked = e.target.checked,
        thisOwned = $(e.target).closest(".game").find(".game").data("game-name");

    $("#owned_count").html(ownedChecked);
    $(e.target).closest(".game").toggleClass("own_game");

    if(checked){
        localStorage.setItem("g-" + thisOwned, true);
    } else {
        localStorage.removeItem("g-" + thisOwned);
    }
}


/* Document ready */
$(document).ready(function () {

    /* On page load */
    createListOfLists();
    updateListProgress();


    /* Overview */
    $("#list-of-lists").on("click", ".list:not(.data-row)", function(){
        listSelected($(this));
    });


    /* Trophy list page */
    $(".hide-collected").click(function(){
        hideCollected();
    });
    $(".get-bbcode").click(function(){
        getBbcode();
    });
    $(".reset-bbcode").click(function(){
        resetBbcode();
    });

    $("#game-list").on("click", ".check-game", function(e){
        saveTrophy(e);
    });
    $("#game-list").on("click", ".check-owned", function(e){
        saveOwned(e);
    });


    /* Shared */
    $(".toggle-view").click(function(){
        toggleView();
    });

    /* Testing */
    function sort_unique(arr) {
        return arr.sort(function(a,b){
            return (a > b) ? 1 : -1;
        }).filter(function(el,i,a) {
            return (i==a.indexOf(el));
        });
    }

    // console.log(lists);
    var gamesList = [];
    for(var a = 0; a < lists.length; a++){
        // console.log(lists[a].trophies);
        for(var b = 0; b < lists[a].games.length; b++){
            var gameName = lists[a].games[b].game;
            gamesList.push(gameName);
        }
    }
    gamesList = sort_unique(gamesList);

    $(".update-numbers").click(function(){
        calculate();
    });

    $(".get-games").click(function(){
        toggleView();

        $("#list-header").hide();
        $(".container.game_list.top").css("margin-top","20px");
        // $(".container.game_list.top").html("<div class='col-xs-12'><p>Refresh the page to go back.</p>" +
        // "<div class=\"col-sm-1 col-xs-6 text-center\"><p class=\"no-margin\"><strong>DONE</strong></p></div>" +
        // "<div class=\"col-sm-1 col-xs-6 text-center\"><p class=\"no-margin\"><strong>OWNED</strong></p></div></div>");

        $(".container.game_list.top").html("<div class='col-xs-6'><strong>Refresh the page to go back.</strong></div>" +
        "<div class='col-xs-2 text center'><a href=\"#\" onclick=\"sortByGamesAlpha()\">Sort Alphabetically</a></div>" +
        "<div class='col-xs-2 text center'><a href=\"#\" onclick=\"sortByGamesNumber()\">Sort By Num of Clubs</a></div>" +
        "<div class='col-xs-1 text-center'><strong>DONE</strong></div>" + 
        "<div class='col-xs-1 text-center'><strong>OWNED</strong></div>");

        //

        // Fill out trophy List
        var gameCount = 0,
            ownedCount = 0;
        $("#game-list").html("");

        for(var i = 0; i < gamesList.length; i++){
            var gameGOT= "",
            gameOWN= "",
        	currentGame = gamesList[i];
        	
        	if(localStorage.getItem("c-" + currentGame)){
            	gameGOT = "checked";
            }
            if(localStorage.getItem("g-" + currentGame)) {
                gameOWN = "checked";
            }

            $("#game-list").addClass("all-games").append("" +
                "<div id=\"game-list-"+ i +"\" class='game all-games' data-num-of-clubs=0 data-game-name=\"" + currentGame + "\">" +
                "<div class=\"row\">" +
                "<div class=\"col-sm-10\">" +
                "<h3>" + currentGame + "</h3>" +
                "</div>" +
                "<div class=\"col-sm-1 col-xs-3 text-center all-games-game\" style=\"padding: 2px 7px;\">" +
                "<input type=\"checkbox\" id=\"bygame-checkbox-game-"+ i + "\" class=\"bygame-check-game\" data-game-name=\"c-" + currentGame + "\" " + gameGOT + "/>" +
                "<label for=\"bygame-checkbox-game-"+ i + "\" class=\"label-game\">&#10004;</label>" +
                "</div>" + 
                "<div class=\"col-sm-1 col-xs-3 text-center all-games-game\" style=\"padding: 2px 7px;\">" +
                "<input type=\"checkbox\" id=\"bygame-checkbox-own-"+ i + "\" class=\"bygame-check-game\" data-game-name=\"g-" + currentGame + "\" " + gameOWN + "/>" +
                "<label for=\"bygame-checkbox-own-"+ i + "\" class=\"label-game\">&#10004;</label>" +
                "</div>" +
                "</div>" +
                "" +
                "<div class=\"row game-list-lists\">" +
                "<div class=\"col-sm-12\">" +
                "</div>" +
                "</div>" +
                "</div>" +
                "");

        }
            
        // Iterate over games and add the lists they show up in
        for(var a = 0; a < lists.length; a++){
            for(var b = 0; b < lists[a].games.length; b++){
                var gameName = lists[a].games[b].game,
                    listName = lists[a].listName;

                if($.inArray(gameName, gamesList) >= 0){
                    var gameID = $.inArray(gameName, gamesList);
                    
                    // Increase data attr so we can sort on it
                    var addOneTo = parseInt($("#game-list-" + gameID).attr('data-num-of-clubs'));
                    $("#game-list-" + gameID).attr('data-num-of-clubs', addOneTo + 1);

                    $("#game-list-" + gameID).find(".game-list-lists .col-sm-12").append("" +
                    "<div class=\"row game-list-lists\">" +
                    "<div class=\"col-xs-12 all-games-game\">" +
                    // "<input type=\"checkbox\" id=\"bygame-checkbox-trophy-"+ a +"-" + b + "\" class=\"bygame-check-trophy game\" data-trophy-name=\"t-" + trophyName + "\" "+ trophyGOT +"/>" +
                    "<h4 class=\"dark-mode game-list-list-name "+ listName.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLocaleLowerCase() +"\">" + listName + "</h4>" +
                    "</div>" +
                    "</div>" +
                    "");
                    // $("." + listName.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLocaleLowerCase()).parent().find(".listsList").append("<p><em>"+ listName +"</em></p>");
                }

                // // Remove duplicate instances of a trophy per game
                // $("." + gameName.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLocaleLowerCase() + ":not(:first)").parent().remove();
            }
        }

        // Go back and add number of lists next to game name
        var totalGameIDs = $(".game.all-games").length;
        for (var c = 0; c < totalGameIDs; c++) {
            var xx = $("#game-list-" + c).data("num-of-clubs");
            $("#game-list-" + c).find("h3").append("&nbsp;&nbsp;&nbsp;[" + xx + "]");
        }
    });

    // Click game on all games list, show trophies
    $("#game-list").on("click", ".all-games>.row:first-of-type", function(e){
        $(this).parent().find(".game-list-lists").slideToggle(200).parent().toggleClass("active");
    });

    $("#game-list").on("click", ".bygame-check-game", function(e){
        var checked = e.target.checked,
            thisGame = $(this).data("game-name");

        if(checked){
            localStorage.setItem(thisGame, true);
        } else {
            localStorage.removeItem(thisGame);
        }
    });
});