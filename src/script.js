const Store = require('electron-store');
const store = new Store();

const login = require('../lib/login.function')
const getGrades = require('../lib/grades.function');

const header = document.querySelector('header');
const loadAnimation = document.querySelector('#load');
const section = document.querySelector('section');
const gradescontainer = document.querySelector('#grades-container');
const form = document.querySelector('form');
const school = document.querySelector('#school');
const username = document.querySelector('#username');
const password = document.querySelector('#password');

window.onload = () => {
    if (store.get('loginInfo'))  {
        school.value  = store.get('loginInfo').school;
        username.value = store.get('loginInfo').username;
    }
}

let info;
let grades;

form.addEventListener('submit', async e => {
    e.preventDefault();

    if ( school.value && username.value && password.value ) {
        info = { 
            school: school.value,
            username: username.value,
            password: password.value
        };

        school.value = '';
        username.value = '';
        password.value = '';

        
        loadAnimation.classList.remove('hide');
        form.classList.add('hide');
        header.classList.remove('hide');
        reload.classList.add('hide');
        
        const browserInfo = await login(info);
        grades = await getGrades(browserInfo);
        await login.close(browserInfo);
        
        if (grades) {
            store.set('loginInfo.school', info.school);
            store.set('loginInfo.username', info.username);
            section.classList.remove('hide');
            
            for ( const grade of grades ) {
                const div = document.createElement('div');
                div.id = 'container';
                
                const content = document.createElement('div');
                content.id = 'grade-element';
                
                const i = document.createElement('i');
                i.classList.add('fas');
                i.classList.add('fa-chevron-right');
                div.append(i);
                
                const nameEl = document.createElement('h3');
                nameEl.textContent = grade.name;
                content.append(nameEl);
                
                const cijferEl = document.createElement('h3');
                cijferEl.textContent = grade.grade;
                if ( grade.grade.replace(',', '.') < 5.5 ) cijferEl.classList.add('onvoldoende');
                
                content.append(cijferEl);
                
                div.append(content);
                
                const ul = document.createElement('ul');
                let li1 = document.createElement('li');
                li1.innerHTML = `<b>Omschrijving:</b> ${grade.description}`;
                ul.append(li1);
                let li2 = document.createElement('li');
                li2.innerHTML = `<b>Datum:</b> ${grade.date}`
                ul.append(li2);
                let li3 = document.createElement('li');
                li3.innerHTML = `<b>Weging:</b> ${grade.weight}`
                ul.append(li3);
                
                ul.classList.add('hide');
                div.append(ul);
                
                div.addEventListener('click', () => {
                    if ( ul.classList.value == 'hide' ) {
                        ul.classList.remove('hide');
                        i.classList.remove('fa-chevron-right')
                        i.classList.add('fa-chevron-down')
                    } else {
                        ul.classList.add('hide');
                        i.classList.add('fa-chevron-right')
                        i.classList.remove('fa-chevron-down')
                    } 
                })
                
                loadAnimation.classList.add('hide');
                reload.classList.remove('hide');
                gradescontainer.append(div);
                
            }
        } else {
            school.value = '';
            username.value = '';
            password.value = '';
            
            info = undefined;

            form.classList.remove('hide');
        }
    } else {
        school.value = '';
        username.value = '';
        password.value = '';
    }
});

const reload = document.querySelector('#reload');

reload.addEventListener('click', async () => {
    const browserInfo = await login(info);
    grades = await getGrades(browserInfo);
    await login.close(browserInfo);
    
    gradescontainer.innerHTML = '';

    for ( const grade of grades ) {
        const div = document.createElement('div');
        div.id = 'container';

        const content = document.createElement('div');
        content.id = 'grade-element';

        const i = document.createElement('i');
        i.classList.add('fas');
        i.classList.add('fa-chevron-right');
        div.append(i);
        
        const nameEl = document.createElement('h3');
        nameEl.textContent = grade.name;
        content.append(nameEl);

        const cijferEl = document.createElement('h3');
        cijferEl.textContent = grade.grade;
        content.append(cijferEl);

        div.append(content);

        const ul = document.createElement('ul');
        let li1 = document.createElement('li');
        li1.textContent = `Omschrijving: ${grade.description}`;
        ul.append(li1);
        let li2 = document.createElement('li');
        li2.textContent = `Datum: ${grade.date}`
        ul.append(li2);
        let li3 = document.createElement('li');
        li3.textContent = `Weging: ${grade.weight}`
        ul.append(li3);

        ul.classList.add('hide');
        div.append(ul);

        div.addEventListener('click', () => {
            if ( ul.classList.value == 'hide' ) {
                ul.classList.remove('hide');
                i.classList.remove('fa-chevron-right')
                i.classList.add('fa-chevron-down')
            } else {
                ul.classList.add('hide');
                i.classList.add('fa-chevron-right')
                i.classList.remove('fa-chevron-down')
            } 
        })

        gradescontainer.append(div);

    }

})