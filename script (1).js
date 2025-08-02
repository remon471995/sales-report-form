// Advanced Sales Form Script
document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxLSJS26JEwbmuDOcvwaN1nTawevdltNl9Pup7uHAgUdSQU81eCCUpQIwepHDlnSKdR/exec';
    const LOCAL_STORAGE_KEY = 'salesFormData';

    // --- DOM ELEMENTS ---
    const salesForm = document.getElementById('salesForm');
    const bookingTypeSelect = document.getElementById('bookingType');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const linkInputSection = document.getElementById('linkInput');
    const bankInputSection = document.getElementById('bankInput');
    const allCurrencySymbols = document.querySelectorAll('.currency-symbol');
    const currencySelect = document.getElementById('currency');
    const installmentSelect = document.getElementById('installment');
    const installmentContentNewBooking = document.getElementById('installmentContentNewBooking');
    const amountPaidNewBookingInput = document.getElementById('amountPaidNewBookingInput');
    const remainingAmountNewBookingInput = document.getElementById('remainingAmountNewBookingInput');
    const sellingRateInput = document.getElementById('sellingRateInput');
    
    const installmentPaymentContent = document.getElementById('installmentPaymentContent');
    const amountPaidInput = document.getElementById('amountPaidInput');
    const newRemainingAmountInput = document.getElementById('newRemainingAmountInput');
    const remainingAmountPrevInput = document.getElementById('remainingAmountPrevInput');
    const submitButton = document.getElementById('submitButton');
    const submitButtonText = document.getElementById('submitButtonText');
    const spinnerIcon = document.getElementById('spinnerIcon');
    const formMessages = document.getElementById('form-messages');
    const serviceSelect = document.getElementById('service');
    const rixosRoomsDiv = document.getElementById('rixosRoomsDiv');
    const voucherInput = document.getElementById('voucher');
    const invoiceInput = document.getElementById('invoice');
    const bankFileInput = document.getElementById('bankFile');

    // --- AGENT NAMES (can be fetched from an API in the future) ---
    const agentNames = ["Rawan Mohamed el sayed Mahmoud", "Neama Ibrahim Mohamed Ibrahim", "Enas Mohamed Fawzy Abdel-Kader", "Fatma Mohamed Fathallah Osman", "Mona Milad Khalaf Israil", "Dina Farid Mohamed Abdelkader", "Alaa Abdelfattah Gamal eldeen", "Walaa Adel Mahmoud El-Sayed", "Omnia Mahrous Ali Ahmed", "Omnia Mohammed Muslim Elsayed Hassan", "Sara Shabaan Abdallah", "Huda Hesham Mahmoud", "Salma Yehia Al-Badry Abdel-Megied", "Haidy Mohamed Yousef Khamees", "Samar Kamal Nazeer Ali", "Rana Ahmed Ramzy", "Gehad Hamdy Bahr", "Dina Mohamed Abdelazim Abdelhamid", "Aya Khalil Abdelgawad Farag", "Veronia Mousa Shafiek Bashay", "Nour Elhoda Hanafy Mohamed", "Fatma Hussien Noureldeen", "Rahma Atef Fathy", "Sondos Mohamed Fahmy Mousa", "Shams mohamed ahmed", "Toka mahmoud farid", "Manar abdelhamid aref", "Heba Mostafa", "Farah Samir", "Basma Hatem", "Dina Mohamed Khalil", "Rana Mahmoud Abdullah Mohamed", "Radwa Khaled", "Haidy Mohamed", "Basher Rabea", "Maged Hamdy Hassan", "Moustafa Salem Younes", "Hassan Hamdy Hassn Mohamed Karar", "Khaled Reda Khaled Mohamed", "Ahmed Mohamed Mohamed Mohamed Ibrahim", "Abdallah Elsayed Abass Elshekh", "Hany Ahmed Mahmoud sayed", "Marco Medhat Gamil Metree", "Karam Sayed Hanafy Awad Ibrahim", "Islam Mohamed Hassan", "Abdelrahman Essmat Ahmed Hussein", "Sameh Mostafa Mohamed", "Osama Salem Younes", "Saeed Mohamed Mekhemar", "Mahmoud Bader Khalaf alah moustafa", "Haitham Salem Younes Mohamed", "Karim Mohamed Abdallah AbdelGelil", "Ahmed Abdelaleem Barbary", "Loay Mahmoud Mostafa Khater", "Mohamed Sayed Mohamed Mohamed Osman", "Ahmed Yousef Abdelmola", "Amr Yousef Abozina", "Mahmoud Mohamed Abdelbaki", "Omar Fathy", "Yehia allam", "Abdulrahman Saeed mohamed", "Ahmed Saleh Zeinhum Mohamed", "Youssef Morsy", "Eslam Ahmed", "Eslam Yousry", "Ahmed Fouad", "Mohamed Hazim", "Ahmed Magdy", "Ali Ezzat", "Ahmed Hafez", "Ezz El Dien Abdelraziq Yassin Abdelrazeq", "Ali Mohamed Nour Aldeen Yahya", "Ahmed Adel Abdulrahman Mohamed Khaled", "Elamir Elmamdouh Nasr Braik", "Hadi Jalal Hussain Abu Zaid", "Ahmed Yaser Abdulaziz Ali", "Omar Ahmed Abdelhafez", "Mohamed Mahmoud Bahnasi Elsayed Ahmed", "Hozifa Ahmed Mohamed Ahmed", "Fouad Mohamed Ahmed Hamed", "Ahmed Saeed Mohamed Hassan AlKelany", "Mohamed Nagi Abdelrahman Sayed", "Ahmed Said Mekky Mohamed"];
    const agentNameSelect = $('#agentName');
    agentNames.forEach(name => agentNameSelect.append(new Option(name, name)));
    agentNameSelect.select2({ placeholder: "Select Agent", allowClear: true });

    // --- LOCAL STORAGE FUNCTIONS ---
    const saveFormToLocalStorage = () => {
        const formData = new FormData(salesForm);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    };

    const loadFormFromLocalStorage = () => {
        const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if (data) {
            if (window.confirm("We found unsaved data, do you want to restore it?")) {
                Object.keys(data).forEach(key => {
                    const field = salesForm.elements[key];
                    if (field) {
                        if (field.type === 'file') return;
                        if (field.type === 'radio' || field.type === 'checkbox') {
                            field.checked = field.value === data[key];
                        } else {
                            field.value = data[key];
                        }
                    }
                });
                // Trigger change events to update UI correctly
                ['bookingType', 'service', 'paymentMethod', 'installment', 'currency'].forEach(id => {
                    document.getElementById(id).dispatchEvent(new Event('change'));
                });
                $('#agentName').val(data.agentName).trigger('change');
            }
        }
    };

    // --- FILE HANDLING FUNCTIONS ---
    // Convert file to base64 string
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result); // Include data URL format
            reader.onerror = error => reject(error);
        });
    };

    // Process multiple files to base64
    const processFilesToBase64 = async (fileList) => {
        const files = Array.from(fileList);
        const filePromises = files.map(file => getBase64(file));
        return await Promise.all(filePromises);
    };

    // --- UTILITY & UI FUNCTIONS ---
    const updateCurrencySymbols = () => {
        const selectedCurrency = currencySelect.value;
        allCurrencySymbols.forEach(span => span.textContent = selectedCurrency);
    };

    const showFieldError = (field, message) => {
        field.classList.add('error-border');
        const errorContainer = field.parentElement.querySelector('.error-text') || document.createElement('div');
        errorContainer.className = 'error-text';
        errorContainer.textContent = message;
        field.parentElement.appendChild(errorContainer);
    };
    
    const clearFieldErrors = () => {
        salesForm.querySelectorAll('.error-border').forEach(field => field.classList.remove('error-border'));
        salesForm.querySelectorAll('.error-text').forEach(el => el.remove());
    };

    const displayMessage = (message, type = 'success') => {
        formMessages.innerHTML = '';
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-text';
        messageDiv.textContent = message;
        formMessages.appendChild(messageDiv);
        
        // Auto scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto dismiss after 10 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.remove();
            }, 10000);
        }
    };

    // --- SERVICE TYPE LOGIC ---
    const handleServiceChange = () => {
        const selectedService = serviceSelect.value;
        rixosRoomsDiv.classList.add('hidden-section');
        rixosRoomsDiv.querySelector('input').removeAttribute('required');
        
        if (selectedService === 'rixos') {
            rixosRoomsDiv.classList.remove('hidden-section');
            rixosRoomsDiv.querySelector('input').setAttribute('required', 'true');
        }
    };

    // --- PAYMENT METHOD LOGIC ---
    const handlePaymentMethodChange = () => {
        linkInputSection.classList.add('hidden-section');
        linkInputSection.querySelector('input').removeAttribute('required');
        bankInputSection.classList.add('hidden-section');
        bankInputSection.querySelector('input').removeAttribute('required');

        const selectedMethod = paymentMethodSelect.value;
        if (selectedMethod === 'link') {
            linkInputSection.classList.remove('hidden-section');
            linkInputSection.querySelector('input').setAttribute('required', 'true');
        } else if (selectedMethod === 'bank') {
            bankInputSection.classList.remove('hidden-section');
            bankInputSection.querySelector('input').setAttribute('required', 'true');
        }
    };

    // --- INSTALLMENT LOGIC ---
    const handleInstallmentChange = () => {
        const bookingType = bookingTypeSelect.value;
        const isInstallment = installmentSelect.value === 'yes';

        // Reset all installment fields
        installmentContentNewBooking.classList.add('hidden-section');
        amountPaidNewBookingInput.removeAttribute('required');
        installmentPaymentContent.classList.add('hidden-section');
        amountPaidInput.removeAttribute('required');

        if (isInstallment) {
            if (bookingType === 'NEW') {
                installmentContentNewBooking.classList.remove('hidden-section');
                amountPaidNewBookingInput.setAttribute('required', 'true');
            } else if (bookingType === 'INSTALLMENT') {
                installmentPaymentContent.classList.remove('hidden-section');
                amountPaidInput.setAttribute('required', 'true');
            }
        }
    };

    // --- AUTOMATIC CALCULATION LOGIC ---
    const calculateRemainingAmount = () => {
        const sellingRate = parseFloat(sellingRateInput.value) || 0;
        const amountPaidNewBooking = parseFloat(amountPaidNewBookingInput.value) || 0;

        if (sellingRate > 0 && amountPaidNewBooking > 0) {
            const remaining = sellingRate - amountPaidNewBooking;
            remainingAmountNewBookingInput.value = remaining.toFixed(2);
        } else {
            remainingAmountNewBookingInput.value = '';
        }
    };

    const calculateNewRemainingAmount = () => {
        const prevRemaining = parseFloat(remainingAmountPrevInput.value) || 0;
        const amountPaid = parseFloat(amountPaidInput.value) || 0;
        
        if (prevRemaining > 0 && amountPaid > 0) {
            const newRemaining = prevRemaining - amountPaid;
            newRemainingAmountInput.value = newRemaining.toFixed(2);
        } else {
            newRemainingAmountInput.value = '';
        }
    };

    // --- FORM VALIDATION ---
    const validateForm = () => {
        clearFieldErrors();
        let isValid = true;

        salesForm.querySelectorAll('[required]:not([disabled])').forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, `This field is required.`);
                isValid = false;
            }
        });
        
        // Mobile number validation
        const cstMob = document.getElementById('cstMob');
        if (!cstMob.disabled && cstMob.value && !/^\d{7,15}$/.test(cstMob.value)) {
            showFieldError(cstMob, 'Please enter a valid mobile number.');
            isValid = false;
        }

        // Installment amount validation
        if (installmentSelect.value === 'yes' && bookingTypeSelect.value === 'NEW') {
            const sellingRate = parseFloat(sellingRateInput.value) || 0;
            const amountPaid = parseFloat(amountPaidNewBookingInput.value) || 0;
            
            if (amountPaid > sellingRate) {
                showFieldError(amountPaidNewBookingInput, 'Amount Paid cannot be greater than Selling Rate.');
                isValid = false;
            }
        }

        return isValid;
    };

    // --- EVENT LISTENERS ---
    salesForm.addEventListener('input', saveFormToLocalStorage);
    currencySelect.addEventListener('change', updateCurrencySymbols);
    paymentMethodSelect.addEventListener('change', handlePaymentMethodChange);
    installmentSelect.addEventListener('change', handleInstallmentChange);
    bookingTypeSelect.addEventListener('change', handleInstallmentChange); // Also listen for booking type changes
    sellingRateInput.addEventListener('input', calculateRemainingAmount);
    amountPaidNewBookingInput.addEventListener('input', calculateRemainingAmount);
    serviceSelect.addEventListener('change', handleServiceChange);
    amountPaidInput.addEventListener('input', calculateNewRemainingAmount);

    // --- FORM SUBMISSION ---
    salesForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            displayMessage('Please correct the highlighted errors.', 'error');
            return;
        }

        if (!window.confirm("Are you sure you want to submit the report?")) {
            return;
        }

        // Disable button and show spinner
        submitButton.disabled = true;
        submitButtonText.textContent = "Processing...";
        spinnerIcon.classList.remove('hidden-section');
        
        try {
            // Create FormData object
            const formData = new FormData(salesForm);
            const jsonData = {};
            
            // Process regular fields
            formData.forEach((value, key) => {
                // Skip file inputs, we'll handle them separately
                if (!['voucher', 'invoice', 'bankFile'].includes(key)) {
                    jsonData[key] = value;
                }
            });
            
            // Process file inputs
            try {
                // Handle invoice files
                if (invoiceInput.files.length > 0) {
                    const invoiceFiles = await processFilesToBase64(invoiceInput.files);
                    jsonData['invoiceFiles'] = invoiceFiles;
                }
                
                // Handle voucher files
                if (voucherInput.files.length > 0) {
                    const voucherFiles = await processFilesToBase64(voucherInput.files);
                    jsonData['voucherFiles'] = voucherFiles;
                }
                
                // Handle bank transfer files if selected
                if (paymentMethodSelect.value === 'bank' && bankFileInput.files.length > 0) {
                    const bankFiles = await processFilesToBase64(bankFileInput.files);
                    jsonData['bankFiles'] = bankFiles;
                }
            } catch (fileError) {
                console.error("Error processing files:", fileError);
                displayMessage("Error processing files. Please try again with smaller or fewer files.", "error");
                submitButton.disabled = false;
                submitButtonText.textContent = "Submit";
                spinnerIcon.classList.add('hidden-section');
                return;
            }
            
            // Add timestamp
            jsonData['submissionTimestamp'] = new Date().toISOString();
            
            // Send data to Google Script
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData),
                mode: 'cors' // This is important for cross-origin requests
            });
            
            // Check if the response is OK
            if (response.ok) {
                const result = await response.json();
                if (result.result === "success") {
                    // Clear form on successful submission
                    salesForm.reset();
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                    displayMessage("Report submitted successfully! Thank you.");
                    
                    // Reset Select2
                    $('#agentName').val(null).trigger('change');
                } else {
                    throw new Error(result.error || "Unknown error occurred");
                }
            } else {
                throw new Error(`Server responded with status code ${response.status}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            displayMessage(`Error submitting form: ${error.message}. Please try again later.`, "error");
        } finally {
            // Re-enable button and hide spinner
            submitButton.disabled = false;
            submitButtonText.textContent = "Submit";
            spinnerIcon.classList.add('hidden-section');
        }
    });

    // --- INITIALIZATION ---
    document.querySelector('input[name="date"]').valueAsDate = new Date();
    handlePaymentMethodChange(); // Initial call to set correct state
    handleInstallmentChange(); // Initial call for installment state
    handleServiceChange(); // Initial call for service type state
    updateCurrencySymbols();
    loadFormFromLocalStorage();
});
