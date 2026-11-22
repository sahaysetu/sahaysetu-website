// ==========================================
// SAHAYSETU - SERVICE SEARCH
// ==========================================

const searchInput = document.getElementById("serviceSearch");
const searchButton = document.getElementById("searchButton");
const serviceCards = document.querySelectorAll(".service-card");
const serviceMessage = document.getElementById("searchMessage");

function searchServices() {
  const query = searchInput.value.toLowerCase().trim();
  let matches = 0;

  serviceCards.forEach(card => {
    const content = (
      card.innerText + " " + (card.dataset.key || "")
    ).toLowerCase();

    const found = content.includes(query);

    card.style.display = found ? "" : "none";

    if (found) matches++;
  });

  serviceMessage.textContent = query
    ? matches + " matching services found"
    : "";
}

searchButton.addEventListener("click", searchServices);
searchInput.addEventListener("input", searchServices);


// ==========================================
// SAHAYSETU - DOCTOR DIRECTORY
// ==========================================

const doctorSearch = document.getElementById("doctorSearch");
const specialtyFilter = document.getElementById("specialtyFilter");
const doctorCards = document.querySelectorAll(".doctor-card");
const doctorMessage = document.getElementById("doctorMessage");

function filterDoctors() {
  const query = doctorSearch.value.toLowerCase().trim();
  const selectedBackground = specialtyFilter.value.toLowerCase();

  let count = 0;

  doctorCards.forEach(card => {

    const searchableContent = [
      card.dataset.name,
      card.dataset.specialty,
      card.dataset.background,
      card.dataset.qualification,
      card.dataset.council,
      card.dataset.registration,
      card.innerText
    ].join(" ").toLowerCase();

    const matchesSearch = searchableContent.includes(query);

    const matchesBackground =
      !selectedBackground ||
      (card.dataset.specialty || "").toLowerCase() === selectedBackground;

    const visible = matchesSearch && matchesBackground;

    card.style.display = visible ? "" : "none";

    if (visible) count++;
  });

  doctorMessage.textContent =
    count + (count === 1
      ? " doctor found"
      : " doctors found");
}

doctorSearch.addEventListener("input", filterDoctors);
specialtyFilter.addEventListener("change", filterDoctors);


// ==========================================
// DOCTOR PROFILE MODAL
// ==========================================

// Modal styling is added here so you do not
// need to modify your CSS tab for this step.

const modalStyles = document.createElement("style");

modalStyles.textContent = `
.doctor-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(12, 35, 52, 0.68);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.doctor-modal {
  background: #ffffff;
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 18px;
  padding: 26px;
  position: relative;
  box-shadow: 0 18px 60px rgba(0,0,0,.2);
}

.doctor-modal-close {
  position: absolute;
  top: 12px;
  right: 15px;
  border: none;
  background: #edf4f4;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 22px;
  cursor: pointer;
  color: #183b50;
}

.doctor-modal h2 {
  color: #183b50;
  font-size: 23px;
  margin: 14px 0 5px;
}

.doctor-modal .modal-qualification {
  color: #16877f;
  font-weight: 600;
  margin-bottom: 18px;
}

.doctor-modal .modal-detail {
  padding: 11px 0;
  border-bottom: 1px solid #e8eeee;
  color: #405461;
  font-size: 14px;
  line-height: 1.6;
}

.doctor-modal .modal-detail strong {
  display: block;
  color: #183b50;
  margin-bottom: 3px;
}

.doctor-modal .modal-notice {
  margin-top: 18px;
  padding: 12px;
  border-radius: 9px;
  background: #fff7e8;
  color: #805b19;
  font-size: 12px;
  line-height: 1.6;
}
`;

document.head.appendChild(modalStyles);


// Create modal elements

const modalOverlay = document.createElement("div");

modalOverlay.className = "doctor-modal-overlay";
modalOverlay.style.display = "none";

