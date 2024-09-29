async function fetchBorrowers() {
    const token = localStorage.getItem('Token');
    const response = await fetch('ApiLender/GetAllBorrower', {
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
    const loanTableBody = document.querySelector('#loanTable tbody');
    loanTableBody.innerHTML = "";
    loans.forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.name}</td>
            <td>${loan.amount}</td>
            <td>${loan.interestRate}</td>
            <td>${loan.duration}</td>
            <td>${loan.status}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="loanApprove('${loan.id}', '${loan.amount}')">Approve</button>
            </td>
        `;
        loanTableBody.appendChild(row);
    });
}

window.onload = fetchBorrowers;

function loanApprove(id, amount) {
    const token = localStorage.getItem('Token');
    const lenderId = localStorage.getItem('Id');
    console.log(lenderId);
    console.log(id);
    console.log(amount);

    const reqUpdateLoanDto = {
        status: "funded",
        lenderId: lenderId,
        amount: parseFloat(amount)
    };
    const reqUpdateAmount = {
        amount: parseFloat(amount)
    };

    fetch(`/ApiLender/UpdateStatusLoan/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqUpdateLoanDto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update loan' + response.message);
            }
            return response.json();
        })
        .then(data => {
            fetch(`/ApiLender/UpdateSaldoTransaksiLender/${lenderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqUpdateAmount)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update loan' + response.message);
                    }
                    return response.json();
                })
                .then(data => {
                    fetch(`/ApiLender/UpdateSaldoTransaksiBorrower/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(reqUpdateAmount)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to update loan' + response.message);
                            }
                            return response.json();
                        })
                        .then(data => {
                            alert('Loan updated successfully!');
                            fetchBorrowers();
                        })
                        .catch(error => {
                            alert('Error updating loan: ' + error.message);
                        });
                })
                .catch(error => {
                    alert('Error updating loan: ' + error.message);
                });
        })
        .catch(error => {
            alert('Error updating loan: ' + error.message);
        });
}