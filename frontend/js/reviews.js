const ratings = {
  overall: 0,
  taste: 0,
  portion: 0,
  packaging: 0,
  value: 0,
}

// Overall rating
const overallRatingInputs = document.querySelectorAll('input[name="overall"]')
const overallText = document.getElementById("overallText")

const ratingTexts = {
  5: "Excellent! 🌟",
  4: "Very Good! 👍",
  3: "Good 👌",
  2: "Could be better 😐",
  1: "Needs improvement 😞",
}

overallRatingInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    ratings.overall = Number.parseInt(e.target.value)
    overallText.textContent = ratingTexts[ratings.overall]
    console.log("[v0] Overall rating:", ratings.overall)
  })
})

// Small star ratings
document.querySelectorAll(".star-rating-small").forEach((ratingGroup) => {
  const category = ratingGroup.getAttribute("data-category")
  const stars = ratingGroup.querySelectorAll(".star")

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      const value = Number.parseInt(star.getAttribute("data-value"))
      ratings[category] = value

      // Update visual state
      stars.forEach((s, i) => {
        if (i >= stars.length - value) {
          s.classList.add("active")
        } else {
          s.classList.remove("active")
        }
      })

      console.log("[v0] Rating updated:", category, value)
    })

    star.addEventListener("mouseenter", () => {
      const value = Number.parseInt(star.getAttribute("data-value"))
      stars.forEach((s, i) => {
        if (i >= stars.length - value) {
          s.style.color = "#ff6b35"
        } else {
          s.style.color = "#e5e5e5"
        }
      })
    })
  })

  ratingGroup.addEventListener("mouseleave", () => {
    stars.forEach((s, i) => {
      if (s.classList.contains("active")) {
        s.style.color = "#ff6b35"
      } else {
        s.style.color = "#e5e5e5"
      }
    })
  })
})

// Character count
const reviewText = document.getElementById("reviewText")
const charCount = document.getElementById("charCount")

reviewText.addEventListener("input", () => {
  charCount.textContent = reviewText.value.length
})

// Photo upload
const photoUpload = document.getElementById("photoUpload")
const photoInput = document.getElementById("photoInput")
const photoPreview = document.getElementById("photoPreview")
const uploadedPhotos = []

photoUpload.addEventListener("click", () => {
  photoInput.click()
})

photoInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files)

  files.forEach((file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedPhotos.push({
        file: file,
        url: e.target.result,
      })
      renderPhotos()
    }
    reader.readAsDataURL(file)
  })
})

function renderPhotos() {
  photoPreview.innerHTML = uploadedPhotos
    .map(
      (photo, index) => `
        <div class="photo-item">
            <img src="${photo.url}" alt="Review photo ${index + 1}">
            <button class="photo-remove" onclick="removePhoto(${index})">×</button>
        </div>
    `,
    )
    .join("")
}

function removePhoto(index) {
  uploadedPhotos.splice(index, 1)
  renderPhotos()
}

// Form submission
const reviewForm = document.getElementById("reviewForm")

reviewForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Validate overall rating
  if (ratings.overall === 0) {
    alert("Please provide an overall rating")
    return
  }

  // Collect form data
  const reviewData = {
    orderId: "GK2024999",
    ratings: ratings,
    reviewText: reviewText.value.trim(),
    photos: uploadedPhotos.map((p) => p.url),
    recommend: document.getElementById("recommend").checked,
    timestamp: new Date().toISOString(),
  }

  console.log("[v0] Submitting review:", reviewData)

  // Show success message
  alert("Thank you for your review! Your feedback helps our community.")

  // Redirect to orders page
  window.location.href = "../order/pickup-coordination.html"
})

// Drag and drop for photos
photoUpload.addEventListener("dragover", (e) => {
  e.preventDefault()
  photoUpload.style.borderColor = "#ff6b35"
  photoUpload.style.background = "#fff8f3"
})

photoUpload.addEventListener("dragleave", () => {
  photoUpload.style.borderColor = "#e5e5e5"
  photoUpload.style.background = "transparent"
})

photoUpload.addEventListener("drop", (e) => {
  e.preventDefault()
  photoUpload.style.borderColor = "#e5e5e5"
  photoUpload.style.background = "transparent"

  const files = Array.from(e.dataTransfer.files)
  photoInput.files = e.dataTransfer.files

  const event = new Event("change")
  photoInput.dispatchEvent(event)
})
