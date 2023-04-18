// Get all tabcontent elements
const tabContents = document.querySelectorAll(".tabcontent");

// Get all tablinks elements
const tabLinks = document.querySelectorAll(".menu a");

// Loop through the tablinks elements and add the active class to the current/clicked tablink
for (const tabLink of tabLinks) {
    tabLink.addEventListener("click", function (e) {
        e.preventDefault();
        const tabId = this.getAttribute("href").substring(1);

        // Remove the active class from all tablinks
        for (const tabLink of tabLinks) {
            tabLink.classList.remove("active");
        }

        // Add the active class to the clicked tablink
        this.classList.add("active");

        // Hide all tabcontents
        for (const tabContent of tabContents) {
            tabContent.classList.remove("active");
        }

        // Show the selected tabcontent
        document.getElementById(tabId).classList.add("active");
    });
}