modalOverlay.innerHTML = `
  <div class="doctor-modal" role="dialog"
       aria-modal="true" aria-labelledby="doctorModalName">

    <button class="doctor-modal-close"
      type="button" aria-label="Close profile">×</button>

    <div id="doctorModalContent"></div>

  </div>
`;

document.body.appendChild(modalOverlay);

const modalContent =
  modalOverlay.querySelector("#doctorModalContent");

const modalClose =
  modalOverlay.querySelector(".doctor-modal-close");


function addProfileDetail(label, value) {
  const wrapper = document.createElement("div");
  wrapper.className = "modal-detail";

  const heading = document.createElement("strong");
  heading.textContent = label;

  const content = document.createElement("span");
  content.textContent = value || "Not provided";

  wrapper.appendChild(heading);
  wrapper.appendChild(content);

  return wrapper;
}


function openDoctorProfile(card) {

  modalContent.innerHTML = "";

  const name = card.dataset.name || "Doctor";
  const qualification = card.dataset.qualification || "Not provided";

  const heading = document.createElement("h2");
  heading.id = "doctorModalName";
  heading.textContent = name;

  const qualificationText = document.createElement("p");
  qualificationText.className = "modal-qualification";
  qualificationText.textContent = qualification;

  modalContent.appendChild(heading);
  modalContent.appendChild(qualificationText);

  modalContent.appendChild(
    addProfileDetail(
      "Professional Background",
      card.dataset.background
    )
  );

  modalContent.appendChild(
    addProfileDetail(
      "Medical Council",
      card.dataset.council
    )
  );

  modalContent.appendChild(
    addProfileDetail(
      "Registration Number",
      card.dataset.registration
    )
  );

  modalContent.appendChild(
    addProfileDetail(
      "Years of Experience",
      card.dataset.experience
        ? card.dataset.experience + " years"
        : "Not provided"
    )
  );

  const notice = document.createElement("div");
  notice.className = "modal-notice";

  notice.textContent =
    "Profile information has been submitted to SAHAYSETU. " +
    "Registration credentials and professional details " +
    "must be independently verified before public booking.";

  modalContent.appendChild(notice);
// BOOK APPOINTMENT BUTTON

const bookButton = document.createElement("button");

bookButton.type = "button";
bookButton.className = "profile-button";
bookButton.textContent = "Book Appointment";

bookButton.style.cssText = `
  width:100%;
  margin-top:18px;
  padding:14px;
  border:0;
  border-radius:10px;
  background:#16877f;
  color:white;
  font-size:15px;
  font-weight:600;
  cursor:pointer;
`;

bookButton.addEventListener("click", () => {
  openBookingForm(card);
});

modalContent.appendChild(bookButton);
  modalOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";

  modalClose.focus();
}


function closeDoctorProfile() {
  modalOverlay.style.display = "none";
  document.body.style.overflow = "";
}


doctorCards.forEach(card => {

  const button = card.querySelector(".profile-button");

  if (button) {
    button.addEventListener("click", () => {
      openDoctorProfile(card);
    });
  }

});

modalClose.addEventListener("click", closeDoctorProfile);

modalOverlay.addEventListener("click", event => {
  if (event.target === modalOverlay) {
    closeDoctorProfile();
  }
});

document.addEventListener("keydown", event => {
  if (
    event.key === "Escape" &&
    modalOverlay.style.display === "flex"
  ) {
    closeDoctorProfile();
  }
});


// Initial directory display
filterDoctors();
// ==========================================
// SAHAYSETU - APPOINTMENT BOOKING SYSTEM
// DEMONSTRATION VERSION
// ==========================================
const SAHAYSETU_API =
  "https://sahaysetu-booking-api.sahaysetu-official.workers.dev";
const bookingStyles = document.createElement("style");

