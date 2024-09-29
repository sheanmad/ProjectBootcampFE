async function fetchRequestLoan() {
    const token = localStorage.getItem('Token');
    const borrowerId = localStorage.getItem('Id');
    const response = await fetch(`ApiBorrower/GetAllRequestLoan/${borrowerId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    if (!response.ok) {
        alert('Failed to fetch loans');
        return;
    }
    const jsonData = await response.json();
    if (jsonData.success) {
        populateBorrowerTable(jsonData.data);
    }
    else {
        alert('no loans found');
    }
}

function populateBorrowerTable(loans) {
    const loanTableBody = document.querySelector('#loanRequestTable tbody');
    loanTableBody.innerHTML = "";
    loans.forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.amount}</td>
            <td>${loan.interestRate}</td>
            <td>${loan.duration}</td>
            <td>${loan.status}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="moveToPaymentPage('${loan.loanId}')">Detail</button>
            </td>
        `;
        loanTableBody.appendChild(row);
    });
}

function moveToPaymentPage(loanId) {
    window.location.href = `Payment?loanId=${loanId}`;
}

window.onload = fetchRequestLoan;