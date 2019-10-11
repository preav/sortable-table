function getApi() {
  const apiUrl = "https://restcountries.eu/rest/v2/all";
  const request = new XMLHttpRequest();
  request.open("GET", apiUrl, true);
  request.onload = function() {
    let data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      window.response = data;
      createTable(data);
    } else {
      console.log("An error occurred");
    }
  };
  request.send();
}

function populateUpdatedTable(event) {
  const pageNumber = getPageNumber(event);
  const pageSize = getPageSize();
  createTable(window.response, pageNumber, pageSize);
}

function getPageNumber(event) {
  const pageNumber = event ? event.target.innerText : 1;
  return pageNumber;
}

function getPageSize() {
  const componentSelect = document.getElementsByClassName(
    "component__entries"
  )[0];
  const selectedOption = componentSelect.children[0];
  const selectedValue = Number.parseInt(
    selectedOption.options[selectedOption.selectedIndex].value
  );
  return selectedValue;
}

function createTable(data, pageNumber, pageSize) {
  pageSize = pageSize ? pageSize : 50;
  const paginatedAllData = paginate(data, pageNumber, pageSize);
  const items = paginatedAllData.items;
  const startIndex = paginatedAllData.startIndex;
  const endIndex = paginatedAllData.endIndex;
  populateTable(items);
  setFooter(startIndex, endIndex, data.length, pageSize);
  document
    .getElementsByClassName("component__table-head")[0]
    .addEventListener("click", event => sortByColumn(event, data));
}

function populateTable(items) {
  const tableBody = document.getElementsByClassName("component__table-body")[0];
  let tableBodyRow = ``;
  for (let i = 0; i < items.length; i++) {
    tableBodyRow += `<tr>
    <td>${items[i].name}</td>
    <td>${items[i].capital}</td>
    <td>${items[i].region}</td>
    <td>${items[i].area}</td>
    <td>${items[i].numericCode}</td>
    </tr>`;
    tableBody.innerHTML = tableBodyRow;
  }
}

function setFooter(startIndex, endIndex, length, pageSize) {
  const footer = document.getElementsByClassName("component__footer")[0];
  footer.innerHTML = `<p>Showing ${startIndex} to ${endIndex} of ${length} entries`;
  const pageNav = arrayGenerate(length / pageSize);
  footer.innerHTML += pageNav;
}

function paginate(items, pageNumber, pageSize) {
  const currentPageNumber = pageNumber ? pageNumber : 1;
  const startIndex = (currentPageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageObj = {
    items: items.slice(startIndex, endIndex),
    startIndex,
    endIndex
  };
  return pageObj;
}

function sortByColumn(event, items) {
  const sortedTable = sort(items, event.target.className);
  const pageSize = getPageSize();
  createTable(sortedTable, null, pageSize);
}

function sort(arr, path) {
  const sortBy = path;
  return arr.sort((a, b) =>
    a[sortBy] > b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0
  );
}

function arrayGenerate(pagesCount) {
  let pageNav = ``;
  for (let i = 1; i <= pagesCount; i++) {
    pageNav += `<button class="component__footer-nav">${i}</button>`;
  }
  return pageNav;
}

function getUpdatedPageSize() {}

(function init() {
  getApi();
  const componentEnteries = document.getElementsByClassName(
    "component__entries"
  )[0];
  componentEnteries.addEventListener("change", () => populateUpdatedTable());

  const pageBtns = document.getElementsByClassName("component__footer");
  Array.from(pageBtns).map(pageBtn =>
    pageBtn.addEventListener("click", event => populateUpdatedTable(event))
  );
})();
