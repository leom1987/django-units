let convertFunc;


document.addEventListener("DOMContentLoaded", function() { 
    initWasm().then(() => {
        updateUnits();
        let unitField = document.getElementById('user-pressure');
        if (unitField) { 
            unitField.addEventListener('change', () => updateUnits());
        }
    }).catch(err => console.error("Failed to initialize WebAssembly:", err));
});


async function initWasm() {
    const { default: init, convert } = await import(unitConverterJSPath);
    await init(unitConverterWasmPath);
    convertFunc = convert;
}


async function updateUnits() {
    let unitElements = document.querySelectorAll('[ax-unit]');

    unitElements.forEach(unitElem => {
        let inputElemSI = unitElem.querySelector('input[ax-unit-si]');
        if (!inputElemSI) { 
            console.error('AXON: UNIT CONVERSION; Could not find SI unit input element!');
            return
        }
        if (!inputElemSI.value) { 
            console.error("AXON: UNIT CONVERSION; SI input element has no value!");
            return
        }
        let siValue = new Number(inputElemSI.value);

        let userUnit = document.getElementById('user-pressure').value;
        if (!userUnit) {
            console.error("AXON: Could not find user pressure units!");
            return
        }

        let userValue = convertFunc(siValue, "PA", userUnit.toUpperCase());

        if (unitElem.tagName === "TR") {
            let tableCellUser = unitElem.querySelector('td[ax-unit-user]');
            if (!tableCellUser) { 
                console.error('AXON: UNIT CONVERSION; Could not find user unit table cell element!');
                return
            }
            tableCellUser.innerHTML = parseFloat(userValue).toFixed(2);

            let tableCellUnit = unitElem.querySelector('[ax-unit-repr]');
            if (!tableCellUnit) {
                console.error('AXON: UNIT CONVERSION; Could not find user unit repr table cell element!')
                return
            }

            tableCellUnit.innerHTML = userUnit;

        } else if (unitElem.tagName === "DIV") {
            let inputElemUser = unitElem.querySelector('input[ax-unit-user]');
            if (!inputElemUser) { 
                console.error('AXON: UNIT CONVERSION; Could not find user unit input element!');
                return
            }
            inputElemUser.value = parseFloat(userValue).toFixed(2);
        }
    })
}


function convertPressure(siValue, userUnit) {
    let userValue = siValue;
    if (convertFunc) { 
        userValue = convertFunc(siValue, "PA", userUnit.toUpperCase());
    } else {
        console.error("AXON: UNIT CONVERSION; WebAssembly converter not available!");
        return
    }
    return userValue;
}