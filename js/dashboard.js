/**
 * Client Dashboard Engine — Nexolve Technologies Enterprise Portal
 * Handles module routing, live RFQ generation, Quote Comparison scoring engine,
 * PO tracking, Supplier Performance analytics, Document vault filtering, and Notifications.
 */

const DashboardState = {
  activeView: 'overview',
  activeRFQsCount: 8,
  quotesCount: 24,
  poStatusCount: 16,
  estimatedSavings: 248600,
  savingsPercent: 82,

  rfqs: [
    { id: 'RFQ-2048', title: 'Industrial Components (Precision Bearings & Gaskets)', category: 'Manufacturing', quantity: '45,000 units', location: 'Frankfurt, Germany', targetDate: '2026-10-15', status: 'Active', quotesReceived: 4, budget: '$180,000' },
    { id: 'RFQ-2047', title: 'Recyclable Packaging Materials (FSC Certified)', category: 'Packaging', quantity: '120,000 units', location: 'Chicago, USA', targetDate: '2026-10-02', status: 'Reviewing', quotesReceived: 5, budget: '$94,000' },
    { id: 'RFQ-2046', title: 'Site Safety Equipment & PPE Kits', category: 'Construction', quantity: '5,000 sets', location: 'Dubai, UAE', targetDate: '2026-09-28', status: 'Completed', quotesReceived: 3, budget: '$42,500' },
    { id: 'RFQ-2045', title: 'Hospital Grade Nitrile Gloves & Sanitizers', category: 'Healthcare', quantity: '80,000 boxes', location: 'Singapore', targetDate: '2026-10-20', status: 'Active', quotesReceived: 4, budget: '$115,000' },
    { id: 'RFQ-2044', title: 'Microcontroller Units & PCB Assemblies', category: 'Technology', quantity: '25,000 units', location: 'Tokyo, Japan', targetDate: '2026-11-05', status: 'Active', quotesReceived: 3, budget: '$310,000' },
    { id: 'RFQ-2043', title: 'Commercial Linen & Hospitality Textiles', category: 'Hospitality', quantity: '12,500 pcs', location: 'London, UK', targetDate: '2026-09-30', status: 'Reviewing', quotesReceived: 5, budget: '$68,000' }
  ],

  quotesComparison: [
    {
      supplier: 'Apex Precision Engineering (Germany)',
      unitPrice: 4.12,
      moq: '10,000',
      leadTime: '14 Days',
      paymentTerms: 'Net 45',
      qualityScore: 96,
      overallScore: 94.8,
      status: 'Recommended',
      notes: 'ISO 9001 certified, tier-1 automotive supplier pedigree'
    },
    {
      supplier: 'Kobe Heavy Industrial Ltd (Japan)',
      unitPrice: 4.38,
      moq: '8,000',
      leadTime: '18 Days',
      paymentTerms: 'Net 60',
      qualityScore: 98,
      overallScore: 91.2,
      status: 'Secondary',
      notes: 'Highest metallurgical purity rating, slightly higher lead time'
    },
    {
      supplier: 'Vanguard Dynamics Sourcing (USA)',
      unitPrice: 4.65,
      moq: '5,000',
      leadTime: '10 Days',
      paymentTerms: 'Net 30',
      qualityScore: 92,
      overallScore: 87.5,
      status: 'Eligible',
      notes: 'Fastest domestic delivery speed, premium unit cost'
    }
  ],

  purchaseOrders: [
    { poNumber: 'PO-8891', supplier: 'Apex Precision', orderValue: '$92,400', progress: 75, deliveryStatus: 'In Transit', paymentStatus: 'Paid (50%)', eta: '2026-09-22' },
    { poNumber: 'PO-8890', supplier: 'EcoPack Global', orderValue: '$48,200', progress: 100, deliveryStatus: 'Delivered', paymentStatus: 'Settled', eta: '2026-09-14' },
    { poNumber: 'PO-8889', supplier: 'ShieldSafe PPE', orderValue: '$21,500', progress: 30, deliveryStatus: 'Production', paymentStatus: 'Pending Inv', eta: '2026-10-05' },
    { poNumber: 'PO-8888', supplier: 'MediSupply Corp', orderValue: '$115,000', progress: 50, deliveryStatus: 'Customs Clearance', paymentStatus: 'Approved', eta: '2026-09-29' }
  ],

  suppliers: [
    { name: 'Apex Precision Engineering', quality: 96, delivery: 94, pricing: 91, reliability: 98, overall: 96, category: 'Precision Machining', region: 'Europe' },
    { name: 'EcoPack Global Solutions', quality: 92, delivery: 89, pricing: 95, reliability: 90, overall: 91, category: 'Sustainable Packaging', region: 'North America' },
    { name: 'Kobe Heavy Industrial Ltd', quality: 98, delivery: 88, pricing: 84, reliability: 93, overall: 91, category: 'Heavy Metals & Components', region: 'APAC' },
    { name: 'ShieldSafe Protection Gear', quality: 88, delivery: 91, pricing: 86, reliability: 89, overall: 87, category: 'Industrial Safety', region: 'Middle East' },
    { name: 'MediSupply International', quality: 95, delivery: 93, pricing: 88, reliability: 94, overall: 93, category: 'Healthcare Consumables', region: 'APAC' }
  ],

  documents: [
    { title: 'Master Sourcing Agreement — Apex Precision.pdf', type: 'Contract', size: '2.4 MB', date: '2026-08-12', status: 'Executed' },
    { title: 'Commercial Quotation Matrix (RFQ-2048).xlsx', type: 'Quotation', size: '1.1 MB', date: '2026-09-10', status: 'Active' },
    { title: 'Purchase Order Binding Copy (PO-8891).pdf', type: 'Purchase Order', size: '840 KB', date: '2026-09-12', status: 'Signed' },
    { title: 'Pro-Forma Customs Invoice #INV-4920.pdf', type: 'Invoice', size: '620 KB', date: '2026-09-14', status: 'Processing' },
    { title: 'Supplier ISO 14001 ESG Audit Certificate.pdf', type: 'Compliance', size: '3.8 MB', date: '2026-07-28', status: 'Verified' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  initSidebarNavigation();
  initRFQModal();
  renderOverviewModule();
  renderActiveRFQsModule();
  renderQuoteComparisonModule();
  renderPurchaseOrdersModule();
  renderSupplierPerformanceModule();
  renderSpendAnalyticsModule();
  renderContractsModule();
  initSearchFilters();
});

/* Sidebar Navigation Router */
function initSidebarNavigation() {
  const navItems = document.querySelectorAll('.sidebar-item[data-view]');
  const viewPanels = document.querySelectorAll('.dashboard-view-panel');
  const currentViewLabel = document.getElementById('currentViewBreadcrumb');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      viewPanels.forEach(panel => {
        if (panel.getAttribute('id') === `view-${targetView}`) {
          panel.classList.add('active-view');
        } else {
          panel.classList.remove('active-view');
        }
      });

      if (currentViewLabel) {
        currentViewLabel.textContent = item.querySelector('.sidebar-name')?.textContent || 'Overview';
      }
      DashboardState.activeView = targetView;

      // Close mobile sidebar if open
      const sidebar = document.querySelector('.dashboard-sidebar');
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
      }
    });
  });

  const sidebarToggle = document.getElementById('sidebarToggleBtn');
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }
}

