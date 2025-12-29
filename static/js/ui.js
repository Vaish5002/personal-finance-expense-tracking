const profileToggle = document.getElementById("profileToggle");
const profileMenu = document.getElementById("profileMenu");

profileToggle.onclick = () => {
    profileMenu.style.display =
        profileMenu.style.display === "block" ? "none" : "block";
};

document.addEventListener("click", (e) => {
    if (!profileToggle.contains(e.target) &&
        !profileMenu.contains(e.target)) {
        profileMenu.style.display = "none";
    }
});
