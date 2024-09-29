async function submitLogin() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const response = await fetch(`/ApiLogin/Login`, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('Token', result.data.token);
            localStorage.setItem('Id', result.data.id);
            window.location.href = 'Home/Index';
        }
        else {
            alert(result.message || 'Login Failed. Please Try Again.');
        }
    }
    catch (error) {
        alert("An error occured while logging in:" + error.message);
    }
}