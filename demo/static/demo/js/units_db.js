const HIDDEN_CLASS = 'hidden';
const MAIN_OPACITY_DIMMED = 0.3;
const MAIN_OPACITY_NORMAL = 1.0;

function closeAllPopups(exceptPopup) {
    const allPopups = document.querySelectorAll("div.popup-menu");
    allPopups.forEach((popup) => {
        if (popup !== exceptPopup) {
            popup.classList.add(HIDDEN_CLASS);
        }
    });
    
    if(!exceptPopup) {
        document.querySelector('main').style.opacity = MAIN_OPACITY_NORMAL;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const menuElems = document.querySelectorAll("[ax-menu]");
    menuElems.forEach((menuElem) => {
        menuElem.addEventListener('click', toggleMenu);
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
        closeAllPopups();
        }
    });
});

function toggleMenu(event) {
    event.preventDefault();
    const menuElem = event.target;
    const targetPopupID = menuElem.getAttribute('ax-menu');
    const targetPopup = document.getElementById(targetPopupID);
    const mainElem = document.querySelector('main');

    if (!targetPopup) return;

    if (targetPopup.classList.contains(HIDDEN_CLASS)) {
        const rect = menuElem.getBoundingClientRect();
        targetPopup.style.left = rect.right + 'px';
        targetPopup.style.top = rect.top + 'px';
        mainElem.style.opacity = MAIN_OPACITY_DIMMED;
    } else {
        mainElem.style.opacity = MAIN_OPACITY_NORMAL;
    }
    targetPopup.classList.toggle(HIDDEN_CLASS);

    closeAllPopups(targetPopup);
}
            
const userUnits = new Map();

class convFactor {
    constructor(unit, siUnit, repr, m, a, b, gauge=undefined) {
        this.unit = unit
        this.siUnit = siUnit
        this.repr = repr
        this.m = m
        this.a = a
        this.b = b
        this.gauge = gauge
    }
}

const convFactors = new Map();
convFactors.set('pa', new convFactor('pa', 'pa', 1.0, 0.0, 0.0))
convFactors.set('bar', new convFactor('bar', 'pa', 100000.0, 0.0, 0.0))
convFactors.set('bar-g', new convFactor('bar-g', 'pa', 100000.0, 0.0, 0.0, gauge=1.01325))
convFactors.set('psi',  new convFactor('psi', 'pa', 6894.76, 0.0, 0.0))
convFactors.set('psi-g', new convFactor('psi-g', 'pa', 6894.76, 0.0, 0.0, gauge=14.696))
convFactors.set('atm', new convFactor('atm', 'pa', 101325.0, 0.0, 0.0))
convFactors.set('mmHg', new convFactor('mmHg', 'pa', 133.322, 0.0, 0.0))
convFactors.set('torr', new convFactor('torr', 'pa', 133.322, 0.0, 0.0))
convFactors.set('inHg', new convFactor('inHg', 'pa', 3386.39, 0.0, 0.0))

convFactors.set("K", new convFactor('K', 'K', 1.0, 0.0, 0.0))
convFactors.set("C", new convFactor('C', 'K', 1.0, -273.15, 0.0))
convFactors.set("F", new convFactor('F', 'K', 5.0 / 9.0, 32.0, 273.15))

convFactors.set('kg/s', new convFactor('kg/s', 'kg/s', 1.0, 0.0, 0.0))
convFactors.set('kg/m', new convFactor('kg/m', 'kg/s', 1.0/60.0, 0.0, 0.0))
convFactors.set('kg/h', new convFactor('kg/h', 'kg/s', 1.0/3600.0, 0.0, 0.0))
convFactors.set('lb/s', new convFactor('lb/s', 'kg/s', 0.453592, 0.0, 0.0))
convFactors.set('lb/m', new convFactor('lb/m', 'kg/s', 0.453592 / 60, 0.0, 0.0))
convFactors.set('lb/h', new convFactor('lb/h', 'kg/s', 0.453592 / 3600, 0.0, 0.0))

convFactors.set('m3/s', new convFactor('m3/s', 'm3/s', 1.0, 0.0, 0.0))
convFactors.set('m3/m', new convFactor('m3/m', 'm3/m', 1.0/60.0, 0.0, 0.0))
convFactors.set('m3/h', new convFactor('m3/h', 'm3/h', 1.0/3600.0, 0.0, 0.0))
convFactors.set('l/s', new convFactor('l/s', 'm3/s', 0.001, 0.0, 0.0))
convFactors.set('ft3/s', new convFactor('ft3/s', 'm3/s', 0.02831685, 0.0, 0.0))
convFactors.set('ft3/m', new convFactor('ft3/m', 'm3/s', 0.02831685/60.0, 0.0, 0.0))
convFactors.set('ft3/h', new convFactor('ft3/h', 'm3/s', 0.02831685/3600.0, 0.0, 0.0))
convFactors.set('GPM', new convFactor('GPM', 'm3/s', 0.0000630902, 0.0, 0.0))