bookingStyles.textContent = `
.booking-overlay {
  position:fixed;
  inset:0;
  z-index:10000;
  background:rgba(12,35,52,.72);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:14px;
}

.booking-modal {
  width:100%;
  max-width:500px;
  max-height:92vh;
  overflow-y:auto;
  background:#fff;
  border-radius:18px;
  padding:25px;
  position:relative;
  box-shadow:0 18px 60px rgba(0,0,0,.25);
}

.booking-modal h2 {
  color:#183b50;
  margin:8px 0;
  font-size:23px;
}

.booking-modal .booking-subtitle {
  color:#647782;
  font-size:13px;
  line-height:1.6;
  margin-bottom:20px;
}

.booking-modal label {
  display:block;
  color:#294453;
  font-size:13px;
  font-weight:600;
  margin:15px 0 7px;
}

.booking-modal input,
.booking-modal select {
  width:100%;
  box-sizing:border-box;
  padding:12px;
  border:1px solid #dce6e8;
  border-radius:9px;
  font-size:14px;
  background:#fff;
  color:#183b50;
}

.booking-modal input:focus,
.booking-modal select:focus {
  outline:2px solid #b9e3df;
  border-color:#16877f;
}

.booking-submit {
  width:100%;
  margin-top:22px;
  padding:14px;
  border:0;
  border-radius:10px;
  background:#16877f;
  color:white;
  font-size:15px;
  font-weight:600;
  cursor:pointer;
}

.booking-close {
  position:absolute;
  top:13px;
  right:14px;
  width:34px;
  height:34px;
  border:0;
  border-radius:50%;
  background:#edf4f4;
  font-size:22px;
  cursor:pointer;
  color:#183b50;
}

.booking-doctor {
  background:#edf7f6;
  border-radius:10px;
  padding:13px;
  color:#16877f;
  font-weight:600;
  margin:15px 0;
}

.booking-notice {
  margin-top:15px;
  padding:11px;
  background:#fff7e8;
  color:#805b19;
  border-radius:9px;
  font-size:12px;
  line-height:1.6;
}

.booking-success {
  text-align:center;
  padding:20px 5px;
}

.booking-success .success-icon {
  font-size:48px;
  color:#16877f;
}

.booking-success p {
  color:#526875;
  line-height:1.7;
  font-size:14px;
}

.booking-success .booking-reference {
  background:#edf7f6;
  padding:13px;
  border-radius:9px;
  color:#16877f;
  font-weight:700;
  margin:18px 0;
}
`;

document.head.appendChild(bookingStyles);


// CREATE BOOKING MODAL

const bookingOverlay = document.createElement("div");

bookingOverlay.className = "booking-overlay";
bookingOverlay.style.display = "none";

bookingOverlay.innerHTML = `
  <div class="booking-modal"
       role="dialog"
       aria-modal="true"
       aria-labelledby="bookingTitle">

    <button type="button"
      class="booking-close"
      aria-label="Close booking">×</button>

    <div id="bookingContent"></div>

  </div>
`;

document.body.appendChild(bookingOverlay);

const bookingContent =
  bookingOverlay.querySelector("#bookingContent");

const bookingClose =
  bookingOverlay.querySelector(".booking-close");

let selectedDoctor = null;


// GET LOCAL DATE

function getLocalDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


// OPEN BOOKING FORM

