$(".web-footer").hide()
$(".navbar").hide()
$("#loading").hide()


$(document).on("change", "#nda-yes", () => {
    if ($("#nda-yes").is(":checked")) {
        $("#nda-no").prop("checked", false);
    } else {
        $("#nda-no").prop("checked", true);
    }
});

$(document).on("change", "#nda-no", () => {
    if ($("#nda-no").is(":checked")) {
        $("#nda-yes").prop("checked", false);
    } else {
        $("#nda-yes").prop("checked", true);
    }
});


const nextBtn = document.getElementById("next-tab");
const prevBtn = document.getElementById("prev-tab");
const submitBtn = document.getElementById("submit-form");
const formTabs = document.querySelectorAll(".form-tab");
let options = ["Becoming a software /service provider", "Human Resources", "Media / Marketing"]

let currentTab = 0;



function formatAndValidatePhoneNumber(element) {
    const phoneNumberInput = element;
    const validationMessage = document.getElementById("validationMessage");
    let inputText = phoneNumberInput.value.replace(/\D/g, '');

    if (inputText.length > 10) {
        inputText = inputText.slice(0, 10);
    }

    let formattedPhoneNumber = '(' + inputText.slice(0, 3) + ') ' + inputText.slice(3, 6) + '-' + inputText.slice(6, 10);

    phoneNumberInput.value = formattedPhoneNumber;


    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (phoneRegex.test(formattedPhoneNumber)) {
        validationMessage.textContent = "";
    } else {
        validationMessage.textContent = "Invalid phone number. Please use the format (123) 456-7890.";
        validationMessage.style.color = "red";
    }
}


function validateEmail(element) {
    const emailInput = element;
    const emailValidationMessage = document.getElementById("emailValidationMessage");
    const email = emailInput.value;

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (emailRegex.test(email)) {
        emailValidationMessage.textContent = "";
    } else {
        emailValidationMessage.textContent = "Invalid email address. Please enter a valid email.";
        emailValidationMessage.style.color = "red";
    }
}

const AttachFile = document.getElementById("attachment-input")
const fileData = [];

AttachFile.addEventListener("change", (e) => {
    const files = e.target.files;

    for (const file of files) {
        if (file.size > 3 * 1024 * 1024) { // Check if the file size is greater than 10 MB (in bytes)
            frappe.throw("File size should not exceed 3 MB")
        }
        const reader = new FileReader();
        console.log(file)


        reader.addEventListener("loadstart", (e) => {
            console.log("Uploading")
            $("#submit-form").attr("disabled", true);
            $(".file-result-status").html(`${file.name} Uploading...`)

        })

        reader.addEventListener("load", (e) => {
            console.log("Uploaded")
            $(".file-result-status").html(`${file.name} Uploaded Successfully!`)
            $("#submit-form").attr("disabled", false);
        })


        reader.addEventListener("error", (e) => {
            $(".file-result-status").html(`${file.name} Uploading Failed!`)
            console.log("Upload error")
        })


        reader.readAsDataURL(file);
        reader.onload = () => {
            const fileObj = {
                name: file.name,
                base64: reader.result
            };

            fileData.push(fileObj);
            const fileCard = createFileCard(fileObj);
            document.querySelector(".file-result").appendChild(fileCard);
        }
    }
});

