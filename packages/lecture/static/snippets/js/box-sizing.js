document.getElementById("toggle").addEventListener("click", () => {
    document.querySelector(".content-box").classList.toggle("border");
    document.querySelector(".border-box").classList.toggle("border");
});