class modalWindow {
    #table = document.querySelector('.table');
    #btnBack = document.querySelector('.btn-back');
    #modal = document.querySelector('.modal');
    userId;

    constructor() {
        this.#table.addEventListener('click', this._showModal.bind(this));

        this.#btnBack.addEventListener('click', this._closeModal.bind(this));
    }

    _showModal(e) {
        const btn = e.target.closest('.tab-btn.update');
        if (!btn) return;
        this.#modal.classList.remove('modal--hidden');
        this.userId = btn.dataset.id;
    }

    _closeModal() {
        this.#modal.classList.add('modal--hidden');
    }
}

class Update {
    #form = document.querySelector('.form');
    #userId = document.querySelector('.tab-btn.update').dataset.id;

    constructor() {
        this.#form.addEventListener('submit', this._patchData.bind(this));
    }

    async _patchData(e) {
        try {
            e.preventDefault();
            const formData = Object.fromEntries(new FormData(this.#form).entries());

            const keyArr = Object.keys(formData);

            keyArr.forEach((key) => {
                if (formData[key] !== '') return;

                delete formData[key];
            });

            // prettier-ignore
            const userPro = fetch(`http://localhost:7000/api/user-game/${modal.userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const bioPro = fetch(
                `http://localhost:7000/api/user-game-biodata/${modal.userId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );

            const hisPro = fetch(
                `http://localhost:7000/api/user-game-history/${modal.userId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );

            const res = await Promise.all([userPro, bioPro, hisPro]);

            res.forEach(async (resData) => {
                const data = await resData.json();
                console.log(data);
            });
        } catch (err) {
            console.error(err);
        }

        alert('User updated');
        window.location.reload();
    }
}

class Delete {
    // tab-btn delete
    #table = document.querySelector('.table');

    constructor() {
        this.#table.addEventListener('click', this._delete.bind(this));
    }

    async _delete(e) {
        const btn = e.target.closest('.tab-btn.delete');
        if (!btn) return;

        const id = e.target.dataset.id;

        await fetch(`http://localhost:7000/api/user-game/${id}`, {
            method: 'DELETE',
        });

        alert('Data deleted');
        window.location.reload();
    }
}

const modal = new modalWindow();
new Update();
new Delete();
