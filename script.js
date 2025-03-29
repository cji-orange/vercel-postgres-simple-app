document.addEventListener('DOMContentLoaded', () => {
    const listView = document.getElementById('listView');
    const createView = document.getElementById('createView');
    const editView = document.getElementById('editView');

    const instrumentList = document.getElementById('instrumentList');
    const createForm = document.getElementById('createForm');
    const editForm = document.getElementById('editForm');

    const showCreateFormBtn = document.getElementById('showCreateFormBtn');
    const cancelCreateBtn = document.getElementById('cancelCreateBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    // --- View Switching Functions ---
    function showListView() {
        listView.style.display = 'block';
        createView.style.display = 'none';
        editView.style.display = 'none';
        fetchInstruments(); // Refresh list when showing
    }

    function showCreateView() {
        listView.style.display = 'none';
        createView.style.display = 'block';
        editView.style.display = 'none';
    }

    function showEditView() {
        listView.style.display = 'none';
        createView.style.display = 'none';
        editView.style.display = 'block';
    }

    // --- Event Listeners for View Switching ---
    showCreateFormBtn.addEventListener('click', showCreateView);
    cancelCreateBtn.addEventListener('click', showListView);
    cancelEditBtn.addEventListener('click', showListView);

    // --- API Interaction Functions ---

    async function fetchInstruments() {
        try {
            const response = await fetch('/api/instruments');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const instruments = await response.json();
            displayInstruments(instruments);
        } catch (error) {
            console.error('Error fetching instruments:', error);
            instrumentList.innerHTML = '<tr><td colspan="3">Error loading instruments.</td></tr>';
        }
    }

    async function fetchInstrumentById(id) {
        try {
            const response = await fetch(`/api/instruments?id=${id}`);
            if (!response.ok) {
                if (response.status === 404) return null; // Not found is handled in populateEditForm
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching instrument ${id}:`, error);
            alert('Error fetching instrument details.');
            return null;
        }
    }

    async function createInstrument(instrumentData) {
        try {
            const response = await fetch('/api/instruments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(instrumentData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await response.json(); // Consume the response body (even if just a message)
            showListView(); // Go back to list view after creation
        } catch (error) {
            console.error('Error creating instrument:', error);
            alert('Error saving instrument.');
        }
    }

    async function updateInstrument(id, instrumentData) {
         try {
            const response = await fetch(`/api/instruments?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(instrumentData),
            });
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             }
             await response.json(); // Consume the response body
             showListView(); // Go back to list view after update
        } catch (error) {
            console.error(`Error updating instrument ${id}:`, error);
            alert('Error updating instrument.');
        }
    }

    // --- UI Update Functions ---

    function displayInstruments(instruments) {
        instrumentList.innerHTML = ''; // Clear existing list
        if (!instruments || instruments.length === 0) {
            instrumentList.innerHTML = '<tr><td colspan="3">No instruments found.</td></tr>';
            return;
        }

        instruments.forEach(instrument => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="#" data-id="${instrument.id}" class="edit-link">${instrument.name}</a></td>
                <td data-label="Category">${instrument.category}</td>
                <td data-label="Key">${instrument.key}</td>
            `;
            instrumentList.appendChild(row);
        });

        // Add event listeners to the new edit links
        document.querySelectorAll('.edit-link').forEach(link => {
            link.addEventListener('click', async (event) => {
                event.preventDefault();
                const id = event.target.getAttribute('data-id');
                await populateEditForm(id);
                showEditView();
            });
        });
    }

    async function populateEditForm(id) {
        const instrument = await fetchInstrumentById(id);
        if (!instrument) {
            alert('Instrument not found!');
            return;
        }
        document.getElementById('editId').value = instrument.id;
        document.getElementById('editName').value = instrument.name;
        document.getElementById('editCategory').value = instrument.category;
        document.getElementById('editKey').value = instrument.key;
    }

    // --- Form Submit Handlers ---

    createForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(createForm);
        const instrumentData = Object.fromEntries(formData.entries());
        await createInstrument(instrumentData);
        createForm.reset(); // Clear form fields
    });

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(editForm);
        const instrumentData = Object.fromEntries(formData.entries());
        const id = document.getElementById('editId').value;
        await updateInstrument(id, instrumentData);
    });

    // --- Initial Load ---
    showListView(); // Show the list view by default

}); 