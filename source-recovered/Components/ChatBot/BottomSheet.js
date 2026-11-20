import "./BottomSheet.css";

function BottomSheet({

  isOpen,

  title,

  items,

  onSelect,

  onClose,

  onBack,

  showBack

}) {

  if (!isOpen) return null;

  return (

    <div

      className="bottom-sheet-overlay"

      onClick={onClose}

    >

      <div

        className="bottom-sheet"

        onClick={(e) => e.stopPropagation()}

      >

        {/* ================= HEADER ================= */}

        <div className="sheet-header">

          <div className="sheet-handle"></div>

          <h3>{title}</h3>

        </div>

        {/* ================= BODY ================= */}

        <div className="sheet-body">

          {

            items.map((item) => (

              <div

                key={item.id}

                className="sheet-item"

                onClick={() => onSelect(item)}

              >

                <div className="sheet-left">

                  <div className="sheet-icon">

                    {item.icon}

                  </div>

                  <div>

                    <h4>

                      {item.title}

                    </h4>

                    {

                      item.subtitle && (

                        <p>

                          {item.subtitle}

                        </p>

                      )

                    }

                  </div>

                </div>

                <div className="sheet-right">

                  ❯

                </div>

              </div>

            ))

          }

        </div>

                {/* ================= FOOTER ================= */}

        <div className="sheet-footer">

          {

            showBack && (

              <button

                className="back-button"

                onClick={onBack}

              >

                ← Back

              </button>

            )

          }

          <button

            className="close-button"

            onClick={onClose}

          >

            ✕

            Close

          </button>

        </div>

      </div>

    </div>

  );

}

export default BottomSheet;