document.addEventListener("DOMContentLoaded", async function () {
    mapUserUnits();
    updateUnits();
    initiateHowUnitsWorkTable();
});


function initiateHowUnitsWorkTable() {
    let tbody = document.getElementById('how-units-work-tbody')
    convFactors.forEach((convFactorInstance) => {
        let rowElem = document.createElement('tr');

        let cell1 = document.createElement('td');
        cell1.innerHTML = `${convFactorInstance.unit}`
        rowElem.appendChild(cell1);

        let cellb = document.createElement('td');
        cellb.innerHTML = `${convFactorInstance.siUnit}`
        rowElem.appendChild(cellb);

        let cell2 = document.createElement('td');
        cell2.innerHTML = `${convFactorInstance.m}`
        rowElem.appendChild(cell2);

        let cell3 = document.createElement('td');
        cell3.innerHTML = `${convFactorInstance.a}`
        rowElem.appendChild(cell3);

        let cell4 = document.createElement('td');
        cell4.innerHTML = `${convFactorInstance.b}`
        rowElem.appendChild(cell4);

        let cell5 = document.createElement('td');
        if (convFactorInstance.gauge) {
            cell5.innerHTML = `${convFactorInstance.gauge}`
        } else {
            cell5.innerHTML = `0`
        }
        
        rowElem.appendChild(cell5);
        tbody.appendChild(rowElem);
    })
}

function openDialog(dialogID) {
    closeAllPopups();
    const dialog = document.querySelector(`dialog#${dialogID}`);
    if (!dialog) { return }
    dialog.showModal();
}

function closeDialog() {
    const dialogs = document.querySelectorAll('dialog[open]');
    if (!dialogs) { return }
    dialogs.forEach((dialog) => {
        dialog.close();
    });
}

function mapUserUnits() {
    let userPressureUnit = document.getElementById('user-pressure').value;
    let userTemperatureUnit = document.getElementById('user-temperature').value;
    let userVolFlowUnit = document.getElementById('user-volume-flow').value;
    let userMassFlowUnit = document.getElementById('user-mass-flow').value;
    userUnits.set('ax-pressure', userPressureUnit);
    userUnits.set('ax-temperature', userTemperatureUnit);
    userUnits.set('ax-volume-flow', userVolFlowUnit);
    userUnits.set('ax-mass-flow', userMassFlowUnit);
}

function convertUnits() {
    mapUserUnits();
    updateUnits();
    closeDialog();
}

document.addEventListener('change', (event) => {
    const element = event.target;

    if (!element.tagName === 'input' || !element.hasAttribute('ax-unit-user')) {
        return
    }
    const userValue = element.value;
    const parentElem = element.closest('[ax-unit]');
    const siElement = parentElem.querySelector('input[ax-unit-si]');
    const unitType = parentElem.getAttribute('ax-unit');
    const siUnit = getSiUnit(unitType);
    const userUnit = userUnits.get(unitType);
    let siValue = convertUnit(userValue, userUnit, siUnit);
    siElement.value = parseFloat(siValue).toFixed(2);
    return
})


function getSiUnit(unitType) {
    if (unitType === 'ax-pressure') {
        return 'pa';
    } else if (unitType === 'ax-temperature') {
        return 'K';
    }
    else if (unitType === 'ax-mass-flow') {
        return 'kg/s';
    }
    else if (unitType === 'ax-volume-flow') {
        return 'm3/s';
    }
    return undefined;
}


function getUserUnit(unitType) {
    if (unitType === 'pressure') {
        return document.getElementById('user-pressure').value;
    } else if (unitType === 'temperature') {
        return document.getElementById('user-temperature').value;
    }
    else if (unitType === 'mass-flow') {
        return document.getElementById('user-mass-flow').value;
    }
    else if (unitType === 'volume-flow') {
        return document.getElementById('user-volume-flow').value;
    }
    return undefined;
}

function convertUnit(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) {
        return value;
    }
    const fromData = convFactors.get(fromUnit);
    const toData = convFactors.get(toUnit);

    if (!fromData || !toData) {
        console.warn(`Conversion factors not found. From: ${fromUnit} To: ${toUnit}`);
        return value;
    }
    
    if (fromData.gauge) {
        value += fromData.gauge;
    }
  
    const valueInSI = ((value - fromData.a) * fromData.m) + fromData.b;
    let result = (valueInSI - toData.b) / toData.m + toData.a;

    if (toData.gauge) {
        result -= toData.gauge;
    }
    return result;
  }


