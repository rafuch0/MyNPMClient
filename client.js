var socket = io.connect("http://npmsearch.example.com:8083");
var searchResultsData = new Array();
var searchResultsText = new Array();

socket.on('searchResults', recieveSearchResults);
setInterval(updatePage, 3000);

var lastData;
function recieveSearchResults(data)
{
lastData = data;

	var response = "";
	if(data.type === "searchResults")
	{
		searchResultsData.push(data);
	}

	updateData();
}

function searchNPM()
{
	socket.emit("search", { term: document.getElementById("searchTerm").value });
}

function updateData()
{
	searchResultsText = [];

	var resultsData;

	if(searchResultsData)
	for (var i=0; i < searchResultsData.length; i++)
	{
		resultsData = searchResultsData[i];

		if(resultsData.type === "searchResults")
		{
			data = resultsData.searchResults;

			var str = ""+JSON.stringify(data);
			searchResultsText.push(str);
		}
	}

	searchResultsData = [];
}

function updatePage()
{
	var element;
	var searchResultsAreaData = "";

	if(searchResultsText)
	for (var i = 0; i < searchResultsText.length; i++)
	{
		searchResultsAreaData += searchResultsText[i];
	}

	if(searchResultsAreaData != "")
	{
		element = document.getElementById("searchResultsArea");
		element.innerHTML = searchResultsAreaData;
	}
}
