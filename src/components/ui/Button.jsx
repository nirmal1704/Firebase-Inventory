const variants = {
  mint: 'bg-mint hover:bg-mint/90',
  lavender: 'bg-lavender hover:bg-lavender/90',
  butter: 'bg-butter hover:bg-butter/90',
  blush: 'bg-blush hover:bg-blush/90',
  sky: 'bg-sky hover:bg-sky/90',
  coral: 'bg-coral text-white hover:bg-coral/90',
  cream: 'bg-cream hover:bg-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-base rounded-xl',
  lg: 'px-6 py-3 text-lg rounded-xl',
}

export function Button({
  children,
  variant = 'mint',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`cartoon-btn rounded-xl text-ink ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