function createFileCard(fileObj) {
    const fileCard = document.createElement("div");
    fileCard.classList.add("file-card");

    const fileName = document.createElement("div");
    fileName.classList.add("file-name");
    fileName.textContent = fileObj.name.slice(0, 50);

    const fileDelete = document.createElement("div");
    fileDelete.classList.add("file-delete");
    fileDelete.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-trash-2">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
    `;
    fileDelete.addEventListener("click", () => removeFile(fileCard, fileObj));

    fileCard.appendChild(fileName);
    fileCard.appendChild(fileDelete);

    return fileCard;
}

function removeFile(fileCard, fileObj) {
    fileCard.remove();
    const index = fileData.indexOf(fileObj);
    if (index !== -1) {
        fileData.splice(index, 1); // Remove the file object from the array
    }
}



const selectedTagsContainer = document.querySelector(".selected-tags");
const selectElement = document.getElementById("inquiry_topic");
let inquiryOptions = []

selectElement.addEventListener("change", function (e) {
    let value = e.target.value
    if (value) {
        if (!inquiryOptions.includes(value)) {
            inquiryOptions.push(value)


            document.querySelectorAll("#inquiry_topic option").forEach((otp) => {
                if (inquiryOptions.includes(otp.value)) {
                    otp.remove()
                }
            })


            let tags = ""
            for (const value of inquiryOptions) {
                tags += `<span class="tag">${value}<button class="remove-tag" data-val='${value}' onclick="removeTag(this)">X</button></span>`
            }

            selectedTagsContainer.innerHTML = tags
        }
    }
});

const optionsEvalOn = document.getElementById("inquiry_topic")
optionsEvalOn.addEventListener("change", (e) => {
    if (inquiryOptions.every(option => options.includes(option))) {
        document.querySelector(".eval-fields").classList.remove("show")
        document.querySelector(".eval-fields-2").classList.remove("show")
        $(".step__text").html("Step 2 of 3")
    } else {
        document.querySelector(".eval-fields").classList.add("show")
        document.querySelector(".eval-fields-2").classList.add("show")
        $(".step__text").html("Step 2 of 5")

    }
})

function removeTag(element) {
    let value = element.getAttribute("data-val")
    element.parentElement.remove()

    inquiryOptions = inquiryOptions.filter(function (item) {
        return item !== value
    })

    let newOptions = `<option value="${value}">${value}</option>`

    $("#inquiry_topic").append(newOptions)

    let options = ["Becoming a software /service provider", "Human Resources"]
    if (inquiryOptions.every(option => options.includes(option))) {
        document.querySelector(".eval-fields").classList.remove("show")
        document.querySelector(".eval-fields-2").classList.remove("show")
        $(".step__text").html("Step 2 of 3")

    } else {
        document.querySelector(".eval-fields").classList.add("show")
        document.querySelector(".eval-fields-2").classList.add("show")
        $(".step__text").html("Step 2 of 5")
    }
}







submitBtn.addEventListener("click", () => {
    if (!$("#hear_about_us").val()) {
        $("#form-warning").html("Fill all the required fields first.");
        throw new Error("Fill all the required fields first.");
    }

    const dataObj = {
        "first_name": document.querySelector("#first_name").value,
        "last_name": document.querySelector("#last_name").value,
        "email": document.querySelector("#email").value,
        "phone": document.querySelector("#phone").value,
        "describes_your_self": document.querySelector("#describes_your_self").value,
        "inquiry_topic": inquiryOptions,
        "message": document.querySelector("#message").value,
        "attachments": fileData,
        "hear_about_us": document.querySelector("#hear_about_us").value,
        "nda": $("#nda-no").is(":checked") ? "No" : "Yes",
        "company_name": document.querySelector("#company_name").value,
        "stage": document.querySelector("#stage").value,
        "project_type": document.querySelector("#project_type").value,
        "budget": document.querySelector("#budget").value,
        "timeline": document.querySelector("#timeline").value,
    };

    $("#loading").show()
    frappe.call({
        method: "jaycon.www.get-quote.create_lead",
        args: { data: JSON.stringify(dataObj) },
        freeze: true,
        callback: function (response) {
            if (response.message.name) {
                console.log(response)
                $("#loading").hide()
                window.location.href = "/thank_you"
            }
        }
    })
});



function showTab(tabIndex) {
    formTabs[currentTab].classList.remove("active");
    formTabs[tabIndex].classList.add("active");
    currentTab = tabIndex;

    if (currentTab == 0) {
        prevBtn.style.display = "none";
        $("#space-tab").show()
    } else {
        prevBtn.style.display = "block";
        $("#space-tab").hide()
    }

    if (currentTab == formTabs.length - 1) {
        nextBtn.style.display = "none";
        submitBtn.style.display = "block";
    } else {
        nextBtn.style.display = "block";
        submitBtn.style.display = "none";
    }

    setSteps()
}

let skip_third = false

nextBtn.addEventListener("click", () => {
    let currentTabElement = formTabs[currentTab];

    currentTabElement.querySelectorAll(".input-val").forEach((inputElement) => {
        if (!inputElement.value) {
            document.querySelector("#form-warning").innerHTML = "Fill all the required fields first.";
            throw new Error("Fill all the required fields first.");
        } else {
            document.querySelector("#form-warning").innerHTML = "";
        }
    });


    if (currentTab == 1 && !inquiryOptions.length > 0) {
        document.querySelector("#form-warning").innerHTML = "Fill all the required fields first.";
        throw new Error("Fill all the required fields first.");
    }

    if (currentTabElement.nextElementSibling) {
        let evalCond = inquiryOptions.every(option => options.includes(option))


        if ((currentTab == 1 && evalCond)) {
            skip_third = true
        } else {
            skip_third = false
        }
        if (skip_third) {
            showTab(4);
        } else {

            showTab(currentTabElement.getAttribute("tabindex"));
        }
    }
});



prevBtn.addEventListener("click", () => {
    if (currentTab > 0) {
        if (skip_third && currentTab == 4) {
            showTab(currentTab - 3);

        }
        else {
            showTab(currentTab - 1);

        }
    }
});



function setSteps() {

    evalCond = inquiryOptions.every(option => options.includes(option)) || inquiryOptions.length === 0

    if (currentTab == 0) {
        if (evalCond) {
            $(".step__text").html("Step 1 of 3")
        }
        else {
            $(".step__text").html("Step 1 of 5")
        }
    }

    if (currentTab == 1) {
        if (evalCond) {
            $(".step__text").html("Step 2 of 3")
        }
        else {
            $(".step__text").html("Step 2 of 5")
        }
    }

    if (currentTab == 2) {
        if (evalCond) {
            $(".step__text").html("Step 3 of 3")
        }
        else {
            $(".step__text").html("Step 4 of 5")
        }
    }

    if (currentTab == 3) {
        if (evalCond) {
            $(".step__text").html("Step 4 of 5")
        }
        else {
            $(".step__text").html("Step 4 of 5")
        }
    }
    if (currentTab == 4) {
        if (evalCond) {
            $(".step__text").html("Step 3 of 3")
        }
        else {
            $(".step__text").html("Step 5 of 5")
        }
    }

} 
