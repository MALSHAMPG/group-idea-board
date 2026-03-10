/**
 * JavaScript for Productivity Toolkit Functionality
 * Handles section switching between the GPA Calculator and Study Timer.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select all navigation items and content sections
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    /**
     * Function to handle navigation item clicks
     */
    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Prevent default anchor behavior
            event.preventDefault();

            // Get the target section ID from the clicked element's data attribute
            const targetId = item.getAttribute('data-section');

            // --- 1. Update Navigation Links ---
            // Remove the 'active' class from all links
            navItems.forEach(link => link.classList.remove('active'));
            // Add the 'active' class to the clicked link
            item.classList.add('active');

            // --- 2. Switch Visible Sections ---
            // Hide all sections by adding the 'hidden' class
            sections.forEach(section => {
                section.classList.add('hidden');
            });

            // Show the target section by removing its 'hidden' class
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }
        });
    });

    console.log('Productivity Toolkit: Page logic loaded successfully.');
});