let deleteTableCell;

document.addEventListener('DOMContentLoaded', () => {
    const unitCategoryElement = document.getElementById('unit-category');
    unitCategoryElement.addEventListener('change', changeUnitCategoryEvent);
    
    document.getElementById('magnitude-from').addEventListener('input', convertEvent);
    conversionInputsEventListener();
    convertEvent();

    document.getElementById('save-conversion').addEventListener('click', saveConversionEvent);
});


document.addEventListener('click', (event) => {
    if (event.target.tagName !== 'TD') { return }

    const myDialog = document.getElementById('modal-dialog');
    myDialog.showModal();

    deleteTableCell = event.target;
    let deleteButton = document.getElementById('confirm-delete');
    deleteButton.addEventListener('click', deleteSavedConversion);
    
})


async function deleteSavedConversion() {
    deleteTableCell.parentNode.remove();

    const myDialog = document.getElementById('modal-dialog');
    myDialog.close();
}


async function deleteAllEvent() {
    const myDialog = document.getElementById('delete-all-dialog');
    myDialog.showModal();
}


async function deleteAllConversions() {
    let tableBody = document.getElementById('saved-conversions');
    tableBody.innerHTML = "";
}


async function changeUnitCategoryEvent(event) {
    const unitCategory = event.target.value;
    const currentUnitFromElement = document.getElementById('unit-from').parentElement;
    const currentUnitToElement = document.getElementById('unit-to').parentElement;

    const templateElement = document.getElementById(unitCategory);

    const unitFromElement = templateElement.cloneNode(true);
    unitFromElement.removeAttribute('id', '');
    unitFromElement.querySelector('label').setAttribute('for', 'unit-from');
    unitFromElement.querySelector('select').setAttribute('name', 'unit-from');
    unitFromElement.querySelector('select').setAttribute('id', 'unit-from');
    currentUnitFromElement.parentNode.replaceChild(unitFromElement, currentUnitFromElement);

    const unitToElement = templateElement.cloneNode(true);
    unitToElement.removeAttribute('id', '');
    unitToElement.querySelector('label').setAttribute('for', 'unit-to');
    unitToElement.querySelector('select').setAttribute('name', 'unit-to');
    unitToElement.querySelector('select').setAttribute('id', 'unit-to');
    currentUnitToElement.parentNode.replaceChild(unitToElement, currentUnitToElement);
    
    conversionInputsEventListener();

    document.getElementById('magnitude-from').value = 1.0;
    convertEvent();

    document.getElementById('unit-from').focus();
}


function conversionInputsEventListener() {
    document.getElementById('unit-from').addEventListener('change', convertEvent);
    document.getElementById('unit-to').addEventListener('change', convertEvent);
}


async function convertEvent() {
    const fromUnit = document.getElementById('unit-from').value;
    const toUnit = document.getElementById('unit-to').value;
    const value = document.getElementById('magnitude-from').value;

    let convertedValue = convertUnit(value, fromUnit, toUnit);
    document.getElementById('magnitude-to').setAttribute('value', convertedValue);
}


async function saveConversionEvent() {
    const fromUnit = document.getElementById('unit-from').value;
    const toUnit = document.getElementById('unit-to').value;
    const fromValue = parseFloat(document.getElementById('magnitude-from').value);
    const toValue = parseFloat(document.getElementById('magnitude-to').value);

    if (!fromUnit || !toUnit || !fromValue || !toValue) {
        console.warn('Cannot save! One or more value(s) missing!');
        return
    }
    const fromValueRounded = fromValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    });

    let fromTableCell = document.createElement('td');
    fromTableCell.innerHTML = `${fromValueRounded} ${fromUnit}`

    const toValueRounded = toValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    });

    let toTableCell = document.createElement('td');
    toTableCell.innerHTML = `${toValueRounded} ${toUnit}`;

    let newRow = document.createElement('tr');

    newRow.appendChild(fromTableCell);
    newRow.appendChild(toTableCell);

    const tableBody = document.getElementById('saved-conversions');
    tableBody.insertBefore(newRow, tableBody.firstChild);
}