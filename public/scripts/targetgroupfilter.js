document.getElementById('filter-button').hidden = true;
document.getElementById('targetgroup-select').addEventListener('change', function () { this.form.submit() });
document.getElementById('sort-select').addEventListener('change', function () { this.form.submit() })
