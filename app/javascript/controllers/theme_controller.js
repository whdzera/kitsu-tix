import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["icon"]

  connect() {
    this.updateTheme()
  }

  toggle() {
    const isDark = document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", isDark ? "dark" : "light")
    this.updateIcons()
  }

  updateTheme() {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    this.updateIcons()
  }

  updateIcons() {
    this.iconTargets.forEach(icon => {
      const isLightIcon = icon.hasAttribute("data-light")
      icon.classList.toggle("hidden", document.documentElement.classList.contains("dark") ? isLightIcon : !isLightIcon)
    })
  }
}
