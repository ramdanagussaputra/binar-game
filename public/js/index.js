'use strict';

class homeApp {
    btnLogin = document.querySelector('.login');
    btnCloseModal = document.querySelector('.modal-icon--btn');
    btnLoginForm = document.querySelector('.login-btn');
    btnPlayGame = document.querySelector('.play-game');
    btnSignOut = document.querySelector('.sign-out');
    btnDashboard = document.querySelector('.btn-dashboard');

    NavSignUpEl = document.querySelector('.nav-signup');
    NavSignOutEl = document.querySelector('.nav-signout');
    welcomeMessage = document.querySelector('.welcome-message');
    modalEl = document.querySelector('.modal-cus');
    popUpEl = document.querySelector('.login-popup');
    usernameEl = document.querySelector('#username');
    passwordEl = document.querySelector('#password');

    usernameValue = null;
    passwordValue = null;
    token = null;

    constructor() {
        this.btnLogin.addEventListener('click', this._showModal.bind(this));
        this.btnCloseModal.addEventListener('click', this._closeModal.bind(this));
        this.btnLoginForm.addEventListener('click', this._formValue.bind(this));
        this.btnPlayGame.addEventListener('click', this._playGame.bind(this));
        this.btnSignOut.addEventListener('click', this._signOut.bind(this));
        // this.btnDashboard.addEventListener('click', this._directToDashboard.bind(this));
        this._checkIfAlreadyLogin();
    }

    _showModal() {
        this.modalEl.classList.remove('modal-cus--hide');
    }

    _closeModal() {
        this.modalEl.classList.add('modal-cus--hide');
    }

    _formValue(e) {
        e.preventDefault();

        // Get username and password
        this.usernameValue = this.usernameEl.value;
        this.passwordValue = this.passwordEl.value;

        this._postFormValue(this.usernameValue, this.passwordValue);

        // Reset value
        this.usernameEl.value = '';
        this.passwordEl.value = '';

        // Close modal
        this._closeModal();
    }

    async _postFormValue(username, password) {
        try {
            // Post data to server
            const res = await fetch('/api/user-game/login', {
                method: 'post',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ username, password, ok: true }),
            });

            // Convert response data to json
            const resServer = await res.json();
            console.log(resServer);

            // Show pop up
            const message = resServer.message ? resServer.message : 'Successful to Login';
            this._showPopUp(message);

            // Check if login success
            if (!(resServer.status === 'success')) return resServer;

            // Login successful state
            this.NavSignUpEl.classList.add('nav-sign--hidden');
            this.NavSignOutEl.classList.remove('nav-sign--hidden');
            this.welcomeMessage.textContent = `Welcome back, ${resServer.data.data.biodata.firstName}`;
            this.token = resServer.data.data.token;

            // Check if admin
            let isAdmin = false;
            if (resServer.data.data.role === 1) {
                this.btnDashboard.classList.remove('not-admin');
                isAdmin = true;
            }

            // Set data to cookies
            // const isAdmin = resServer.data.data.role === 1 ? true : false
            // const value = {
            //     username: resServer.data.data.username,
            //     ok: true,
            //     isAdmin: isAdmin,
            // };
            // this._setCookies(resServer.status, 'acc', JSON.stringify(value), 1)
            const user = {
                name: resServer.data.data.biodata.firstName,
                ok: true,
                isAdmin,
                token: this.token,
            };
            sessionStorage.setItem('user', JSON.stringify(user));

            return resServer;
        } catch (err) {
            console.error(err);
        }
    }

    _showPopUp(message) {
        this.popUpEl.innerHTML = `<p class="login-message">${message}</p>`;
        this.popUpEl.classList.remove('login-popup--hide');

        setTimeout(() => this.popUpEl.classList.add('login-popup--hide'), 2000);
    }

    // _setCookies(status, name, value = '', days = 1) {
    //     if (!(status === 'success')) return;
    //     const date = new Date();
    //     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    //     document.cookie = `${name}=${value}; expires=${date.toUTCString()}`;
    // }

    _getSeason() {
        try {
            const data = JSON.parse(sessionStorage.getItem('user'));

            return data;
        } catch {
            return { ok: false };
        }
    }

    _eraseSeason(name) {
        sessionStorage.removeItem(name);
    }

    _playGame() {
        const ok = this._getSeason();

        if (!ok) return this._showModal();
        location.href = '/game';
    }

    _signOut() {
        this.NavSignUpEl.classList.remove('nav-sign--hidden');
        this.NavSignOutEl.classList.add('nav-sign--hidden');
        this._eraseSeason('user');
        this._showPopUp('You out of the game');
    }

    _checkIfAlreadyLogin() {
        if (!this._getSeason()) return;

        const { ok, name, isAdmin, token } = this._getSeason();

        if (!ok) return;
        this.NavSignUpEl.classList.add('nav-sign--hidden');
        this.NavSignOutEl.classList.remove('nav-sign--hidden');
        this.welcomeMessage.textContent = `Welcome back, ${name}`;
        this.token = token;

        if (!isAdmin) return;
        this.btnDashboard.classList.remove('not-admin');
    }

    // _directToDashboard() {
    //     const client = new XMLHttpRequest();
    //     client.open('GET', `/user-dashboard`);
    //     client.setRequestHeader('Authorization', `Bearer ${this.token}`);
    //     window.location.href = 'http://localhost:7000/user-dashboard';
    // }
}

new homeApp();
