// Author: Dibyajeet Kirttania
// Date: 30 April, 2026

//Silly Stuff
const author = 'Dibyajeet';
function sillyFunction () {
    const appMain = document.querySelector('.app');
    const helloText = document.createElement('p');
    appMain.appendChild(helloText);
    helloText.textContent = `Hello! ${author}`;
}
sillyFunction();