function updateUnits(unitElements=undefined) {
    if (!convFactors) {
        console.error("CONVERSION: The Conversion Factors Map is undefined!");
        return
    }

    if (unitElements === undefined) {
        unitElements = document.querySelectorAll('[ax-unit]');
    }

    unitElements.forEach(unitElem => {
        let inputElemSI = unitElem.querySelector('input[ax-unit-si]');
        if (!inputElemSI) { 
            console.error("UNIT CONVERSION: Could not find SI unit input element");
            return
        }
        if (!inputElemSI.value) { 
            console.error("UNIT CONVERSION: SI input element has no value!");
            return
        }
        let siValue = new Number(inputElemSI.value);

        const unitType = unitElem.getAttribute("ax-unit");
        const siUnit = getSiUnit(unitType);
        const userUnit = userUnits.get(unitType);

        let userValue = convertUnit(siValue, siUnit, userUnit);

        if (unitElem.tagName === "TR") {
            let tableCellUser = unitElem.querySelector('td[ax-unit-user]');
            if (!tableCellUser) { 
                console.error('UNIT CONVERSION: Could not find user unit table cell element!');
                return
            }
            tableCellUser.innerHTML = parseFloat(userValue).toFixed(2);

            let tableCellUnit = unitElem.querySelector('[ax-unit-repr]');
            if (!tableCellUnit) {
                console.error('UNIT CONVERSION: Could not find user unit repr table cell element!')
                return
            }

            tableCellUnit.innerHTML = userUnit;

        } else if (unitElem.tagName === "DIV") {
            let inputElemUser = unitElem.querySelector('input[ax-unit-user]');
            if (!inputElemUser) { 
                console.error('UNIT CONVERSION: Could not find user unit input element!');
                return
            }
            inputElemUser.value = parseFloat(userValue).toFixed(2);
        }
    })
}





// function initiateDB() {
//     return new Promise((resolve, reject) => {
//         let dbRequest = indexedDB.open(dbName, dbVersion);

//         dbRequest.onupgradeneeded = function (event) {
//             db = event.target.result;
//             if (!db.objectStoreNames.contains(objectStoreName)) {
//                 const objectStore = db.createObjectStore(objectStoreName, { keyPath: "unit" });
//                 objectStore.createIndex("unit", "unit", { unique: true });
//             }
//         };

//         dbRequest.onsuccess = function () {
//             db = dbRequest.result;
//             const transaction = db.transaction(objectStoreName, "readonly");
//             const objectStore = transaction.objectStore(objectStoreName);
//             const countRequest = objectStore.count();

//             countRequest.onsuccess = function () {
//                 const count = countRequest.result;
//                 if (count === 0) {
//                     uploadDataToDB()
//                         .then(() => {
//                             resolve();
//                         })
//                         .catch((error) => {
//                             reject(error);
//                         });
//                 } else {
//                     resolve();
//                 }
//             };
//         };

//         dbRequest.onerror = function (event) {
//             console.error("Error opening database:", event.target.error);
//             reject(event.target.error);
//         }
//     });
// }

// function cacheConversionFactorsToMap() {
//     return new Promise((resolve, reject) => {
//         const transaction = db.transaction(objectStoreName, "readonly");
//         const objectStore = transaction.objectStore(objectStoreName);
//         const getAllRequest = objectStore.getAll();

//         getAllRequest.onsuccess = function (event) {
//             const data = event.target.result;
//             data.forEach((entry) => {
//                 let setObj;
//                 if (entry.gauge) {
//                     setObj = {
//                         m: entry.m,
//                         a: entry.a,
//                         b: entry.b,
//                         gauge: entry.gauge,
//                     };
//                 } else {
//                     setObj = {
//                         m: entry.m,
//                         a: entry.a,
//                         b: entry.b,
//                     };
//                 }
//                 convFactors.set(entry.unit, setObj);
//             });
//             resolve();
//         };

//         getAllRequest.onerror = function (event) {
//             console.error("Error opening database:", event.target.error);
//             reject(event.target.error);
//         }
//     });
// }

// function uploadDataToDB() {
//     return new Promise((resolve, reject) => {
//         const transaction = db.transaction(objectStoreName, "readwrite");
//         const objectStore = transaction.objectStore(objectStoreName);

//         conversionData.forEach((data) => {
//             const putRequest = objectStore.put(data);

//             putRequest.onerror = function (event) {
//                 console.error(`Error adding data for unit: ${data.unit}:`);
//                 console.error(event.target.error);
//                 reject(event.target.error);
//             };
//         });

//         transaction.oncomplete = function () {
//             resolve();
//         };
//     });
    
// }