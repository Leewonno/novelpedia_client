interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-237.5 px-5${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  )
}
