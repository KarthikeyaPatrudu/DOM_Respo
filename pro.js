// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
  // Get form and table elements
  const studentForm = document.getElementById('student-form');
  const studentTable = document.getElementById('student-table').getElementsByTagName('tbody')[0];

  // Load student data from localStorage if available
  loadStudentData();

  // Event listener for form submission
  studentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form data
    const studentName = document.getElementById('student-name').value.trim();
    const studentId = document.getElementById('student-id').value.trim();
    const email = document.getElementById('email').value.trim();
    const contactNo = document.getElementById('contact-no').value.trim();

    // Validate inputs
    if (!validateInputs(studentName, studentId, email, contactNo)) {
      alert('Please fill all fields correctly.');
      return;
    }

    // Create student object
    const student = {
      name: studentName,
      id: studentId,
      email: email,
      contact: contactNo
    };

    // Check if the student ID already exists (for editing)
    const existingStudentIndex = findStudentIndexById(studentId);

    if (existingStudentIndex !== -1) {
      // Edit existing student
      updateStudentInTable(existingStudentIndex, student);
    } else {
      // Add new student
      addStudentToTable(student);
    }

    // Clear form
    studentForm.reset();
  });

  // Load student data from localStorage and display it
  function loadStudentData() {
    const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
    storedStudents.forEach(student => addStudentToTable(student));
  }

  // Add student to table and store in localStorage
  function addStudentToTable(student) {
    // Create a new row
    const row = studentTable.insertRow();
    const index = studentTable.rows.length - 1;

    row.insertCell(0).innerText = student.name;
    row.insertCell(1).innerText = student.id;
    row.insertCell(2).innerText = student.email;
    row.insertCell(3).innerText = student.contact;

    // Create edit and delete buttons
    const actionsCell = row.insertCell(4);
    actionsCell.classList.add('actions');
    actionsCell.innerHTML = `
      <button onclick="editStudent(${index})">Edit</button>
      <button onclick="deleteStudent(${index})">Delete</button>
    `;

    // Store updated student data in localStorage
    storeStudentsInLocalStorage();
  }

  // Edit student record
  window.editStudent = function (index) {
    const student = JSON.parse(localStorage.getItem('students'))[index];

    document.getElementById('student-name').value = student.name;
    document.getElementById('student-id').value = student.id;
    document.getElementById('email').value = student.email;
    document.getElementById('contact-no').value = student.contact;

    // Remove the student from the table (it will be updated when submitted)
    deleteStudent(index);
  };

  // Delete student record
  window.deleteStudent = function (index) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    students.splice(index, 1);  // Remove student at the specified index

    // Update table and localStorage
    studentTable.deleteRow(index);
    storeStudentsInLocalStorage(students);
  };

  // Store updated student data in localStorage
  function storeStudentsInLocalStorage() {
    const students = [];
    for (let i = 0; i < studentTable.rows.length; i++) {
      const row = studentTable.rows[i];
      const student = {
        name: row.cells[0].innerText,
        id: row.cells[1].innerText,
        email: row.cells[2].innerText,
        contact: row.cells[3].innerText
      };
      students.push(student);
    }

    localStorage.setItem('students', JSON.stringify(students));
  }

  // Find the index of a student by their student ID
  function findStudentIndexById(studentId) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    return students.findIndex(student => student.id === studentId);
  }

  // Validate input fields
  function validateInputs(name, studentId, email, contact) {
    const nameRegex = /^[a-zA-Z\s]+$/;  // Only letters and spaces for name
    const idRegex = /^[0-9]+$/;  // Only numbers for ID
    const contactRegex = /^[0-9]{10}$/;  // Only numbers, exactly 10 digits for contact

    return nameRegex.test(name) && idRegex.test(studentId) && validateEmail(email) && contactRegex.test(contact);
  }

  // Validate email format
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

});