function openBookingForm(card) {

  selectedDoctor = card;

  const doctorName = card.dataset.name || "Doctor";

  bookingContent.innerHTML = `
    <div class="eyebrow">SAHAYSETU APPOINTMENTS</div>

    <h2 id="bookingTitle">Book an Appointment</h2>

    <p class="booking-subtitle">
      Complete the details below to review your
      appointment request.
    </p>

    <div class="booking-doctor" id="bookingDoctor"></div>

    <form id="appointmentForm">

      <label for="patientName">Patient Name</label>
      <input
        type="text"
        id="patientName"
        placeholder="Enter patient's full name"
        autocomplete="name"
        required
        maxlength="100">

      <label for="patientPhone">Mobile Number</label>
      <input
        type="tel"
        id="patientPhone"
        placeholder="10-digit mobile number"
        inputmode="numeric"
        pattern="[6-9][0-9]{9}"
        maxlength="10"
        autocomplete="tel"
        required>

      <label for="consultationType">Consultation Type</label>
      <select id="consultationType" required>
        <option value="">Select consultation type</option>
        <option value="Video Consultation">Video Consultation</option>
        <option value="Audio Consultation">Audio Consultation</option>
        <option value="In-person Consultation">In-person Consultation</option>
      </select>

      <label for="appointmentDate">Preferred Date</label>
      <input
        type="date"
        id="appointmentDate"
        min="${getLocalDate()}"
        required>

      <label for="appointmentTime">Preferred Time Slot</label>
      <select id="appointmentTime" required>
        <option value="">Select preferred time</option>
        <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
        <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
        <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
        <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
        <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
        <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
      </select>

      <div class="booking-notice">
        This is a demonstration booking form.
        Time slots are illustrative and are not connected
        to actual doctor availability.
      </div>
<button type="button" class="booking-submit">
  Review Appointment
</button>

    </form>
  `;

  bookingContent.querySelector("#bookingDoctor").textContent =
    "Selected Doctor: " + doctorName;
  bookingOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  bookingContent.querySelector("#patientName").focus();
const reviewButton =
  bookingContent.querySelector(".booking-submit");

reviewButton.addEventListener("click", reviewAppointment);
} // END OF openBookingForm


function reviewAppointment() {

  console.log("SAHAYSETU: Direct review started");

  const form = bookingContent.querySelector("#appointmentForm");

  if (!form.reportValidity()) return;

  const patientName =
    bookingContent.querySelector("#patientName").value.trim();

  const patientPhone =
    bookingContent.querySelector("#patientPhone").value.trim();

  const consultation =
    bookingContent.querySelector("#consultationType").value;

  const appointmentDate =
    bookingContent.querySelector("#appointmentDate").value;

  const appointmentTime =
    bookingContent.querySelector("#appointmentTime").value;

  if (!/^[6-9][0-9]{9}$/.test(patientPhone)) {
    alert("Please enter a valid 10-digit Indian mobile number.");
    return;
  }

  if (appointmentDate < getLocalDate()) {
    alert("Please select today or a future date.");
    return;
  }

  if (!selectedDoctor) return;

  bookingContent.innerHTML = `
    <div class="eyebrow">APPOINTMENT REVIEW</div>
    <h2 id="bookingTitle">Confirm Your Details</h2>

    <p class="booking-subtitle">
      Please review your appointment details.
    </p>

    <div id="bookingSummary"></div>

    <div class="booking-notice">
      This is a demonstration booking only.
      No appointment is transmitted to a doctor or clinic.
    </div>

    <button type="button" class="booking-submit"
      id="confirmBooking">
      Confirm Demo Booking
    </button>

    <button type="button" class="booking-submit"
      id="editBooking"
      style="background:#edf4f4;color:#183b50;margin-top:10px">
      Go Back and Edit
    </button>
  `;

  const summary =
    bookingContent.querySelector("#bookingSummary");

  const details = [
    ["Patient", patientName],
    ["Mobile", patientPhone],
    ["Doctor", selectedDoctor.dataset.name],
    ["Consultation", consultation],
    ["Preferred Date", appointmentDate],
    ["Preferred Time", appointmentTime]
  ];

  details.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "modal-detail";

    const heading = document.createElement("strong");
    heading.textContent = label;

    const content = document.createElement("span");
    content.textContent = value;

    item.append(heading, content);
    summary.appendChild(item);
  });

  bookingContent.querySelector("#editBooking")
    .addEventListener("click", () => {
      openBookingForm(selectedDoctor);
    });


