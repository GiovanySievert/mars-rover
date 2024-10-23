import { useToast as toastification } from 'vue-toastification'

export function useToast() {
  const toast = toastification()

  function showSuccess(message: string) {
    toast.success(message, {
      timeout: 3000
    })
  }

  function showError(message: string) {
    toast.error(message, {
      timeout: 3000
    })
  }

  function showInfo(message: string) {
    toast.info(message, {
      timeout: 3000
    })
  }

  return {
    showSuccess,
    showError,
    showInfo
  }
}
