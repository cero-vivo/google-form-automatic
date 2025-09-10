import './button.css';

export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
  /** Button variant - FastForm brand colors */
  variant?: 'velocity' | 'forms' | 'excel';
  /** Disabled state */
  disabled?: boolean;
  /** Modern glass effect styling */
  glass?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Icon component */
  icon?: React.ReactNode;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  variant = 'velocity',
  disabled = false,
  glass = false,
  fullWidth = false,
  icon,
  ...props
}: ButtonProps) => {
  const baseClasses = ['storybook-button', `storybook-button--${size}`];
  
  let colorClasses = '';
  if (backgroundColor) {
    // Custom background color provided
    colorClasses = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  } else {
    // Use FastForm brand colors
    switch (variant) {
      case 'velocity':
        colorClasses = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
        break;
      case 'forms':
        colorClasses = primary ? 'storybook-button--forms' : 'storybook-button--forms-outline';
        break;
      case 'excel':
        colorClasses = primary ? 'storybook-button--excel' : 'storybook-button--excel-outline';
        break;
      default:
        colorClasses = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
    }
  }

  const additionalClasses = [
    ...baseClasses,
    colorClasses,
    glass ? 'storybook-button--glass' : '',
    fullWidth ? 'storybook-button--full-width' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={additionalClasses}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
      {backgroundColor && (
        <style jsx>{`
          button {
            background-color: ${backgroundColor};
          }
        `}</style>
      )}
    </button>
  );
};
