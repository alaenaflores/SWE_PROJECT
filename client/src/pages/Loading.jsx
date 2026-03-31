export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(240, 253, 244, 0.9)", // soft green tint
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}
    >
        {/* Spinner */}
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "6px solid rgba(34, 197, 94, 0.2)",
            borderTopColor: "rgb(34, 197, 94)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }}
        >
      </div>

      <p
        style={{
          marginTop: "20px",
          fontSize: "1.25rem",
          fontWeight: "600",
          color: "rgb(22, 101, 52)",
          textAlign: "center"
        }}
      >
        Calculating your nutrition goals…
      </p>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}