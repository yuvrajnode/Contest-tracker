import { toast as sonnerToast } from 'sonner'

type ToastOptions = {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

export const useToast = () => {
  const toast = ({ title, description, variant }: ToastOptions) => {
    if (variant === 'destructive') {
      sonnerToast.error(title, {
        description,
        style: {
          backgroundColor: '#fef2f2', // Light red background
          color: '#dc2626', // Dark red text
          border: '1px solid #fca5a5', // Red border
        },
      })
    } else {
      sonnerToast(title, {
        description,
      })
    }
  }

  return {
    toast,
  }
}