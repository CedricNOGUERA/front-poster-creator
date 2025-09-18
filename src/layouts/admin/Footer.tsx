export const AdminFooter = () => {
  return (
    <footer className="bg-danger">
      <div className="d-flex flex-row justify-content-between align-items-center py-2 px-5 text-white">
        <div className="d-flex flex-column align-items-start mb-0 me-md-3">
          <p>LOGIS</p>
        </div>
        {/* <div className="d-flex flex-column align-items-start mb-3 mb-md-0 me-md-3 d-none">
          <p className="text-small">
            Ce générateur est destiné à un usage professionnel
            , et le lien y menant ne doit être divulgé à aucune
            personne extérieure aux sociétés Wane.
          </p>
        </div> */}
        <div className="d-flex flex-column align-items-start">
          {/* <a
            className="text-white text-decoration-none small fw-bold"
            href="/guide-plv"
            target="_blank"
          >
            Accédez au guide PLV ?
          </a> */}
        </div>
      </div>
    </footer>
  );
};
