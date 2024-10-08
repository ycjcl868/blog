const Button = ({
  className,
  getRef,
  onClick,
  onMouseDown,
  text,
  isLoading,
}) => (
  <button
    ref={(el) => getRef && getRef(el)}
    className={`gt-btn ${className}`}
    onClick={onClick}
    onMouseDown={onMouseDown}
  >
    <span className="gt-btn-text">{text}</span>
    {isLoading && <span className="gt-btn-loading gt-spinner" />}
  </button>
);

export default Button;
