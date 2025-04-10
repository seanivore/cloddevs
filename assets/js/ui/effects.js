// Function to create ripple effect on button clicks
export function createRipple(event, element) {
  // Create ripple element
  const ripple = document.createElement('span');
  ripple.classList.add('ripple-effect');
  element.appendChild(ripple);
  
  // Position ripple at click location
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  
  // Remove ripple after animation completes
  setTimeout(() => {
    ripple.remove();
  }, 1000);
}

// Add ripple effect to all dialog buttons
export function addRippleToButtons() {
  // Get all dialog buttons
  const buttons = document.querySelectorAll('.dialog-button');
  
  // Add click handler to each button
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      createRipple(e, this);
    });
  });
}

// Add ripple effect to dialog headers (accordion headers)
export function addRippleToAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function(e) {
      createRipple(e, this);
      
      // Toggle active class on the parent accordion item
      const item = this.parentElement;
      if (item && item.classList.contains('accordion-item')) {
        // First close other accordions
        closeOtherAccordions(item);
        
        // Toggle this one
        item.classList.toggle('active');
        
        // Handle content height
        const content = item.querySelector('.accordion-content');
        if (content) {
          if (item.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.style.maxHeight = '0';
          }
        }
      }
    });
  });
}

// Close all accordions except the one that was clicked
function closeOtherAccordions(clickedItem) {
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  accordionItems.forEach(item => {
    if (item !== clickedItem && item.classList.contains('active')) {
      item.classList.remove('active');
      
      const content = item.querySelector('.accordion-content');
      if (content) {
        content.style.maxHeight = '0';
      }
    }
  });
}

// Apply glow effect to an element
export function applyGlowEffect(element, color = '#00e5ff', intensity = 5) {
  if (!element) return;
  
  // Add class for animation
  element.classList.add('neon-glow');
  
  // Apply color and intensity
  element.style.boxShadow = `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}`;
  
  // Optionally add text shadow for text elements
  if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN'].includes(element.tagName)) {
    element.style.textShadow = `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}`;
  }
}

// Remove glow effect from an element
export function removeGlowEffect(element) {
  if (!element) return;
  
  // Remove class
  element.classList.remove('neon-glow');
  
  // Reset styles
  element.style.boxShadow = '';
  element.style.textShadow = '';
}

// Initialize UI effects
export function initUIEffects() {
  // Add ripple effects to UI elements
  addRippleToButtons();
  addRippleToAccordions();
  
  return {
    createRipple,
    applyGlowEffect,
    removeGlowEffect
  };
}
