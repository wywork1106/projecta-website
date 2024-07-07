function loadURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('name').value = urlParams.get('name') || '';
    document.getElementById('currentAge').value = urlParams.get('currentAge') || '';
    document.getElementById('retirementAge').value = urlParams.get('retirementAge') || '';
    document.getElementById('yearsNeeded').value = urlParams.get('yearsNeeded') || '';
    document.getElementById('inflationRate').value = urlParams.get('inflationRate') || '4';
}

window.onload = function() {
    loadURLParams();
}

function calculateEPF() {
    const currentSalary = parseFloat(document.getElementById('currentSalary').value);
    const salaryIncreaseRate = parseFloat(document.getElementById('salaryIncreaseRate').value) / 100;
    const inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100;
    const currentEpf = parseFloat(document.getElementById('currentEpf').value);
    const epfRate = parseFloat(document.getElementById('epfRate').value) / 100;
    const yearsNeeded = parseInt(document.getElementById('yearsNeeded').value);

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

    generateTable(currentSalary, inflationRate, currentEpf, epfRate, salaryIncreaseRate);

    // Calculate and display goal progress
    const retirementNeeded = 1263057; // Example value, replace with your actual calculation
    const tableRows = document.getElementById('epfTable').rows;
    const finalAmount = parseFloat(tableRows[tableRows.length - 1].cells[7].innerHTML);
    const goalProgress = finalAmount - retirementNeeded;
    const goalProgressPercentage = (goalProgress / retirementNeeded) * 100;

    let exceededYear = -1;
    let exceededAmount = 0;

    for (let i = 1; i < tableRows.length; i++) {
        const currentAmount = parseFloat(tableRows[i].cells[7].innerHTML);
        if (currentAmount >= retirementNeeded && exceededYear === -1) {
            exceededYear = parseInt(tableRows[i].cells[1].innerHTML);
            exceededAmount = currentAmount - retirementNeeded;
            break;
        }
    }

    document.getElementById('goalAmount').innerText = `退休目标: RM${retirementNeeded.toFixed(2)}`;
    document.getElementById('goalProgressPercentage').innerText = `最终超越目标: ${Math.abs(goalProgressPercentage).toFixed(2)} %`;
    
    if (exceededYear !== -1) {
        document.getElementById('exceededYear').innerText = `第 ${exceededYear} 年超过退休目标 `;
        document.getElementById('exceededAmount').innerText = `超过金额 RM ${exceededAmount.toFixed(2)} (${((exceededAmount / retirementNeeded) * 100).toFixed(2)}%)`;
    } else {
        document.getElementById('exceededYear').innerText = '未能达到退休目标';
        document.getElementById('exceededAmount').innerText = '';
    }

    document.getElementById('goalProgress').style.display = 'block';
    document.getElementById('epfCalculator').style.display = 'block';

    return true;
}

function generateTable(currentSalary, inflationRate, currentEpf, epfRate, salaryIncreaseRate) {
    const yearsNeeded = parseInt(document.getElementById('yearsNeeded').value);

    const table = document.getElementById('epfTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear existing rows

    let accumulatedEpf = currentEpf;

    for (let i = 0; i <= yearsNeeded; i++) {
        const row = table.insertRow();
        const monthlyIncome = currentSalary * Math.pow(1 + salaryIncreaseRate, i);
        const yearlyIncome = monthlyIncome * 12;
        const yearlyEpfIncome = yearlyIncome * 0.24;
        accumulatedEpf += yearlyEpfIncome;
        const interest = accumulatedEpf * epfRate;
        const totalWithInterest = accumulatedEpf + interest;

        row.insertCell(0).innerHTML = yearsNeeded - i; //years
        row.insertCell(1).innerHTML = i; //current years
        row.insertCell(2).innerHTML = monthlyIncome.toFixed(2); //1 month income
        row.insertCell(3).innerHTML = yearlyIncome.toFixed(2); //1 year income
        row.insertCell(4).innerHTML = yearlyEpfIncome.toFixed(2); //this year fp income
        row.insertCell(5).innerHTML = accumulatedEpf.toFixed(2); 
        row.insertCell(6).innerHTML = interest.toFixed(2);
        row.insertCell(7).innerHTML =  totalWithInterest.toFixed(2); //epf + interest
 
        accumulatedEpf = totalWithInterest;
    }
}