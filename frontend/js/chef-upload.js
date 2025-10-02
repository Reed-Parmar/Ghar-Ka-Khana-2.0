const mealUploadForm = document.getElementById("mealUploadForm")
const priceInput = document.getElementById("price")
const chefEarningSpan = document.getElementById("chefEarning")
const addComponentBtn = document.getElementById("addComponent")
const componentsContainer = document.getElementById("componentsContainer")
const imageUploadArea = document.getElementById("imageUploadArea")
const mealImagesInput = document.getElementById("mealImages")
const imagePreviewContainer = document.getElementById("imagePreviewContainer")

const uploadedImages = []

// Calculate chef earning based on price
if (priceInput && chefEarningSpan) {
  priceInput.addEventListener("input", (e) => {
    const price = Number.parseFloat(e.target.value) || 0
    const commission = price * 0.1
    const earning = price - commission
    chefEarningSpan.textContent = earning.toFixed(0)
  })
}

// Add component functionality
if (addComponentBtn && componentsContainer) {
  addComponentBtn.addEventListener("click", () => {
    const componentItem = document.createElement("div")
    componentItem.className = "component-item"
    componentItem.innerHTML = `
      <input 
        type="text" 
        name="component[]" 
        placeholder="e.g., 2 Butter Naans"
        required
      >
      <button type="button" class="btn-icon remove-component">✕</button>
    `
    componentsContainer.appendChild(componentItem)

    // Add remove functionality
    const removeBtn = componentItem.querySelector(".remove-component")
    removeBtn.addEventListener("click", () => {
      componentItem.remove()
      updateRemoveButtons()
    })

    updateRemoveButtons()
  })
}

function updateRemoveButtons() {
  const removeButtons = componentsContainer.querySelectorAll(".remove-component")
  removeButtons.forEach((btn, index) => {
    btn.disabled = removeButtons.length === 1
  })
}

// Image upload functionality
if (imageUploadArea && mealImagesInput) {
  imageUploadArea.addEventListener("click", () => {
    mealImagesInput.click()
  })

  mealImagesInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files)

    files.forEach((file) => {
      if (uploadedImages.length >= 4) {
        showToast("Maximum 4 images allowed", "error")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size should be less than 5MB", "error")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        uploadedImages.push({
          file: file,
          url: event.target.result,
        })
        renderImagePreviews()
      }
      reader.readAsDataURL(file)
    })
  })

  // Drag and drop
  imageUploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    imageUploadArea.style.borderColor = "var(--orange)"
    imageUploadArea.style.backgroundColor = "var(--cream)"
  })

  imageUploadArea.addEventListener("dragleave", (e) => {
    e.preventDefault()
    imageUploadArea.style.borderColor = ""
    imageUploadArea.style.backgroundColor = ""
  })

  imageUploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    imageUploadArea.style.borderColor = ""
    imageUploadArea.style.backgroundColor = ""

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length > 0) {
      const dataTransfer = new DataTransfer()
      imageFiles.forEach((file) => dataTransfer.items.add(file))
      mealImagesInput.files = dataTransfer.files

      const event = new Event("change", { bubbles: true })
      mealImagesInput.dispatchEvent(event)
    }
  })
}

function renderImagePreviews() {
  imagePreviewContainer.innerHTML = ""

  uploadedImages.forEach((image, index) => {
    const previewDiv = document.createElement("div")
    previewDiv.className = "image-preview"
    previewDiv.innerHTML = `
      <img src="${image.url}" alt="Preview ${index + 1}">
      <button type="button" class="remove-image" data-index="${index}">✕</button>
    `
    imagePreviewContainer.appendChild(previewDiv)

    const removeBtn = previewDiv.querySelector(".remove-image")
    removeBtn.addEventListener("click", () => {
      uploadedImages.splice(index, 1)
      renderImagePreviews()
    })
  })
}

// Set minimum date to tomorrow
const availableDateInput = document.getElementById("availableDate")
if (availableDateInput) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]
  availableDateInput.min = minDate
  availableDateInput.value = minDate
}

// Form submission
if (mealUploadForm) {
  mealUploadForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (uploadedImages.length === 0) {
      showToast("Please upload at least one image", "error")
      return
    }

    const formData = new FormData(mealUploadForm)

    // Add images to form data
    uploadedImages.forEach((image, index) => {
      formData.append(`image_${index}`, image.file)
    })

    console.log("[v0] Submitting meal upload form")

    // TODO: Replace with actual API call
    // const response = await fetch('/api/chef/meals', {
    //   method: 'POST',
    //   body: formData
    // })

    // Simulate successful upload
    setTimeout(() => {
      showToast("Meal published successfully!", "success")
      setTimeout(() => {
        window.location.href = "#my-meals"
      }, 2000)
    }, 1500)
  })
}

// Toast notification
function showToast(message, type = "success") {
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${type === "success" ? "#2D6A4F" : "#C1121F"};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease"
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

console.log("[v0] Chef upload page loaded")
