const authAlert = document.getElementById('authAlert');
const errorText = document.getElementById('errorText');
const loginView = document.getElementById('loginView');
const signupView = document.getElementById('signupView');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');

function toggleView(view) {
    hideAlert();
    if (view === 'signup') {
        loginView.classList.add('hidden-view');
        setTimeout(() => {
            loginView.style.display = 'none';
            signupView.style.display = 'block';
            authTitle.textContent = "Sign Up";
            authSubtitle.textContent = "Create your account to get started.";
            setTimeout(() => signupView.classList.remove('hidden-view'), 50);
        }, 200);
    } else {
        signupView.classList.add('hidden-view');
        setTimeout(() => {
            signupView.style.display = 'none';
            loginView.style.display = 'block';
            authTitle.textContent = "Login";
            authSubtitle.textContent = "Please enter your account details.";
            setTimeout(() => loginView.classList.remove('hidden-view'), 50);
        }, 200);
    }
}

function setLoading(form, isLoading) {
    const btn = form.querySelector('.submit-btn');
    const loader = btn.querySelector('.spinner');
    const text = btn.querySelector('.btn-text');
    const originalText = form.id === 'loginForm' ? 'Login' : 'Sign Up';

    btn.disabled = isLoading;
    if (isLoading) {
        loader.classList.remove('hidden');
        text.textContent = 'Processing...';
        btn.classList.add('opacity-90', 'cursor-wait');
    } else {
        loader.classList.add('hidden');
        text.textContent = originalText;
        btn.classList.remove('opacity-90', 'cursor-wait');
    }
}

function showAlert(msg, type = 'error') {
    errorText.textContent = msg;
    authAlert.classList.remove('hidden', 'text-red-800', 'border-red-500', 'bg-red-50', 'text-green-800', 'border-green-500', 'bg-green-50');
    
    if (type === 'error') {
        authAlert.classList.add('text-red-800', 'border-red-500', 'bg-red-50');
        const container = document.getElementById('authContainer');
        container.style.animation = 'none';
        container.offsetHeight; 
        container.style.animation = 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both';
    } else {
        authAlert.classList.add('text-green-800', 'border-green-500', 'bg-green-50');
    }
}

function hideAlert() {
    authAlert.classList.add('hidden');
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();
    setLoading(e.target, true);

    const username = document.getElementById('login_user').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            if (window.smoothNavigate) {
                window.smoothNavigate('dashboard.html');
            } else {
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.6s ease';
                setTimeout(() => window.location.href = 'dashboard.html', 600);
            }
        } else {
            showAlert(data.message || "Invalid username or password.");
            setLoading(e.target, false);
        }
    } catch (error) {
        showAlert("An error occurred during login. Please try again.");
        setLoading(e.target, false);
    }
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const username = document.getElementById('signup_user').value;
    const email = document.getElementById('signup_email').value;
    const password = document.getElementById('signup_pass').value;
    const confirm = document.getElementById('signup_pass_confirm').value;

    if (password !== confirm) {
        showAlert("Passwords do not match.");
        return;
    }

    setLoading(e.target, true);

    try {
        const response = await fetch('/api/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setLoading(e.target, false);
            toggleView('login');
            showAlert("Account created successfully! Please login.", 'success');
        } else {
            showAlert(data.message || "Account creation failed.");
            setLoading(e.target, false);
        }
    } catch (error) {
        showAlert("An error occurred during signup. Please try again.");
        setLoading(e.target, false);
    }
});
