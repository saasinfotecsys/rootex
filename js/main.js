/* ==========================================================================
   Rootex Multi Speciality Dental & Hair Clinic - Main Interactive Script
   High-converting features: Dynamic OPD status, WhatsApp booking builder,
   dual department switching, and appointment routing.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initClinicStatus();
  initDepartmentSwitcher();
  initBookingEngine();
  initTransformationTabs();
  initSmoothScroll();
});

/**
 * 1. Dynamic Live Clinic Status Indicator (Based on Kolkata Clinic OPD Hours)
 * Morning: 10:00 AM - 1:00 PM | Evening: 6:00 PM - 9:30 PM
 */
function initClinicStatus() {
  const statusBadge = document.getElementById('clinicLiveStatus');
  const statusPulse = document.getElementById('statusPulse');
  if (!statusBadge) return;

  function updateStatus() {
    const now = new Date();
    // Get current Kolkata local time hours and minutes
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeVal = hours + minutes / 60;

    let statusText = '';
    let isOpen = false;

    if (currentTimeVal >= 10 && currentTimeVal < 13) {
      isOpen = true;
      statusText = 'Open Now • Morning OPD (Closes 1:00 PM)';
    } else if (currentTimeVal >= 13 && currentTimeVal < 18) {
      isOpen = false;
      statusText = 'Afternoon Break • Reopens 6:00 PM (Evening OPD)';
    } else if (currentTimeVal >= 18 && currentTimeVal < 21.5) {
      isOpen = true;
      statusText = 'Open Now • Evening OPD (Closes 9:30 PM)';
    } else {
      isOpen = false;
      statusText = 'Closed for the day • Opens Tomorrow 10:00 AM';
    }

    statusBadge.innerHTML = `
      <span class="status-pulse" style="background: ${isOpen ? '#10b981' : '#f59e0b'};"></span>
      <span>${statusText}</span>
    `;
  }

  updateStatus();
  setInterval(updateStatus, 60000); // Check every minute
}

/**
 * 2. Interactive Department Filter (Dental Care vs Hair Solutions)
 */
function initDepartmentSwitcher() {
  const btnDental = document.getElementById('tabBtnDental');
  const btnHair = document.getElementById('tabBtnHair');
  const gridDental = document.getElementById('dentalServicesGrid');
  const gridHair = document.getElementById('hairServicesGrid');

  if (!btnDental || !btnHair || !gridDental || !gridHair) return;

  btnDental.addEventListener('click', () => {
    btnDental.classList.add('active');
    btnHair.classList.remove('active');
    gridDental.classList.remove('d-none');
    gridHair.classList.add('d-none');
  });

  btnHair.addEventListener('click', () => {
    btnHair.classList.add('active');
    btnDental.classList.remove('active');
    gridHair.classList.remove('d-none');
    gridDental.classList.add('d-none');
  });
}

/**
 * 3. Transformation Gallery Switcher (Smile vs Hair results)
 */
function initTransformationTabs() {
  const tabSmile = document.getElementById('tabSmileResult');
  const tabHair = document.getElementById('tabHairResult');
  const viewSmile = document.getElementById('viewSmileResult');
  const viewHair = document.getElementById('viewHairResult');

  if (!tabSmile || !tabHair || !viewSmile || !viewHair) return;

  tabSmile.addEventListener('click', () => {
    tabSmile.classList.add('active');
    tabHair.classList.remove('active');
    viewSmile.classList.remove('d-none');
    viewHair.classList.add('d-none');
  });

  tabHair.addEventListener('click', () => {
    tabHair.classList.add('active');
    tabSmile.classList.remove('active');
    viewHair.classList.remove('d-none');
    viewSmile.classList.add('d-none');
  });
}

/**
 * 4. High-Converting Appointment Booking Engine
 * Supports automated WhatsApp message pre-fill & instant direct routing
 */