bookingContent.querySelector("#confirmBooking")
  .addEventListener("click", async function () {

    const confirmButton = this;

    confirmButton.disabled = true;
    confirmButton.textContent = "Submitting appointment...";

    const payload = {
      patientName: patientName,
      patientPhone: patientPhone,
      doctorName: selectedDoctor.dataset.name || "Doctor",
      doctorSpecialty: selectedDoctor.dataset.specialty || "",
      consultationType: consultation,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime
    };

    try {
      const response = await fetch(
        SAHAYSETU_API + "/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Booking submission failed."
        );
      }

      const reference = result.booking.bookingRef;

      if (!reference) {
        throw new Error("Booking reference missing.");
      }

      bookingContent.innerHTML = `
        <div class="booking-success">
          <div class="success-icon">✓</div>

          <h2>Appointment Request Received!</h2>

          <p>
            Your appointment request has been
            successfully submitted to SAHAYSETU.
          </p>

          <div class="booking-reference"
               id="bookingReference"></div>

          <p><strong>Booking Status: Pending</strong></p>

          <p>
            Your request is awaiting review.
            This is not yet a confirmed appointment.
          </p>

          <button type="button"
            class="booking-submit"
            id="copyBookingReference">
            Copy Reference Code
          </button>

          <button type="button"
            class="booking-submit"
            id="finishBooking"
            style="background:#edf4f4;color:#183b50;margin-top:10px">
            Close
          </button>
        </div>
      `;

      bookingContent.querySelector("#bookingReference")
        .textContent = "Reference: " + reference;

      bookingContent.querySelector("#copyBookingReference")
        .addEventListener("click", async function () {
          try {
            await navigator.clipboard.writeText(reference);
            this.textContent = "Copied Successfully!";
          } catch (error) {
            this.textContent = reference;
          }
        });

      bookingContent.querySelector("#finishBooking")
        .addEventListener("click", closeBookingForm);

    } catch (error) {
      console.error("SAHAYSETU booking error:", error);

      confirmButton.disabled = false;
      confirmButton.textContent = "Retry Submission";

      let errorMessage = bookingContent.querySelector(
        "#bookingSubmissionError"
      );

      if (!errorMessage) {
        errorMessage = document.createElement("p");
        errorMessage.id = "bookingSubmissionError";

        errorMessage.style.cssText =
          "color:#c0392b;font-size:13px;margin-top:12px";

        confirmButton.after(errorMessage);
      }

      errorMessage.textContent =
        error.message || "Unable to submit booking. Please try again.";
    }
  });

}


// CLOSE BOOKING MODAL

function closeBookingForm() {

  bookingOverlay.style.display = "none";

  if (modalOverlay.style.display !== "flex") {
    document.body.style.overflow = "";
  }

}

bookingClose.addEventListener("click", closeBookingForm);

bookingOverlay.addEventListener("click", event => {

  if (event.target === bookingOverlay) {
    closeBookingForm();
  }

});

document.addEventListener("keydown", event => {

  if (
    event.key === "Escape" &&
    bookingOverlay.style.display === "flex"
  ) {
    closeBookingForm();
  }

});


// END OF SAHAYSETU APPOINTMENT BOOKING SYSTEM 


/* ==========================================
   SAHAYSETU - LAB TEST SEARCH & NAVIGATION
========================================== */

// LAB TEST SEARCH

const labSearch = document.getElementById("labSearch");
const labCards = document.querySelectorAll(".lab-card");
const labMessage = document.getElementById("labMessage");

if (labSearch) {

  labSearch.addEventListener("input", function () {

    const query = this.value.toLowerCase().trim();
    let count = 0;

    labCards.forEach(card => {

      const content = (
        card.innerText + " " + (card.dataset.test || "")
      ).toLowerCase();

      const found = content.includes(query);

      card.style.display = found ? "" : "none";

      if (found) count++;

    });

    labMessage.textContent = query
      ? count + " matching tests found"
      : "";

  });

}


// BOOK LAB TESTS SERVICE CARD NAVIGATION

const labServiceCard = document.querySelector(
  '.service-card[data-target="lab-tests"]'
);

if (labServiceCard) {

  labServiceCard.style.cursor = "pointer";
  labServiceCard.setAttribute("tabindex", "0");
  labServiceCard.setAttribute("role", "link");

  function openLabSection() {

    document.getElementById("lab-tests")
      .scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }

  labServiceCard.addEventListener("click", openLabSection);

  labServiceCard.addEventListener("keydown", function(event) {

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLabSection();
    }

  });

}

