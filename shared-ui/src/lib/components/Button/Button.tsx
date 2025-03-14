import React, { ButtonHTMLAttributes } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variante del botón
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';

  /**
   * Tamaño del botón
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Contenido del botón
   */
  children: React.ReactNode;
}

/**
 * Componente de botón que utiliza los tokens de diseño
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  ...props
}) => {
  const buttonClasses = `button button-${variant} button-${size} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