function initBookingEngine() {
  const bookingForm = document.getElementById('appointmentForm');
  const deptSelect = document.getElementById('bookDept');
  const serviceSelect = document.getElementById('bookService');

  // Service catalogs mapping
  const serviceOptions = {
    dental: [
      'Painless Root Canal Treatment (RCT)',
      'Orthodontics (Braces & Clear Aligners)',
      'Cosmetic Smile Makeover & Teeth Whitening',
      'Dental Implants & Fixed Crown/Bridges',
      'Pediatric Child Dental Checkup',
      'Wisdom Tooth Extraction & Minor Surgery',
      'Ultrasonic Scaling & Gum Treatment',
      'General Dental Consultation'
    ],
    hair: [
      'Advanced Hair Fall Diagnosis & Trichology Consultation',
      'PRP (Platelet-Rich Plasma) Therapy',
      'GFC (Growth Factor Concentrate) Therapy',
      'Scalp Detox & Anti-Dandruff Therapy',
      'Hair Thinning & Density Restoration'
    ]
  };

  function populateServices(dept) {
    if (!serviceSelect) return;
    serviceSelect.innerHTML = '';
    const list = serviceOptions[dept] || serviceOptions.dental;
    list.forEach(svc => {
      const opt = document.createElement('option');
      opt.value = svc;
      opt.textContent = svc;
      serviceSelect.appendChild(opt);
    });
  }

  if (deptSelect) {
    deptSelect.addEventListener('change', (e) => {
      populateServices(e.target.value);
    });
    // Init default options
    populateServices(deptSelect.value || 'dental');
  }

  // Pre-fill when clicking "Book for this" from service cards
  document.querySelectorAll('.btn-quick-book-service').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetDept = btn.getAttribute('data-dept') || 'dental';
      const targetService = btn.getAttribute('data-service') || '';
      
      if (deptSelect) {
        deptSelect.value = targetDept;
        populateServices(targetDept);
      }
      if (serviceSelect && targetService) {
        serviceSelect.value = targetService;
      }

      // Smooth scroll to booking section
      const bookSection = document.getElementById('bookingSection');
      if (bookSection) {
        bookSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Handle Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patientName').value.trim();
      const phone = document.getElementById('patientPhone').value.trim();
      const dept = deptSelect ? deptSelect.value : 'dental';
      const service = serviceSelect ? serviceSelect.value : 'General Consultation';
      const date = document.getElementById('bookDate').value;
      const slot = document.getElementById('bookSlot').value;
      const notes = document.getElementById('patientNotes') ? document.getElementById('patientNotes').value.trim() : '';

      if (!name || !phone) {
        alert('Please enter your Name and Phone Number.');
        return;
      }

      // Format WhatsApp pre-filled message
      const clinicPhone = '919432535722'; // 094325 35722
      const deptName = dept === 'dental' ? 'Dental Department' : 'Hair & Scalp Clinic';

      let msg = `*Appointment Request - ROOTEX Clinic*\n\n`;
      msg += `👤 *Patient Name:* ${name}\n`;
      msg += `📞 *Phone:* ${phone}\n`;
      msg += `🏥 *Department:* ${deptName}\n`;
      msg += `🩺 *Service:* ${service}\n`;
      msg += `📅 *Preferred Date:* ${date || 'Earliest Available'}\n`;
      msg += `⏰ *Shift:* ${slot}\n`;
      if (notes) {
        msg += `📝 *Notes/Symptoms:* ${notes}\n`;
      }
      msg += `\nPlease confirm my appointment slot. Thank you!`;

      const waUrl = `https://wa.me/${clinicPhone}?text=${encodeURIComponent(msg)}`;

      // Show confirmation alert / modal and open WhatsApp
      const alertBox = document.getElementById('bookingSuccessMsg');
      if (alertBox) {
        alertBox.classList.remove('d-none');
        alertBox.innerHTML = `
          <strong>Appointment Details Ready!</strong> Redirecting you to WhatsApp to confirm your slot directly with Dr. Aoisik Chattopadhyay...
        `;
      }

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 700);
    });
  }
}

/**
 * 5. Smooth Scroll navigation & close mobile navbar on click
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.getElementById('navbarRootexNav');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });
}
