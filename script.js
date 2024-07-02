function calculateEPF() {
    const currentSalary = parseFloat(document.getElementById('currentSalary').value);
    const inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100;
    const currentEpf = parseFloat(document.getElementById('currentEpf').value);
    const epfRate = parseFloat(document.getElementById('epfRate').value) / 100;
    const yearsNeeded = parseInt(document.getElementById('yearsNeeded').value);
    const salaryIncreaseRate = parseFloat(document.getElementById('salaryIncreaseRate').value) / 100;

    if (isNaN(currentSalary) || isNaN(currentEpf)) {
        alert('请输入有效的数值。');
        return false;
    }

    const epfNow = currentSalary * (0.11 + 0.13);
    const currentSalaryR = currentSalary * Math.pow(1 + salaryIncreaseRate, yearsNeeded);
    const epfR = epfNow * Math.pow(1 + salaryIncreaseRate, yearsNeeded);

    document.getElementById('epfNow').value = epfNow.toFixed(2);
    document.getElementById('currentSalaryR').value = currentSalaryR.toFixed(2);
    document.getElementById('epfR').value = epfR.toFixed(2);

    generateTable(currentSalary, inflationRate, currentEpf, epfRate, yearsNeeded, salaryIncreaseRate);

    document.getElementById('epfCalculator').style.display = 'block';

    return true;
}

function generateTable(currentSalary, inflationRate, currentEpf, epfRate, yearsNeeded, salaryIncreaseRate) {
    const table = document.getElementById('epfTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear existing rows

    let totalWithInterest = currentEpf;
    let monthlySalary = currentSalary;

    for (let i = 0; i <= yearsNeeded; i++) {
        const row = table.insertRow();
        const interest = totalWithInterest * epfRate;
        totalWithInterest += interest;

        const yearlyIncome = monthlySalary * 12;
        const yearlyEpfIncome = yearlyIncome * 0.24;
        totalWithInterest += yearlyEpfIncome;

        row.insertCell(0).innerHTML = totalWithInterest.toFixed(2);
        row.insertCell(1).innerHTML = yearsNeeded - i;
        row.insertCell(2).innerHTML = i;
        row.insertCell(3).innerHTML = monthlySalary.toFixed(2);
        row.insertCell(4).innerHTML = yearlyIncome.toFixed(2);
        row.insertCell(5).innerHTML = yearlyEpfIncome.toFixed(2);
        row.insertCell(6).innerHTML = totalWithInterest.toFixed(2);
        row.insertCell(7).innerHTML = interest.toFixed(2);

        monthlySalary *= (1 + salaryIncreaseRate);
    }

    // Calculate and display goal progress
    const retirementNeeded = parseFloat(document.getElementById('retirementAmountNeededR').value);
    const goalProgress = totalWithInterest - retirementNeeded;
    const goalProgressPercentage = (goalProgress / retirementNeeded) * 100;

    const goalAmountElement = document.getElementById('goalAmount');
    const goalProgressPercentageElement = document.getElementById('goalProgressPercentage');

    if (goalProgress < 0) {
        goalAmountElement.innerHTML = `恭喜！您已经达到了退休目标！`;
        goalProgressPercentageElement.innerHTML = `超出目标: ${Math.abs(goalProgress).toFixed(2)} 元`;
    } else {
        goalAmountElement.innerHTML = `还需要积累: ${goalProgress.toFixed(2)} 元`;
        goalProgressPercentageElement.innerHTML = `进度: ${goalProgressPercentage.toFixed(2)}%`;
    }

    document.getElementById('goalProgress').style.display = 'block';
}

function toggleEpfCalculator() {
    const epfCalculator = document.getElementById('epfCalculator');
    const goalProgress = document.getElementById('goalProgress');
    if (epfCalculator.style.display === 'none') {
        epfCalculator.style.display = 'block';
        goalProgress.style.display = 'block';
    } else {
        epfCalculator.style.display = 'none';
        goalProgress.style.display = 'none';
    }
}

// Load data from index.html
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('name').value = urlParams.get('name');
    document.getElementById('currentAge').value = urlParams.get('currentAge');
    document.getElementById('retirementAge').value = urlParams.get('retirementAge');
    document.getElementById('yearsNeeded').value = urlParams.get('yearsNeeded');
    document.getElementById('inflationRate').value = urlParams.get('inflationRate');
    document.getElementById('currentEpf').value = urlParams.get('currentEpf');
}