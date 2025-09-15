import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    checkIsMobile()
    
    // Create media query list
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      checkIsMobile()
    }
    
    // Add listener for both old and new browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } else {
      mql.addListener(onChange)
    }
    
    // Also listen to resize events as backup
    window.addEventListener("resize", checkIsMobile)
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } else {
        mql.removeListener(onChange)
      }
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return !!isMobile
}
