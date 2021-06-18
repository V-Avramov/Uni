function insertNewRow(currentRowIndexString) {
    let currentRowIndex = parseInt(currentRowIndexString);

    let newRow = tbl.insertRow(currentRowIndex + 1);

    for (let i = 0; i < tbl.rows[currentRowIndex].cells.length; i++) {
        let newCell = newRow.insertCell(i);
        if (i != 0) {
            newCell.classList = "table-cell";
            newCell.setAttribute('contenteditable', '');
            newCell.id = columnToLetter(i).toString() + (currentRowIndex + 1).toString(); 
            newCell.classList.add(columnToLetter(i));                    
            newCell.classList.add((currentRowIndex + 1).toString());  
            newCell.addEventListener('contextmenu', () => { 
                openContextMenu(newCell);
            });   

            newCell.addEventListener('input', () => {
                if (conn != null) {
                    conn.send("changeCell-" + newCell.id + "-" + newCell.innerText);
                }
            });

            conn.send("editServerCellsArray-" + newCell.id + "-" + "");
            conn.send("editServerCellsCSSArray-" + newCell.id + "-" + "");
        }
        else {
            newCell.textContent = currentRowIndex.toString();
            newCell.classList = "row-index";
            newCell.addEventListener("contextmenu", () => {
                openRowContextMenu(newCell);
            });
        }
    }
}

function insertNewColumn(currentColumnIndex) {
    let columnIndex = parseInt(currentColumnIndex) + 1;

    for (let i = 0; i < tbl.rows.length; i++) {
        let newCell = tbl.rows[i].insertCell(columnIndex);
        if (i != 0) {
            newCell.classList = "table-cell";
            newCell.setAttribute('contenteditable', '');
            newCell.id = columnToLetter(columnIndex) + i.toString();
            newCell.classList.add(columnToLetter(columnIndex));
            newCell.classList.add(i.toString());
            newCell.addEventListener('contextmenu', () => {
                openContextMenu(newCell);
            });

            newCell.addEventListener('input', () => {
                if (conn != null) {
                    conn.send("changeCell-" + newCell.id + "-" + newCell.innerText);
                }
            });

            conn.send("editServerCellsArray-" + newCell.id + "-" + "");
            conn.send("editServerCellsCSSArray-" + newCell.id + "-" + "");
        }
        else {
            newCell.textContent = columnToLetter(columnIndex);
            newCell.classList = "column-index";
            newCell.addEventListener("contextmenu", () => {
                openColumnContextMenu(newCell);
            });
        }
    }
}

function fixFollowingRows(currentRowIndexString) {
    let currentRowIndex = parseInt(currentRowIndexString);

    for (let i = currentRowIndex + 1; i < tbl.rows.length; i++) {
        for (let j = 0; j < tbl.rows[i].cells.length; j++) {
            if (j == 0) {
                tbl.rows[i].cells[0].textContent = (parseInt(tbl.rows[i].cells[0].textContent) + 1).toString();
            }
            else {
                tbl.rows[i].cells[j].classList.remove(i-1);
                tbl.rows[i].cells[j].classList.add(i);
                tbl.rows[i].cells[j].id = columnToLetter(j) + i.toString();

                conn.send("editServerCellsArray-" + tbl.rows[i].cells[j].id + "-" + tbl.rows[i].cells[j].innerText);
                conn.send("editServerCellsCSSArray-" + tbl.rows[i].cells[j].id + "-" + tbl.rows[i].cells[j].style.cssText);
            }
        }
    }
}

function fixFollowingColumns(currentColumnIndexString) {
    let currentColumnIndex = parseInt(currentColumnIndexString);

    for (let i = 0; i < tbl.rows.length; i++) {
        for (let j = currentColumnIndex + 1; j < tbl.rows[i].cells.length; j++) {
            if (i == 0) {
                tbl.rows[i].cells[j].textContent = columnToLetter(j);
            }
            else {
                tbl.rows[i].cells[j].classList.remove(columnToLetter(j-1));
                tbl.rows[i].cells[j].classList.add(columnToLetter(j));
                tbl.rows[i].cells[j].id = columnToLetter(j) + i.toString();

                conn.send("editServerCellsArray-" + tbl.rows[i].cells[j].id + "-" + document.getElementById(tbl.rows[i].cells[j].id).innerText);
                conn.send("editServerCellsCSSArray-" + tbl.rows[i].cells[j].id + "-" + tbl.rows[i].cells[j].style.cssText);
            }
        }
    }
}

function createCell(cell, text) {
    let div = document.createElement('div');
    let txt =document.createTextNode(text);
    div.appendChild(txt);
    cell.appendChild(div);
}