/* Module 1: Render Overview */
function renderOverviewModule() {
  const tableBody = document.getElementById('recentRfqsTableBody');
  if (!tableBody) return;

  tableBody.innerHTML = DashboardState.rfqs.slice(0, 4).map(rfq => {
    let badgeClass = 'badge-active';
    if (rfq.status === 'Reviewing') badgeClass = 'badge-review';
    if (rfq.status === 'Completed') badgeClass = 'badge-steel';

    return `
      <tr>
        <td class="mono text-copper" style="font-weight:700;">${rfq.id}</td>
        <td style="font-weight:600;">${rfq.title}</td>
        <td><span class="badge ${badgeClass}">${rfq.status}</span></td>
        <td class="mono">${rfq.quotesReceived} Quotes</td>
        <td class="mono text-gold">${rfq.budget}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="switchViewTo('quote-comparison')">Compare Quotes</button>
        </td>
      </tr>
    `;
  }).join('');
}

/* Module 2 & 3: Sourcing Requests Modal & Active RFQs */
function initRFQModal() {
  const openBtns = document.querySelectorAll('.open-rfq-modal');
  const modal = document.getElementById('rfqCreateModal');
  const closeBtn = document.getElementById('closeRfqModalBtn');
  const form = document.getElementById('newRfqForm');

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) modal.classList.add('active');
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('rfqTitleInput').value;
      const category = document.getElementById('rfqCategoryInput').value;
      const quantity = document.getElementById('rfqQuantityInput').value;
      const budget = document.getElementById('rfqBudgetInput').value;
      const targetDate = document.getElementById('rfqDateInput').value || '2026-10-30';
      const location = document.getElementById('rfqLocationInput').value || 'Global';

      const newId = `RFQ-${2049 + DashboardState.rfqs.length - 6}`;
      const newRFQ = {
        id: newId,
        title,
        category,
        quantity,
        location,
        targetDate,
        status: 'Active',
        quotesReceived: 0,
        budget: `$${parseInt(budget || '50000', 10).toLocaleString()}`
      };

      DashboardState.rfqs.unshift(newRFQ);
      DashboardState.activeRFQsCount++;
      
      const badgeCount = document.getElementById('overviewRfqCount');
      if (badgeCount) badgeCount.textContent = `0${DashboardState.activeRFQsCount}`;

      renderOverviewModule();
      renderActiveRFQsModule();

      if (modal) modal.classList.remove('active');
      form.reset();

      if (window.showToast) {
        window.showToast(`Sourcing Request ${newId} published! Matching suppliers dispatched.`, 'success');
      }
    });
  }
}

