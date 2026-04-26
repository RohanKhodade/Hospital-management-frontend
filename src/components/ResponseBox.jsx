export default function ResponseBox({ data, error }) {
  if (!data && !error) return null;
  const isError = !!error;
  const display = error || data;

  return (
    <div className="response-box">
      <div className="response-label">
        <span className={`status-dot ${isError ? 'error' : ''}`}></span>
        {isError ? 'Error Response' : 'Response'}
      </div>
      <div className="json-block">
        <pre>{JSON.stringify(display, null, 2)}</pre>
      </div>
    </div>
  );
}
