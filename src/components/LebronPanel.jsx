import './LebronPanel.css'

/**
 * "LeBron Central" panel: career stats, totals, accolades, records, milestones, fun facts.
 * props:
 *   careerStats: array of { label, value }
 *   careerTotals: array of { label, value, note }
 *   accolades: array of strings
 *   records: array of { label, status, detail }
 *   milestones: array of { label, detail }
 *   funFacts: array of strings
 */
export default function LebronPanel({ careerStats, careerTotals, accolades, records, milestones, funFacts }) {
  return (
    <div className="right-panel">
      <h2>LeBron Central</h2>

      <section className="right-panel__section">
        <h3>Career Stats</h3>
        <div className="stats-grid">
          {careerStats.map((stat) => (
            <div key={stat.label} className="stat-tile">
              <span className="stat-tile__value">{stat.value}</span>
              <span className="stat-tile__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="right-panel__section">
        <h3>Career Totals</h3>
        <ul className="totals-list">
          {careerTotals.map((total) => (
            <li key={total.label} className="total-item">
              <span className="total-item__value">{total.value}</span>
              <span className="total-item__label">{total.label}</span>
              <span className="total-item__note">{total.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="right-panel__section">
        <h3>Accolades</h3>
        <ul className="accolades-list">
          {accolades.map((accolade) => (
            <li key={accolade}>{accolade}</li>
          ))}
        </ul>
      </section>

      <section className="right-panel__section">
        <h3>Records Watch</h3>
        <ul className="records-list">
          {records.map((record) => (
            <li key={record.label} className="record-item">
              <div className="record-item__header">
                <span className="record-item__label">{record.label}</span>
                <span className={`record-status record-status--${record.status.toLowerCase()}`}>
                  {record.status}
                </span>
              </div>
              <p className="record-item__detail">{record.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="right-panel__section">
        <h3>Milestones</h3>
        <ul className="milestones-list">
          {milestones.map((milestone) => (
            <li key={milestone.label} className="milestone-item">
              <span className="milestone-item__label">{milestone.label}</span>
              <p className="milestone-item__detail">{milestone.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="right-panel__section">
        <h3>Fun Facts</h3>
        <ul className="fun-facts-list">
          {funFacts.map((fact, i) => (
            <li key={i}>{fact}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}