function renderActiveRFQsModule() {
  const container = document.getElementById('allRfqsTableBody');
  if (!container) return;

  container.innerHTML = DashboardState.rfqs.map(rfq => {
    let badgeClass = 'badge-active';
    if (rfq.status === 'Reviewing') badgeClass = 'badge-review';
    if (rfq.status === 'Completed') badgeClass = 'badge-steel';

    return `
      <tr>
        <td class="mono text-copper" style="font-weight:700;">${rfq.id}</td>
        <td>
          <div style="font-weight:600; color:#FFF;">${rfq.title}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${rfq.category} • ${rfq.location}</div>
        </td>
        <td class="mono">${rfq.quantity}</td>
        <td class="mono text-gold">${rfq.budget}</td>
        <td class="mono">${rfq.targetDate}</td>
        <td><span class="badge ${badgeClass}">${rfq.status}</span></td>
        <td class="mono">${rfq.quotesReceived} Quotes</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="switchViewTo('quote-comparison')">Analyze</button>
        </td>
      </tr>
    `;
  }).join('');
}

/* Module 4: Quote Comparison Matrix */
function renderQuoteComparisonModule() {
  const tableBody = document.getElementById('quoteMatrixBody');
  if (!tableBody) return;

  tableBody.innerHTML = DashboardState.quotesComparison.map((q, idx) => {
    const isWinner = idx === 0;
    return `
      <tr class="${isWinner ? 'winner' : ''}">
        <td>
          <div style="font-weight:700; color:#FFFFFF;">${q.supplier}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${q.notes}</div>
        </td>
        <td class="mono text-gold" style="font-weight:700; font-size:1.1rem;">$${q.unitPrice.toFixed(2)}</td>
        <td class="mono">${q.moq}</td>
        <td class="mono">${q.leadTime}</td>
        <td class="mono text-copper">${q.paymentTerms}</td>
        <td>
          <span class="badge badge-active mono">${q.qualityScore}%</span>
        </td>
        <td>
          <span class="badge badge-gold mono" style="font-size:0.85rem; font-weight:700;">${q.overallScore}</span>
        </td>
        <td>
          <button class="btn ${isWinner ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="awardSupplierQuote('${q.supplier}')">
            ${isWinner ? 'Award Contract' : 'Select'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/* Module 5: Purchase Orders */
function renderPurchaseOrdersModule() {
  const tableBody = document.getElementById('purchaseOrdersBody');
  if (!tableBody) return;

  tableBody.innerHTML = DashboardState.purchaseOrders.map(po => {
    return `
      <tr>
        <td class="mono text-copper" style="font-weight:700;">${po.poNumber}</td>
        <td style="font-weight:600;">${po.supplier}</td>
        <td class="mono text-gold" style="font-weight:700;">${po.orderValue}</td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <div class="progress-bar-wrap" style="width:100px; height:6px;">
              <div class="progress-bar-fill" style="width:${po.progress}%;"></div>
            </div>
            <span class="mono" style="font-size:0.75rem;">${po.progress}%</span>
          </div>
        </td>
        <td><span class="badge badge-copper">${po.deliveryStatus}</span></td>
        <td class="mono">${po.paymentStatus}</td>
        <td class="mono">${po.eta}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="downloadPODocument('${po.poNumber}')">PDF</button>
        </td>
      </tr>
    `;
  }).join('');
}

/* Module 6: Supplier Performance */
function renderSupplierPerformanceModule() {
  const container = document.getElementById('supplierPerformanceList');
  if (!container) return;

  container.innerHTML = DashboardState.suppliers.map(s => {
    return `
      <div class="card" style="margin-bottom:16px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h4 style="font-size:1.1rem; color:#FFF; margin-bottom:4px;">${s.name}</h4>
            <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">${s.category} • ${s.region}</div>
          </div>
          <div style="text-align:right;">
            <div class="mono text-gold" style="font-size:1.8rem; font-weight:800;">${s.overall}%</div>
            <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Overall Score</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; font-family:var(--font-mono); font-size:0.8rem;">
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">QUALITY</div>
            <div class="supplier-score-bar-bg" style="width:100%;"><div class="supplier-score-bar-fill" style="width:${s.quality}%;"></div></div>
            <div style="margin-top:4px; font-weight:700;">${s.quality}%</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">DELIVERY</div>
            <div class="supplier-score-bar-bg" style="width:100%;"><div class="supplier-score-bar-fill" style="width:${s.delivery}%;"></div></div>
            <div style="margin-top:4px; font-weight:700;">${s.delivery}%</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">PRICING</div>
            <div class="supplier-score-bar-bg" style="width:100%;"><div class="supplier-score-bar-fill" style="width:${s.pricing}%;"></div></div>
            <div style="margin-top:4px; font-weight:700;">${s.pricing}%</div>
          </div>
          <div>
            <div style="color:var(--text-muted); margin-bottom:4px;">RELIABILITY</div>
            <div class="supplier-score-bar-bg" style="width:100%;"><div class="supplier-score-bar-fill" style="width:${s.reliability}%;"></div></div>
            <div style="margin-top:4px; font-weight:700;">${s.reliability}%</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* Module 7: Spend Analytics */
function renderSpendAnalyticsModule() {
  const container = document.getElementById('spendMonthlyChart');
  if (!container) return;

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const spend = [340, 420, 390, 510, 460, 380]; // in thousands
  const savings = [68, 85, 78, 102, 94, 82];

  const maxVal = 600;

  container.innerHTML = months.map((m, i) => {
    const spendHeight = (spend[i] / maxVal) * 160;
    const savingsHeight = (savings[i] / maxVal) * 160;
    return `
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px; flex:1;">
        <div style="display:flex; align-items:flex-end; gap:6px; height:160px;">
          <div style="width:20px; height:${spendHeight}px; background:#2A3138; border-radius:4px 4px 0 0;" title="Spend: $${spend[i]}k"></div>
          <div style="width:20px; height:${savingsHeight}px; background:linear-gradient(180deg, var(--color-gold), var(--color-copper)); border-radius:4px 4px 0 0;" title="Savings: $${savings[i]}k"></div>
        </div>
        <span class="mono" style="font-size:0.75rem; color:var(--text-muted);">${m}</span>
      </div>
    `;
  }).join('');
}

/* Module 8: Contracts & Documents Vault */
function renderContractsModule() {
  const container = document.getElementById('documentsTableBody');
  if (!container) return;

  container.innerHTML = DashboardState.documents.map(doc => {
    return `
      <tr>
        <td>
          <div style="font-weight:600; color:#FFFFFF;">📄 ${doc.title}</div>
        </td>
        <td><span class="badge badge-steel">${doc.type}</span></td>
        <td class="mono">${doc.size}</td>
        <td class="mono">${doc.date}</td>
        <td><span class="badge badge-active">${doc.status}</span></td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="downloadPODocument('${doc.title}')">Download</button>
        </td>
      </tr>
    `;
  }).join('');
}

/* Search Filters across tables */
function initSearchFilters() {
  const rfqSearch = document.getElementById('rfqSearchInput');
  if (rfqSearch) {
    rfqSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#allRfqsTableBody tr');
      rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        r.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }
}

/* Utility Helpers */
window.switchViewTo = function(viewName) {
  const targetNavItem = document.querySelector(`.sidebar-item[data-view="${viewName}"]`);
  if (targetNavItem) {
    targetNavItem.click();
  }
};

window.awardSupplierQuote = function(supplierName) {
  if (window.showToast) {
    window.showToast(`Contract proposal awarded to ${supplierName}. Generating PO documents...`, 'success');
  }
};

window.downloadPODocument = function(ref) {
  if (window.showToast) {
    window.showToast(`Downloading secure encrypted document: ${ref}`, 'info');
  }
};
