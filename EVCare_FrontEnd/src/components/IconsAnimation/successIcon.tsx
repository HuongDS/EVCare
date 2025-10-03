import "./icon.css";

export default function SuccessIcon() {
  return (
    <div className="f-modal-alert">
      <div className="f-modal-icon f-modal-success animate">
        <span className="f-modal-line f-modal-tip animateSuccessTip"></span>
        <span className="f-modal-line f-modal-long animateSuccessLong"></span>
        <div className="f-modal-placeholder"></div>
        <div className="f-modal-fix"></div>
      </div>
    </div>
  );
}