console.log("SAHAYSETU: Lab Tests module loaded");


// ==========================================
// SAHAYSETU - SERVICE CARD NAVIGATION
// ==========================================

document.querySelectorAll(".service-card[data-target]")
  .forEach(card => {

    card.style.cursor = "pointer";

    card.addEventListener("click", function () {

      const targetId = this.dataset.target;
      const targetSection = document.getElementById(targetId);

      if (!targetSection) {
        console.warn("SAHAYSETU: Section not found:", targetId);
        return;
      }

      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });

console.log("SAHAYSETU: Service navigation loaded");


// ==========================================
// SAHAYSETU - LAB TEST SELECTION SYSTEM
// ==========================================

(function () {

  const labGrid = document.getElementById("labGrid");
  const selectedTestsList = document.getElementById("selectedTestsList");
  const selectedTestCount = document.getElementById("selectedTestCount");
  const customTestInput = document.getElementById("customTestName");
  const addCustomTestButton = document.getElementById("addCustomTest");
  const selectedTestsSection =
  document.getElementById("selectedTestsSection");

const continueToCollection =
  document.getElementById("continueToCollection");

const collectionSection =
  document.getElementById("collectionPreference");

const patientSection =
  document.getElementById("labPatientDetails");

const collectionRadios =
  document.querySelectorAll('input[name="collectionMethod"]');
  const preferredLab = document.getElementById("preferredLab");
const selectedLabName = document.getElementById("selectedLabName");

if (preferredLab && selectedLabName) {
  preferredLab.addEventListener("change", function () {
    selectedLabName.textContent = this.value
      ? "Preferred Lab: " + this.value
      : "Preferred Lab: Not selected";
  });
}
  if (!labGrid || !selectedTestsList || !selectedTestCount) {
    console.warn("SAHAYSETU: Lab selection elements not found.");
    return;
  }

  const selectedTests = [];

  function addTest(testName) {
    const name = testName.trim();

    if (!name) return;

    const exists = selectedTests.some(
      test => test.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      alert("This test is already selected.");
      return;
    }

    selectedTests.push(name);
    renderSelectedTests();
  }

  function renderSelectedTests() {
    selectedTestCount.textContent = selectedTests.length;
    selectedTestsSection.hidden = selectedTests.length === 0;

// Reset later steps if all tests are removed
if (selectedTests.length === 0) {
  collectionSection.hidden = true;
  patientSection.hidden = true;

  collectionRadios.forEach(radio => {
    radio.checked = false;
  });
}

    selectedTestsList.innerHTML = "";

    if (selectedTests.length === 0) {
      selectedTestsList.innerHTML =
        '<p class="empty-selection">No tests selected yet.</p>';
      return;
    }

    selectedTests.forEach((test, index) => {
      const item = document.createElement("div");
      item.className = "selected-test-item";

      const name = document.createElement("span");
      name.textContent = test;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "remove-selected-test";
      removeButton.textContent = "Remove";

      removeButton.addEventListener("click", function () {
        selectedTests.splice(index, 1);
        renderSelectedTests();
      });

      item.appendChild(name);
      item.appendChild(removeButton);

      selectedTestsList.appendChild(item);
    });
  }

  // Add standard tests
  labGrid.addEventListener("click", function (event) {
    const button = event.target.closest(".lab-select-button");

    if (!button) return;

    const card = button.closest(".lab-card");
    const heading = card?.querySelector("h3");

    if (heading) {
      addTest(heading.textContent);
    }
  });

  // Add custom tests
  if (addCustomTestButton && customTestInput) {
    addCustomTestButton.addEventListener("click", function () {
      const name = customTestInput.value.trim();

      if (!name) {
        alert("Please enter a test name.");
        customTestInput.focus();
        return;
      }

      addTest(name);
      customTestInput.value = "";
    });

    customTestInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addCustomTestButton.click();
      }
    });
  }

  // Continue from selected tests to collection method
if (continueToCollection) {
  continueToCollection.addEventListener("click", function () {

    if (selectedTests.length === 0) {
      alert("Please select at least one test.");
      return;
    }

    collectionSection.hidden = false;
    patientSection.hidden = true;

    collectionSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });
}

// Reveal patient details only after collection method selection
collectionRadios.forEach(radio => {
  radio.addEventListener("change", function () {

    if (!this.checked) return;

    patientSection.hidden = false;

    const addressField =
      document.getElementById("labAddressField");

    if (addressField) {
      addressField.style.display =
        this.value === "Home Sample Collection" ? "block" : "none";
    }

    setTimeout(() => {
      patientSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);

  });
});

  renderSelectedTests();

  console.log("SAHAYSETU: Lab test selection system loaded");
})();
/* ==========================================
   SAHAYSETU - PUBLIC APPOINTMENT TRACKING
========================================== */

