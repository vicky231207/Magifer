const fs = require('fs');

module.exports = async ({ browser, params }) => {
    const page = await browser.newPage();
    await page.goto(`${params.url}/magister/#/cijfers`, { waitUntil: 'networkidle2' });

    delay(2000);

    const els = await page.$$('tbody > tr > td');

    let values = [];    
    for ( const el of els ) {
        values.push(await page.evaluate(el => el.textContent, el));
    }

    const grades = organiseArray(values);

    return grades;

}

const delay = (time) => {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

const organiseArray = values => {
    const newArr = [];

    for ( let i = 0; i < values.length/6; i++ ) {
        newArr.push(values.slice((i-1)*6, i*6));
    }

    const formattedArr = [];

    for ( const arr of newArr ) {
        formattedArr.push({
            name: arr[0],
            date: arr[1],
            description: arr[2],
            grade: arr[3],
            weight: arr[4]
        })
    }

    formattedArr.splice(0, 1);

    return formattedArr;
}