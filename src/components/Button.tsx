type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** La función que se ejecutará al hacer clic en el botón. */
  onClick: () => void;
  /** El texto o contenido que se mostrará dentro del botón. */
  /** Define la variante de estilo del botón ("primary" o "secondary"). Por defecto es "primary". */
  variant?: ButtonVariant;
  /** Si es true, el botón estará deshabilitado. */
  disabled?: boolean;
  /** Texto alternativo para accesibilidad, útil si 'label' es un ícono. */
  ariaLabel?: string;

  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Componente de botón reutilizable con dos variantes de estilo: "primary" y "secondary".
 *
 * @param {ButtonProps} props - Las propiedades del componente.
 * @returns {JSX.Element} Un elemento botón.
 */
export default function Button({
  onClick,
  children,
  variant = "primary",
  iconRight,
  iconLeft,
  className,
  ...rest
}: ButtonProps) {
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
  };

  return (
    <div
      className={`bg-characters dark:bg-dark-characters w-auto rounded-xl ${className}`}
    >
      <button
        className={`${variantClasses[variant]}`}
        onClick={onClick}
        {...rest}
      >
        {iconLeft && iconLeft}
        {children}
        {iconRight && iconRight}
      </button>
    </div>
  );
}
