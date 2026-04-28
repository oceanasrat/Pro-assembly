import Preview from "./Preview.jsx";

export default function App() {
  return (
    <>
      {/* SEO + Conversion Content (VISIBLE TO GOOGLE) /}
      <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        
        <h1>Furniture Assembly Services in Fort Worth, TX</h1>

        <p>
          Pro Assembly provides fast and affordable furniture assembly in Fort Worth,
          Dallas, and Arlington. We specialize in IKEA furniture, office setups,
          beds, desks, and more.
        </p>

        <h2>IKEA Furniture Assembly Experts</h2>
        <p>
          Need help assembling IKEA furniture? We handle all brands quickly and
          professionally so you don’t have to deal with complicated instructions.
        </p>

        <h2>Same-Day Assembly Available</h2>
        <p>
          Book today and get your furniture assembled the same day. Reliable,
          professional service you can trust.
        </p>

        {/ CALL BUTTON (CRITICAL FOR ADS) /}
        <a
          href="tel:+1817XXXXXXX"
          onClick={() => {
            if (typeof gtag !== "undefined") {
              gtag("event", "conversion", {
                send_to: "AW-XXXXXXXXX/XXXXXXXX",
              });
            }
          }}
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "15px 25px",
            background: "black",
            color: "white",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Call Now for Assembly Service
        </a>

      </main>

      {/ Your existing UI */}
      <Preview />
    </>
  );
}
