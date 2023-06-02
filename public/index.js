document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            // When element's is in viewport, apply the animation
            if (entry.isIntersecting) {
                entry.target.style.transform = "scale(1)";
                entry.target.style.opacity = "1";
                observer.unobserve(entry.target); // Once the animation has been applied, there's no need to keep observing this element
            }
        });
    }, {
        threshold: 0.3 // the amount of the element must be in the viewport.
    });

    // Observing each '.card' element
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
});
