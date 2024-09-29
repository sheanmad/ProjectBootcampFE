function getLoanIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('loanId');
}

async function fetchPayment() {
    const token = localStorage.getItem('Token');
    const response = await fetch(`ApiPayment/GetLoanRepaidByLoanId/${getLoanIdFromUrl()}`, {
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
    } else {
        alert('No loans found');
    }
}

function populateBorrowerTable(loans) {
    const loanTableBody = document.querySelector('#paymentTable tbody');
    loanTableBody.innerHTML = "";

    for (let i = 1; i <= 12; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>  <!-- Display current month number -->
            <td>${loans.paidAmount}</td>
            <td>${loans.interestRate}</td>
            <td>
                <input type="checkbox" class="month-checkbox" data-month="${i}" />
            </td>
        `;
        loanTableBody.appendChild(row);
    }
}

async function addPayment () { 
    try {
        const token = localStorage.getItem('Token');
        const lastPaymentResponse = await fetch(`ApiPayment/GetLastPaymentByLoanId/${getLoanIdFromUrl()}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const lastPaymentData = await lastPaymentResponse.json();
        const lastPaidAmount = lastPaymentData.RepaidAmount || 0;
        const loanAmount = lastPaymentData.LoanAmount;
        const jumlahBulanPaid = getCheckedMonths();
        const paidAmount = lastPaymentData.PaidAmount;

        const newPaidAmount = jumlahBulanPaid * paidAmount;

        const reqAddPayment = {
            Amount: newPaidAmount,
            RepaidAmount: lastPaidAmount + newPaidAmount,
            BalanceAmount: loanAmount - (lastPaidAmount + newPaidAmount),
            RepaidStatus: (lastPaidAmount + newPaidAmount >= loanAmount) ? 'Paid' : 'Pending',
            PaidAt: new Date().toISOString()
        };

        // Add payment
        const addPaymentResponse = await fetch(`ApiPayment/AddPayment/${getLoanIdFromUrl()}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('Token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqAddPayment)
        });

        if (!addPaymentResponse.ok) {
            throw new Error('Failed to add payment');
        }

        // Update the balance for the borrower
        const reqUpdateAmount = { Amount: newPaidAmount };
        const borrowerUpdateResponse = await fetch(`ApiPayment/UpdateSaldoPaymentBorrower/${localStorage.getItem('Id')}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('Token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqUpdateAmount)
        });

        if (!borrowerUpdateResponse.ok) {
            throw new Error('Failed to update borrower balance');
        }

        // Update the balance for the lender
        const lenderUpdateResponse = await fetch(`ApiPayment/UpdateSaldoPaymentLender/${getLoanIdFromUrl()}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('Token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqUpdateAmount)
        });

        if (!lenderUpdateResponse.ok) {
            throw new Error('Failed to update lender balance');
        }

        // Update the repayment status
        const reqUpdateStatusRepay = {
            Status: (lastPaidAmount + newPaidAmount >= loanAmount) ? 'Paid' : 'Pending',
            UpdatedAt: new Date().toISOString()
        };

        const statusUpdateResponse = await fetch(`ApiPayment/UpdateStatusRepay/${getLoanIdFromUrl()}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('Token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqUpdateStatusRepay)
        });

        if (!statusUpdateResponse.ok) {
            throw new Error('Failed to update loan status');
        }

        alert('Payment processed successfully!');
    } catch (error) {
        console.error('Error during payment process:', error);
        alert('An error occurred: ' + error.message);
    }
};

function getCheckedMonths() {
    const checkboxes = document.querySelectorAll('.month-checkbox:checked');
    return checkboxes.length;
}

window.onload = fetchPayment;