(function () {

  const trackingForm = document.getElementById("trackingForm");
  const trackingInput = document.getElementById("trackingReference");
  const trackingButton = document.getElementById("trackingButton");
  const trackingResult = document.getElementById("trackingResult");

  if (!trackingForm || !trackingInput ||
      !trackingButton || !trackingResult) return;

  trackingInput.addEventListener("input", function () {
    this.value = this.value.toUpperCase().trim();
  });

  trackingForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const reference = trackingInput.value.trim().toUpperCase();

    if (!/^SH-[A-F0-9]{10}$/.test(reference)) {
      trackingResult.hidden = false;
      trackingResult.className = "tracking-result error";
      trackingResult.textContent =
        "Please enter a valid SAHAYSETU booking reference.";
      return;
    }

    trackingButton.disabled = true;
    trackingButton.textContent = "Checking...";
    trackingResult.hidden = false;
    trackingResult.className = "tracking-result";
    trackingResult.textContent = "Retrieving your appointment details...";

    try {

      const response = await fetch(
        SAHAYSETU_API + "/api/bookings/" +
        encodeURIComponent(reference)
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.booking) {
        throw new Error(
          result.message || "Booking record not found."
        );
      }

      const booking = result.booking;

      trackingResult.innerHTML = "";

      const heading = document.createElement("h3");
      heading.textContent = "Appointment Details";

      const status = document.createElement("span");
      status.className = "tracking-status";
      status.textContent = booking.status || "Unknown";

      trackingResult.append(heading, status);

      const details = [
        ["Reference", booking.bookingRef],
        ["Doctor", booking.doctorName],
        ["Specialty", booking.doctorSpecialty],
        ["Consultation", booking.consultationType],
        ["Appointment Date", booking.appointmentDate],
        ["Preferred Time", booking.appointmentTime]
      ];

      details.forEach(([label, value]) => {

        const line = document.createElement("div");
        const strong = document.createElement("strong");

        strong.textContent = label + ": ";

        const text = document.createTextNode(value || "Not available");

        line.append(strong, text);
        trackingResult.appendChild(line);

      });

      const message = document.createElement("p");
      message.style.marginBottom = "0";

      const statusMessages = {
        pending: "Your appointment request is awaiting review.",
        confirmed: "Your appointment has been confirmed.",
        rejected: "Your appointment request has been rejected.",
        rescheduled: "Your appointment has been rescheduled."
      };

      message.textContent =
        statusMessages[(booking.status || "").toLowerCase()] ||
        "Please contact SAHAYSETU for an update.";

      trackingResult.appendChild(message);

    } catch (error) {

      console.error("SAHAYSETU tracking error:", error);

      trackingResult.className = "tracking-result error";
      trackingResult.textContent =
        error.message || "Unable to retrieve your booking.";

    } finally {

      trackingButton.disabled = false;
      trackingButton.textContent = "Track Appointment";

    }

  });

  console.log("SAHAYSETU: Appointment tracking loaded");

})();
