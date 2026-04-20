// // Zodra iemand een optie selecteert, wordt het formulier automatisch gesubmit
// const targetgroupSelect = document.getElementById('targetgroup-select');
// const targetgroupForm = document.getElementById('targetgroup-form');

// targetgroupSelect.addEventListener('change', () => {
//     targetgroupForm.submit();
// });

document.getElementById('filter-button').hidden = true;
document.getElementById('targetgroup-select').addEventListener('change', function () { this.form.submit() });
document.getElementById('sort-select').addEventListener('change', function () { this.form.submit() })