document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: "ease",
    once: true,
    offset: 100,
  })

  // Navigation
  const burger = document.querySelector(".burger")
  const nav = document.querySelector(".nav-links")
  const navLinks = document.querySelectorAll(".nav-links li")

  burger.addEventListener("click", () => {
    // Toggle Nav
    nav.classList.toggle("nav-active")

    // Animate Links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = ""
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
      }
    })

    // Burger Animation
    burger.classList.toggle("toggle")
  })

  // Close mobile menu
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("nav-active")) {
        nav.classList.remove("nav-active")
        burger.classList.remove("toggle")

        navLinks.forEach((link) => {
          link.style.animation = ""
        })
      }
    })
  })

  // Active nav link on scroll
  const sections = document.querySelectorAll("section")
  const navItems = document.querySelectorAll(".nav-links a")

  window.addEventListener("scroll", () => {
    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navItems.forEach((item) => {
      item.classList.remove("active")
      if (item.getAttribute("href").substring(1) === current) {
        item.classList.add("active")
      }
    })
  })

  // Scroll indicator
  const scrollIndicator = document.createElement("div")
  scrollIndicator.className = "scroll-indicator"
  document.body.appendChild(scrollIndicator)

  window.addEventListener("scroll", () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrolled = (winScroll / height) * 100

    scrollIndicator.style.width = scrolled + "%"
  })

  // Parallax effect
  const parallaxElements = document.querySelectorAll(".about-img, .skill-category, .education-card, .timeline-content")

  window.addEventListener("scroll", () => {
    parallaxElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top
      const elementHeight = element.offsetHeight
      const windowHeight = window.innerHeight

      if (elementTop < windowHeight && elementTop > -elementHeight) {
        const scrolled = (windowHeight - elementTop) / (windowHeight + elementHeight)
        const translateY = scrolled * 30

        element.style.transform = `translateY(${translateY}px)`
      }
    })
  })

  // Typewriter effect
  const typewriterText = document.querySelector(".typewriter-text")
  const roles = ["Video Editor", "Motion Designer"]
  let roleIndex = 0
  let charIndex = 0
  let isDeleting = false
  let typingSpeed = 100

  function type() {
    const currentRole = roles[roleIndex]

    if (isDeleting) {
      // Deleting text
      typewriterText.textContent = currentRole.substring(0, charIndex - 1)
      charIndex--
      typingSpeed = 50
    } else {
      // Typing text
      typewriterText.textContent = currentRole.substring(0, charIndex + 1)
      charIndex++
      typingSpeed = 100
    }

    // If finished typing the current role
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = false
      typingSpeed = 1500
      setTimeout(() => {
        isDeleting = true
      }, typingSpeed)
    }
    // If finished deleting the current role
    else if (isDeleting && charIndex === 0) {
      isDeleting = false
      roleIndex = (roleIndex + 1) % roles.length
      typingSpeed = 500
    }

    setTimeout(type, typingSpeed)
  }

  // Start the typewriter effect
  setTimeout(type, 1000)

  // Video preview optimization - Play all videos but with optimizations
  const previewVideos = document.querySelectorAll(".preview-video")

  // Pre-optimize all videos for better performance
  previewVideos.forEach((video) => {
    // Set video attributes for better performance
    video.setAttribute("playsinline", "")
    video.setAttribute("muted", "")
    video.muted = true // Explicitly set muted property
    video.setAttribute("preload", "metadata") // Only preload metadata initially
    video.setAttribute("disablePictureInPicture", "") // Disable PiP to save resources
    video.setAttribute("disableRemotePlayback", "") // Disable remote playback

    // Lower video quality for preview if possible
    if (video.videoHeight > 480) {
      video.style.height = "auto"
      video.style.maxHeight = "480px" // Limit display size to reduce rendering load
    }

    // Reduce framerate if browser supports it
    if ("mediaSettings" in HTMLVideoElement.prototype) {
      try {
        video.mediaSettings = { frameRate: 24 } // Lower framerate if supported
      } catch (e) {
        // Browser doesn't support this API
      }
    }
  })

  // Create an optimized Intersection Observer
  const videoObserverOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.3, // Video will play when 30% visible
  }

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target

      if (entry.isIntersecting) {
        // Only start playing if the video is not already playing
        if (video.paused) {
          // Use requestAnimationFrame to stagger video starts slightly
          requestAnimationFrame(() => {
            video.play().catch((e) => {
              console.log("Video play prevented:", e)
            })
          })
        }
      } else {
        // Pause when completely out of view
        if (!video.paused) {
          video.pause()
        }
      }
    })
  }, videoObserverOptions)

  // Observe all preview videos with a slight delay between each
  previewVideos.forEach((video, index) => {
    // Stagger the observation to prevent all videos from loading at once
    setTimeout(() => {
      videoObserver.observe(video)
    }, index * 100) // 100ms delay between each video
  })

  // Video modal
  const videoContainers = document.querySelectorAll(".video-container")
  const videoModal = document.getElementById("video-modal")
  const projectVideo = document.getElementById("project-video")
  const videoTitle = document.getElementById("video-title")
  const closeModal = document.querySelector(".close-modal")

  // Completely rebuild the video modal structure
  const modalContent = document.querySelector(".modal-content")

  // Create a wrapper for the video if it doesn't exist
  if (!modalContent.querySelector(".video-container-wrapper")) {
    const videoWrapper = document.createElement("div")
    videoWrapper.className = "video-container-wrapper"

    // Move the video inside this wrapper
    if (projectVideo.parentNode === modalContent) {
      projectVideo.remove()
      videoWrapper.appendChild(projectVideo)
      modalContent.insertBefore(videoWrapper, videoTitle)
    }
  }

  videoContainers.forEach((container) => {
    container.addEventListener("click", () => {
      const videoSrc = container.getAttribute("data-video")
      const title = container.getAttribute("data-title")

      projectVideo.src = videoSrc
      videoTitle.textContent = title

      // Reset any inline styles that might be causing issues
      projectVideo.removeAttribute("style")

      // Set basic styles to ensure proper display
      projectVideo.style.width = "100%"
      projectVideo.style.height = "auto"

      // Show the modal
      videoModal.style.display = "flex"

      // Load and play the video
      projectVideo.load()
      projectVideo.play()
    })
  })

  closeModal.addEventListener("click", () => {
    videoModal.style.display = "none"
    projectVideo.pause()
  })

  // Close modal when clicking outside
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) {
      videoModal.style.display = "none"
      projectVideo.pause()
    }
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Animate skill icons on scroll - with throttling
  const skillIcons = document.querySelectorAll(".skill-icon")
  let animationFrameId = null

  function animateSkillIcons() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }

    animationFrameId = requestAnimationFrame(() => {
      skillIcons.forEach((icon) => {
        const iconTop = icon.getBoundingClientRect().top
        const windowHeight = window.innerHeight

        if (iconTop < windowHeight - 100) {
          icon.style.animation = "pulse 2s infinite"
        } else {
          icon.style.animation = "none"
        }
      })
    })
  }

  window.addEventListener("scroll", animateSkillIcons)

  // Animate progress bar on scroll
  const progressBars = document.querySelectorAll(".progress-fill")

  function animateProgressBars() {
    progressBars.forEach((bar) => {
      const barTop = bar.getBoundingClientRect().top
      const windowHeight = window.innerHeight

      if (barTop < windowHeight - 100) {
        const width = bar.getAttribute("style").match(/width: (\d+)%/)[1]
        bar.style.width = "0%"
        setTimeout(() => {
          bar.style.width = width + "%"
        }, 100)
      }
    })
  }

  window.addEventListener("load", animateProgressBars)

  // Function to check if device is mobile
  function isMobile() {
    return window.innerWidth <= 768
  }

  // Fix for project showcases
  const projectShowcases = document.querySelectorAll(".project-showcase")

  // Scroll to top button
  const scrollTopBtn = document.createElement("button")
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'
  scrollTopBtn.className = "scroll-top-btn"
  scrollTopBtn.style.position = "fixed"
  scrollTopBtn.style.bottom = "20px"
  scrollTopBtn.style.right = "20px"
  scrollTopBtn.style.width = "50px"
  scrollTopBtn.style.height = "50px"
  scrollTopBtn.style.borderRadius = "50%"
  scrollTopBtn.style.backgroundColor = "var(--primary-color)"
  scrollTopBtn.style.color = "white"
  scrollTopBtn.style.border = "none"
  scrollTopBtn.style.fontSize = "1.2rem"
  scrollTopBtn.style.cursor = "pointer"
  scrollTopBtn.style.display = "none"
  scrollTopBtn.style.zIndex = "999"
  scrollTopBtn.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)"
  scrollTopBtn.style.transition = "all 0.3s ease"

  document.body.appendChild(scrollTopBtn)

  // Throttle scroll events for better performance
  let scrollTimeout
  window.addEventListener("scroll", () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        if (window.pageYOffset > 300) {
          scrollTopBtn.style.display = "block"
          scrollTopBtn.style.opacity = "1"
        } else {
          scrollTopBtn.style.opacity = "0"
          setTimeout(() => {
            if (window.pageYOffset <= 300) {
              scrollTopBtn.style.display = "none"
            }
          }, 300)
        }
        scrollTimeout = null
      }, 100)
    }
  })

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Hover effect for scroll top button
  scrollTopBtn.addEventListener("mouseenter", () => {
    scrollTopBtn.style.transform = "translateY(-5px)"
    scrollTopBtn.style.backgroundColor = "var(--primary-dark)"
  })

  scrollTopBtn.addEventListener("mouseleave", () => {
    scrollTopBtn.style.transform = "translateY(0)"
    scrollTopBtn.style.backgroundColor = "var(--primary-color)"
  })
})
