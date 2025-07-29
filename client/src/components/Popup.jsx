import React from "react";

const Popup = ({ visible, onClose, children }) => {
  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <button onClick={onClose} style={styles.closeBtn}>
          x
        </button>

        {children}
      </div>
    </div>
  );
};

const styles = {
  closeBtn: {
    padding: "8px 16px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    display:'flex',
    marginLeft:"463px"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  popup: {
    background: "#fff",
    padding: "5px",
    borderRadius: "10px",
    minWidth: "500px",
    position: "relative",
    // textAlign: "center",
  },
};

export default Popup;
