const btnSubmit = document.querySelector('.btn-form');
const form = document.querySelector('.form');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // GET DATA FROM FORM
    const formData = Object.fromEntries(new FormData(form).entries());

    // SEND DATA TO SERVER
    const response = await fetch('http://localhost:7000/api/user-game/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    window.location.assign('/');

    alert('Account successfully created');
});
