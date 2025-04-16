import React, { useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const Dashboard = () => {
  // Styles object
  const styles = {
    root: {
      '--primary-color': '#2c8a69',
      '--secondary-color': '#1a5e45',
      '--accent-color': '#f8b500',
      '--text-color': '#333',
      '--bg-color': '#f5f7fa',
      '--card-bg': '#ffffff',
      '--border-color': '#e0e0e0',
      '--success-color': '#4caf50',
    },
    global: {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    body: {
      backgroundColor: 'var(--bg-color)',
      color: 'var(--text-color)',
      lineHeight: 1.6,
    },
    header: {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      padding: '1.5rem',
      textAlign: 'center',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    headerH1: {
      fontSize: '2rem',
      marginBottom: '0.3rem',
    },
    headerH2: {
      fontSize: '1.2rem',
      fontWeight: 400,
      opacity: 0.9,
    },
    dashboardContainer: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 1rem',
    },
    // Summary Cards
    summarySection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    summaryCard: {
      backgroundColor: 'var(--card-bg)',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      textAlign: 'center',
      transition: 'transform 0.2s',
      ':hover': {
        transform: 'translateY(-5px)',
      },
    },
    summaryCardH3: {
      fontSize: '1rem',
      color: '#666',
      marginBottom: '0.5rem',
    },
    summaryValue: {
      fontSize: '2rem',
      fontWeight: 700,
      color: 'var(--primary-color)',
    },
    summaryUnit: {
      fontSize: '0.9rem',
      color: '#888',
    },
    timestamp: {
      fontSize: '1.2rem !important',
    },
    // Chart Section
    chartContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    chartCard: {
      backgroundColor: 'var(--card-bg)',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    },
    chartCardH3: {
      fontSize: '1.1rem',
      marginBottom: '1rem',
      color: 'var(--text-color)',
    },
    chartCanvas: {
      width: '100% !important',
      height: '300px !important',
    },
    // Comparison Section
    comparisonSection: {
      backgroundColor: 'var(--card-bg)',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      marginBottom: '2rem',
    },
    comparisonH3: {
      fontSize: '1.1rem',
      marginBottom: '1rem',
      color: 'var(--text-color)',
    },
    comparisonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    traditionalSystem: {
      flex: 1,
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: '#ffecb3',
    },
    aiSystem: {
      flex: 1,
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: '#c8e6c9',
    },
    vs: {
      fontWeight: 'bold',
      fontSize: '1.2rem',
      padding: '0 1rem',
    },
    comparisonValue: {
      fontSize: '1.5rem',
      fontWeight: 600,
      marginTop: '0.5rem',
    },
    savingsBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    barLabel: {
      minWidth: '120px',
      fontWeight: 500,
    },
    progressContainer: {
      flex: 1,
      height: '20px',
      backgroundColor: '#e0e0e0',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: 'var(--success-color)',
      width: '0%',
      transition: 'width 1s ease-in-out',
    },
    percentage: {
      fontWeight: 700,
      color: 'var(--success-color)',
    },
    // Table Styling
    dataTableSection: {
      backgroundColor: 'var(--card-bg)',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      overflowX: 'auto',
    },
    dataTableH3: {
      fontSize: '1.1rem',
      marginBottom: '1rem',
      color: 'var(--text-color)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '0.75rem',
      textAlign: 'left',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: '#f0f0f0',
      fontWeight: 600,
    },
    td: {
      padding: '0.75rem',
      textAlign: 'left',
      borderBottom: '1px solid var(--border-color)',
    },
    trHover: {
      ':hover': {
        backgroundColor: '#f9f9f9',
      },
    },
    // Footer
    footer: {
      textAlign: 'center',
      padding: '1.5rem',
      marginTop: '2rem',
      color: '#666',
      borderTop: '1px solid var(--border-color)',
    },
    // Responsive Adjustments
    '@media (max-width: 768px)': {
      summarySection: {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
      chartContainer: {
        gridTemplateColumns: '1fr',
      },
      comparisonContainer: {
        flexDirection: 'column',
        gap: '1rem',
      },
      vs: {
        margin: '0.5rem 0',
      },
      savingsBar: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
      progressContainer: {
        width: '100%',
      },
    },
  };

  // Initialize charts with useEffect
  useEffect(() => {
    // Add a small delay to ensure DOM elements are rendered
    const timer = setTimeout(() => {
      try {
        const emissionsCtx = document.getElementById('emissions-chart');
        const cumulativeCtx = document.getElementById('cumulative-chart');
        
        if (emissionsCtx && cumulativeCtx) {
          // Initialize emissions chart
          new Chart(emissionsCtx, {
            type: 'bar',
            data: {
              labels: ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5'],
              datasets: [{
                label: 'CO₂ Saved (kg)',
                data: [12, 19, 3, 5, 2],
                backgroundColor: 'rgba(44, 138, 105, 0.7)',
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
            }
          });
          
          // Initialize cumulative chart
          new Chart(cumulativeCtx, {
            type: 'line',
            data: {
              labels: ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5'],
              datasets: [{
                label: 'Total CO₂ Saved (kg)',
                data: [12, 31, 34, 39, 41],
                borderColor: 'rgba(44, 138, 105, 1)',
                backgroundColor: 'rgba(44, 138, 105, 0.1)',
                fill: true,
                tension: 0.3,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
            }
          });
          
          // Set some initial data
          document.getElementById('total-co2').textContent = '41.00';
          document.getElementById('total-vehicles').textContent = '250';
          document.getElementById('total-cycles').textContent = '5';
          document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();
          document.getElementById('traditional-emissions').textContent = '60.00 kg CO₂';
          document.getElementById('ai-emissions').textContent = '19.00 kg CO₂';
          document.getElementById('savings-percentage').textContent = '68%';
          
          // Update progress bar
          const savingsBar = document.getElementById('savings-bar');
          if (savingsBar) {
            savingsBar.style.width = '68%';
          }
          
          // Add sample data to the table
          const tableBody = document.getElementById('table-body');
          if (tableBody) {
            const sampleData = [
              { cycle: 1, timestamp: '10:15:22', cars: 42, buses: 3, trucks: 5, total: 50, co2: 12 },
              { cycle: 2, timestamp: '10:18:45', cars: 38, buses: 2, trucks: 8, total: 48, co2: 19 },
              { cycle: 3, timestamp: '10:22:10', cars: 29, buses: 1, trucks: 4, total: 34, co2: 3 },
              { cycle: 4, timestamp: '10:25:33', cars: 45, buses: 4, trucks: 3, total: 52, co2: 5 },
              { cycle: 5, timestamp: '10:29:02', cars: 58, buses: 5, trucks: 3, total: 66, co2: 2 }
            ];
            
            sampleData.forEach(row => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e0e0;">${row.cycle}</td>
                <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e0e0;">${row.timestamp}</td>
                <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e0e0;">${row.cars}</td>
                <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e0e0;">${row.buses}</td>
                <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e0e0;">${row.trucks}</td>
                <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e0e0;">${row.total}</td>
                <td style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #e0e0e0;">${row.co2}</td>
              `;
              tableBody.appendChild(tr);
            });
          }
        }
      } catch (error) {
        console.error("Error initializing charts:", error);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <h1 style={styles.headerH1}>AI-Optimized Traffic System</h1>
        <h2 style={styles.headerH2}>CO₂ Emissions Reduction Dashboard</h2>
      </header>

      <div style={styles.dashboardContainer}>
        <div style={styles.summarySection}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryCardH3}>Total CO₂ Saved</h3>
            <div style={styles.summaryValue} id="total-co2">0.00</div>
            <div style={styles.summaryUnit}>kg</div>
          </div>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryCardH3}>Total Vehicles</h3>
            <div style={styles.summaryValue} id="total-vehicles">0</div>
            <div style={styles.summaryUnit}>vehicles</div>
          </div>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryCardH3}>Total Cycles</h3>
            <div style={styles.summaryValue} id="total-cycles">0</div>
            <div style={styles.summaryUnit}>cycles</div>
          </div>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryCardH3}>Last Updated</h3>
            <div style={{...styles.summaryValue, ...styles.timestamp}} id="last-updated">-</div>
          </div>
        </div>

        <div style={styles.chartContainer}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartCardH3}>CO₂ Emissions Saved Per Signal Cycle</h3>
            <canvas id="emissions-chart" style={styles.chartCanvas}></canvas>
          </div>
          <div style={styles.chartCard}>
            <h3 style={styles.chartCardH3}>Cumulative CO₂ Savings</h3>
            <canvas id="cumulative-chart" style={styles.chartCanvas}></canvas>
          </div>
        </div>

        <div style={styles.comparisonSection}>
          <h3 style={styles.comparisonH3}>AI System vs. Traditional System</h3>
          <div style={styles.comparisonContainer}>
            <div style={styles.traditionalSystem}>
              <h4>Traditional Traffic System</h4>
              <div style={styles.comparisonValue} id="traditional-emissions">0.00 kg CO₂</div>
            </div>
            <div style={styles.vs}>VS</div>
            <div style={styles.aiSystem}>
              <h4>AI-Optimized System</h4>
              <div style={styles.comparisonValue} id="ai-emissions">0.00 kg CO₂</div>
            </div>
          </div>
          <div style={styles.savingsBar}>
            <div style={styles.barLabel}>CO₂ Reduction:</div>
            <div style={styles.progressContainer}>
              <div style={styles.progressBar} id="savings-bar"></div>
            </div>
            <div style={styles.percentage} id="savings-percentage">0%</div>
          </div>
        </div>

        <div style={styles.dataTableSection}>
          <h3 style={styles.dataTableH3}>Cycle Details</h3>
          <table style={styles.table} id="cycles-table">
            <thead>
              <tr>
                <th style={styles.th}>Cycle</th>
                <th style={styles.th}>Timestamp</th>
                <th style={styles.th}>Cars</th>
                <th style={styles.th}>Buses</th>
                <th style={styles.th}>Trucks</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>CO₂ Saved (kg)</th>
              </tr>
            </thead>
            <tbody id="table-body">
              {/* Data will be inserted by JavaScript in useEffect */}
            </tbody>
          </table>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>© 2025 AI Traffic Systems Hackathon Project</p>
      </footer>
    </div>
  );
};

export default Dashboard;