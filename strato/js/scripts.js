document.addEventListener('DOMContentLoaded', function() {
    if (window.hasRun) return;
    window.hasRun = true;

    // Fetch and display events with enhanced functionality
    fetch('https://raw.githubusercontent.com/Hertoggg/eventsoulnpepper/refs/heads/main/events.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(events => {
            
            const eventsContainer = document.getElementById('events-container');
            eventsContainer.innerHTML = ''; // Clear existing content
            
            // Filter out past events
            const currentDate = new Date();
            const futureEvents = events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= currentDate;
            });
            
            // Sort events by date (earliest first)
            futureEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Check if there are any future events
            if (futureEvents.length === 0) {
                eventsContainer.innerHTML = `
                    <div class="text-center py-4">
                        <p class="mb-0">Momenteel zijn er geen geplande optredens.</p>
                        <p>Houd deze pagina in de gaten voor aankomende evenementen!</p>
                    </div>
                `;
                return;
            }
            
            futureEvents.forEach(event => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card list-group-item mb-3';
                
                // Create Google Maps link from location
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
                
                // Better icons for event privacy type
                let privacyIcon, privacyText;
                if (event.privacy === 'public') {
                    privacyIcon = '<i class="fas fa-users"></i>';
                    privacyText = 'Openbaar Optreden';
                } else {
                    privacyIcon = '<i class="fas fa-user-lock"></i>';
                    privacyText = 'Besloten Optreden';
                }
                
                // Format date in Dutch
                const eventDate = new Date(event.date);
                const formattedDate = eventDate.toLocaleDateString('nl-NL', {
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                });
                
                // Format time (if time component exists)
                let formattedTime = '';
                if (event.date.includes('T')) {
                    formattedTime = ' - ' + eventDate.toLocaleTimeString('nl-NL', {
                        hour: '2-digit', 
                        minute: '2-digit'
                    });
                }
                
                // Create the event card HTML - simpler version with details as regular text
                eventCard.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-1">${event.title}</h5>
                        <span class="privacy-badge" title="${privacyText}">${privacyIcon} ${privacyText}</span>
                    </div>
                    
                    <!-- Show details as simple text with an icon if they exist -->
                    ${event.details ? `<p class="mb-1"><i class="fas fa-bullhorn"></i> ${event.details}</p>` : ''}
                    
                    <p class="mb-1"><i class="far fa-calendar-alt"></i> ${formattedDate}${formattedTime}</p>
                    <p class="mb-1"><i class="fas fa-map-marker-alt"></i> Locatie:
                        <a href="${mapsUrl}" target="_blank" class="location-link">${event.location} <i class="fas fa-external-link-alt"></i></a>
                    </p>
                `;
                
                eventsContainer.appendChild(eventCard);
            });
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            const eventsContainer = document.getElementById('events-container');
            eventsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle"></i> Er is een fout opgetreden bij het laden van de evenementen.
                </div>
            `;
        });

    // The rest of your script remains unchanged
    fetch('https://raw.githubusercontent.com/Hertoggg/eventsoulnpepper/refs/heads/main/band_members.json')
    .then(response => response.json())
    .then(bandMembers => {
        const bandContainer = document.getElementById('band-members-container');
        
        // Clear existing content
        bandContainer.innerHTML = '';
        
        // Create a row div for the grid
        const row = document.createElement('div');
        row.className = 'row g-4';
        bandContainer.appendChild(row);
        
        bandMembers.forEach((member, index) => {
            // Create column for each member with animation delay
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            
            // Set animation delay based on index
            col.style.setProperty('--animation-order', index);
            
            // Create member card
            const memberCard = document.createElement('div');
            memberCard.className = 'band-member-card';
            
            memberCard.innerHTML = `
                <div class="member-image-container">
                    <img src="${member.image}" alt="${member.name}" class="member-image">
                    <div class="member-overlay">
                        <div class="member-details">
                            <h4>${member.name}</h4>
                            <p>${member.role}</p>
                        </div>
                    </div>
                </div>
            `;
            
            col.appendChild(memberCard);
            row.appendChild(col);
        });
    })
    .catch(error => console.error('Error fetching band members:', error));
    
    // Navbar functionality
    
    // Navbar shrink function
    var navbarShrink = function() {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink');
        } else {
            navbarCollapsible.classList.add('navbar-shrink');
        }
    };

    // Shrink the navbar
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function(responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});