const form = document.getElementById('locationForm');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

function triggerToast(message) {
    toastMsg.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0) translateX(-50%)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(40px) translateX(-50%)';
    }, 3000);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('loc_name').value;
    triggerToast(`Location "${name}" saved successfully!`);
    form.reset();
});

document.getElementById('updateBtn').addEventListener('click', () => {
    const name = document.getElementById('loc_name').value;
    if(!name) {
        triggerToast("Please enter a location name to update.");
        return;
    }
    triggerToast("Updating location records...");
});
