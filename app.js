const STORAGE_KEY = "matbagyDesignWorkflow.v1";
const BACKUP_VERSION = 1;

const statuses = [
  "طلب جديد",
  "تحت التصميم",
  "بروفة جاهزة",
  "تعديل مطلوب",
  "معتمد",
  "جاهز للإنتاج",
  "مكتمل",
  "ملغي",
];

const seedTemplates = [
  {
    id: "birthday-collage-30x40-8",
    name: "Birthday collage 30x40 with 8 images",
    arabicName: "كولاج عيد ميلاد 30x40 - 8 صور",
    size: "30x40",
    minImages: 8,
    maxImages: 8,
    category: "لوحات",
    requiredText: true,
    outputHint: "PDF أو PNG جاهز للطباعة",
  },
  {
    id: "birthday-collage-40x50-9-10",
    name: "Birthday collage 40x50 with 9-10 images",
    arabicName: "كولاج عيد ميلاد 40x50 - 9 إلى 10 صور",
    size: "40x50",
    minImages: 9,
    maxImages: 10,
    category: "لوحات",
    requiredText: true,
    outputHint: "PDF أو PNG جاهز للطباعة",
  },
  {
    id: "senior-2026-sticker-7x10",
    name: "Senior 2026 sticker 7x10",
    arabicName: "استيكر Senior 2026 مقاس 7x10",
    size: "7x10",
    minImages: 1,
    maxImages: 1,
    category: "استيكر",
    requiredText: true,
    outputHint: "ملف قص أو طباعة",
  },
  {
    id: "school-sticker-6x9",
    name: "School sticker 6x9",
    arabicName: "استيكر مدرسة 6x9",
    size: "6x9",
    minImages: 1,
    maxImages: 1,
    category: "استيكر",
    requiredText: true,
    outputHint: "ملف قص أو طباعة",
  },
  {
    id: "graduation-mug-20x9",
    name: "Graduation mug 20x9",
    arabicName: "مج تخرج 20x9",
    size: "20x9",
    minImages: 1,
    maxImages: 3,
    category: "مج",
    requiredText: true,
    outputHint: "PNG ملتف للمج",
  },
  {
    id: "wedding-timeline-a4",
    name: "Wedding timeline A4",
    arabicName: "تايملاين زفاف A4",
    size: "A4",
    minImages: 0,
    maxImages: 4,
    category: "مناسبات",
    requiredText: true,
    outputHint: "PDF للطباعة",
  },
  {
    id: "memorial-board-50x70",
    name: "Memorial board 50x70",
    arabicName: "لوحة تذكارية 50x70",
    size: "50x70",
    minImages: 1,
    maxImages: 3,
    category: "لوحات",
    requiredText: true,
    outputHint: "PDF أو PNG عالي الجودة",
  },
  {
    id: "white-background-board-20x30",
    name: "White background board 20x30",
    arabicName: "لوحة خلفية بيضاء 20x30",
    size: "20x30",
    minImages: 1,
    maxImages: 2,
    category: "لوحات",
    requiredText: true,
    outputHint: "PDF أو PNG جاهز للطباعة",
  },
];

const defaultSettings = {
  workspaceName: "Matbagy Design Workflow MVP",
  requestPrefix: "MDW",
  qualityThreshold: "medium",
};

const state = loadState();

const elements = {
  navList: document.getElementById("navList"),
  pageTitle: document.getElementById("pageTitle"),
  mobileMenu: document.getElementById("mobileMenu"),
  sidebar: document.querySelector(".sidebar"),
  toast: document.getElementById("toast"),
  metricGrid: document.getElementById("metricGrid"),
  activeCount: document.getElementById("activeCount"),
  riskCount: document.getElementById("riskCount"),
  riskList: document.getElementById("riskList"),
  recentRequests: document.getElementById("recentRequests"),
  templateGrid: document.getElementById("templateGrid"),
  templateSelect: document.getElementById("templateSelect"),
  requestForm: document.getElementById("requestForm"),
  statusFilter: document.getElementById("statusFilter"),
  requestSearch: document.getElementById("requestSearch"),
  workflowList: document.getElementById("workflowList"),
  proofList: document.getElementById("proofList"),
  preflightList: document.getElementById("preflightList"),
  activityList: document.getElementById("activityList"),
  settingsForm: document.getElementById("settingsForm"),
  importBackup: document.getElementById("importBackup"),
};

initialize();

function initialize() {
  wireNavigation();
  wireForms();
  ensureStatusFilter();
  renderAll();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        templates: seedTemplates,
        requests: [],
        activity: [
          createActivity("تهيئة النظام", "تم إنشاء مساحة عمل تجريبية مستقلة محفوظة محليًا."),
        ],
        settings: defaultSettings,
      };
    }

    const parsed = JSON.parse(raw);
    return {
      templates: Array.isArray(parsed.templates) && parsed.templates.length ? parsed.templates : seedTemplates,
      requests: Array.isArray(parsed.requests) ? parsed.requests : [],
      activity: Array.isArray(parsed.activity) ? parsed.activity : [],
      settings: { ...defaultSettings, ...(parsed.settings || {}) },
    };
  } catch (error) {
    console.warn("Could not load local workflow data. Starting fresh.", error);
    return {
      templates: seedTemplates,
      requests: [],
      activity: [createActivity("إعادة تهيئة", "تعذر قراءة البيانات المحلية السابقة.")],
      settings: defaultSettings,
    };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createActivity(title, detail, requestId = null) {
  return {
    id: crypto.randomUUID(),
    title,
    detail,
    requestId,
    createdAt: new Date().toISOString(),
  };
}

function logActivity(title, detail, requestId = null) {
  state.activity.unshift(createActivity(title, detail, requestId));
  state.activity = state.activity.slice(0, 200);
  saveState();
}

function wireNavigation() {
  elements.navList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view]");
    if (!button) return;
    showView(button.dataset.view);
  });

  document.body.addEventListener("click", (event) => {
    const jump = event.target.closest("[data-view-jump]");
    if (jump) showView(jump.dataset.viewJump);
  });

  elements.mobileMenu.addEventListener("click", () => {
    elements.sidebar.classList.toggle("is-open");
  });
}

function wireForms() {
  elements.requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(elements.requestForm);
    const template = findTemplate(form.get("templateId"));
    const request = {
      id: `${state.settings.requestPrefix}-${String(Date.now()).slice(-6)}`,
      title: cleanText(form.get("title")),
      templateId: template.id,
      status: "طلب جديد",
      requiredText: cleanText(form.get("requiredText")),
      imageCount: Number(form.get("imageCount") || 0),
      imageNames: splitLines(form.get("imageNames")),
      outputFile: cleanText(form.get("outputFile")),
      designer: cleanText(form.get("designer")),
      productionNotes: cleanText(form.get("productionNotes")),
      proof: {
        approved: false,
        approvalDate: null,
        locked: false,
        version: "v1",
        changeRequest: "",
      },
      preflightOverrides: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state.requests.unshift(request);
    logActivity("طلب جديد", `تم إنشاء ${request.id} باستخدام قالب ${template.arabicName}.`, request.id);
    saveState();
    elements.requestForm.reset();
    renderAll();
    showView("workflow");
    toast("تم حفظ الطلب التجريبي.");
  });

  document.getElementById("seedDemoData").addEventListener("click", seedDemoRequests);
  document.getElementById("resetTemplates").addEventListener("click", () => {
    state.templates = seedTemplates;
    logActivity("استعادة القوالب", "تمت استعادة مكتبة القوالب الأساسية.");
    saveState();
    renderAll();
    toast("تمت استعادة القوالب الأساسية.");
  });

  elements.statusFilter.addEventListener("change", renderWorkflow);
  elements.requestSearch.addEventListener("input", renderWorkflow);

  document.getElementById("clearActivity").addEventListener("click", () => {
    state.activity = [createActivity("مسح السجل", "تم مسح سجل النشاط المحلي.")];
    saveState();
    renderActivity();
    toast("تم مسح السجل.");
  });

  elements.settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(elements.settingsForm);
    state.settings = {
      workspaceName: cleanText(form.get("workspaceName")) || defaultSettings.workspaceName,
      requestPrefix: cleanText(form.get("requestPrefix")) || defaultSettings.requestPrefix,
      qualityThreshold: form.get("qualityThreshold") || defaultSettings.qualityThreshold,
    };
    logActivity("تحديث الإعدادات", "تم حفظ إعدادات مساحة العمل التجريبية.");
    saveState();
    renderAll();
    toast("تم حفظ الإعدادات.");
  });

  document.getElementById("resetAllData").addEventListener("click", () => {
    const confirmed = window.confirm("سيتم مسح كل البيانات التجريبية المحلية. هل تريد المتابعة؟");
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    Object.assign(state, loadState());
    renderAll();
    toast("تم مسح البيانات المحلية.");
  });

  document.getElementById("exportBackup").addEventListener("click", exportBackup);
  elements.importBackup.addEventListener("change", importBackup);
}

function ensureStatusFilter() {
  elements.statusFilter.innerHTML = [
    `<option value="all">كل الحالات</option>`,
    ...statuses.map((status) => `<option value="${escapeHtml(status)}">${escapeHtml(status)}</option>`),
  ].join("");
}

function showView(viewId) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-visible", view.id === viewId);
  });
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewId);
  });
  const activeButton = document.querySelector(`[data-view="${viewId}"] span:last-child`);
  elements.pageTitle.textContent = activeButton ? activeButton.textContent : "Matbagy";
  elements.sidebar.classList.remove("is-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAll() {
  renderDashboard();
  renderTemplates();
  renderTemplateSelect();
  renderWorkflow();
  renderProofs();
  renderPreflight();
  renderActivity();
  renderSettings();
}

function renderDashboard() {
  const counts = statuses.reduce((acc, status) => {
    acc[status] = state.requests.filter((request) => request.status === status).length;
    return acc;
  }, {});
  const active = state.requests.filter((request) => !["مكتمل", "ملغي"].includes(request.status)).length;
  const approved = state.requests.filter((request) => request.proof.approved).length;
  const productionReady = state.requests.filter((request) => request.status === "جاهز للإنتاج").length;

  const metrics = [
    ["كل الطلبات", state.requests.length],
    ["طلبات نشطة", active],
    ["بروفات معتمدة", approved],
    ["جاهز للإنتاج", productionReady],
  ];

  elements.metricGrid.innerHTML = metrics.map(([label, value]) => `
    <article class="metric-card">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `).join("");

  elements.activeCount.textContent = active;
  elements.riskCount.textContent = getRiskItems().length;
  elements.recentRequests.innerHTML = state.requests.slice(0, 5).map(renderRequestSummary).join("") || emptyState();
  elements.riskList.innerHTML = getRiskItems().slice(0, 6).map((item) => `
    <div class="check-row">
      <span class="check-state ${item.level === "warn" ? "warn" : "fail"}">${item.level === "warn" ? "!" : "×"}</span>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.detail)}</span>
      </div>
    </div>
  `).join("") || `
    <div class="check-row">
      <span class="check-state pass">✓</span>
      <div><strong>لا توجد تنبيهات</strong><span>كل الطلبات الحالية تبدو مستقرة.</span></div>
    </div>
  `;

  void counts;
}

function renderTemplates() {
  elements.templateGrid.innerHTML = state.templates.map((template) => `
    <article class="template-card">
      <div class="template-swatch" aria-hidden="true"></div>
      <div>
        <h3>${escapeHtml(template.arabicName)}</h3>
        <p class="muted">${escapeHtml(template.outputHint)}</p>
      </div>
      <div class="template-meta">
        <span class="chip blue">${escapeHtml(template.size)}</span>
        <span class="chip orange">${imageRequirementLabel(template)}</span>
        <span class="chip">${escapeHtml(template.category)}</span>
      </div>
    </article>
  `).join("");
}

function renderTemplateSelect() {
  elements.templateSelect.innerHTML = state.templates.map((template) => `
    <option value="${escapeHtml(template.id)}">${escapeHtml(template.arabicName)}</option>
  `).join("");
}

function renderWorkflow() {
  const selectedStatus = elements.statusFilter.value || "all";
  const query = elements.requestSearch.value.trim().toLowerCase();
  const filtered = state.requests.filter((request) => {
    const statusMatch = selectedStatus === "all" || request.status === selectedStatus;
    const textMatch = !query || `${request.id} ${request.title}`.toLowerCase().includes(query);
    return statusMatch && textMatch;
  });

  elements.workflowList.innerHTML = filtered.map((request) => renderRequestCard(request, "workflow")).join("") || emptyState();
  bindRequestActions(elements.workflowList);
}

function renderProofs() {
  const proofRequests = state.requests.filter((request) => request.status !== "ملغي");
  elements.proofList.innerHTML = proofRequests.map((request) => renderRequestCard(request, "proof")).join("") || emptyState();
  bindRequestActions(elements.proofList);
}

function renderPreflight() {
  const productionRequests = state.requests.filter((request) => !["مكتمل", "ملغي"].includes(request.status));
  elements.preflightList.innerHTML = productionRequests.map((request) => renderRequestCard(request, "preflight")).join("") || emptyState();
  bindRequestActions(elements.preflightList);
}

function renderActivity() {
  elements.activityList.innerHTML = state.activity.map((item) => `
    <article class="activity-item">
      <strong>${escapeHtml(item.title)}</strong>
      <p class="muted">${escapeHtml(item.detail)}</p>
      <span>${formatDate(item.createdAt)}${item.requestId ? ` · ${escapeHtml(item.requestId)}` : ""}</span>
    </article>
  `).join("") || emptyState();
}

function renderSettings() {
  elements.settingsForm.workspaceName.value = state.settings.workspaceName;
  elements.settingsForm.requestPrefix.value = state.settings.requestPrefix;
  elements.settingsForm.qualityThreshold.value = state.settings.qualityThreshold;
}

function renderRequestSummary(request) {
  const template = findTemplate(request.templateId);
  return `
    <article class="request-card">
      <div class="request-card-header">
        <div>
          <h3>${escapeHtml(request.title)}</h3>
          <span class="request-id">${escapeHtml(request.id)} · ${escapeHtml(template.arabicName)}</span>
        </div>
        <span class="chip blue">${escapeHtml(request.status)}</span>
      </div>
    </article>
  `;
}

function renderRequestCard(request, mode) {
  const template = findTemplate(request.templateId);
  const checks = getPreflightChecks(request, template);
  const failed = checks.filter((check) => check.state === "fail").length;
  const warnings = checks.filter((check) => check.state === "warn").length;

  return `
    <article class="request-card" data-request-id="${escapeHtml(request.id)}">
      <div class="request-card-header">
        <div>
          <h3>${escapeHtml(request.title)}</h3>
          <span class="request-id">${escapeHtml(request.id)} · ${formatDate(request.createdAt)}</span>
        </div>
        <span class="chip ${request.proof.approved ? "green" : "blue"}">${escapeHtml(request.status)}</span>
      </div>

      <div class="request-grid">
        <div class="detail"><span>القالب</span><strong>${escapeHtml(template.arabicName)}</strong></div>
        <div class="detail"><span>المقاس</span><strong>${escapeHtml(template.size)}</strong></div>
        <div class="detail"><span>الصور</span><strong>${request.imageCount} / ${imageRequirementLabel(template)}</strong></div>
        <div class="detail"><span>البروفة</span><strong>${request.proof.approved ? `معتمدة ${formatDate(request.proof.approvalDate)}` : "غير معتمدة"}</strong></div>
      </div>

      ${mode === "workflow" ? renderWorkflowControls(request) : ""}
      ${mode === "proof" ? renderProofControls(request) : ""}
      ${mode === "preflight" ? renderPreflightChecks(checks, failed, warnings, request) : ""}
    </article>
  `;
}

function renderWorkflowControls(request) {
  return `
    <div class="card-actions">
      <select class="status-select" data-action="status" aria-label="تغيير الحالة">
        ${statuses.map((status) => `<option value="${escapeHtml(status)}" ${status === request.status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
      </select>
      <button class="small-action" type="button" data-action="duplicate">نسخ كطلب جديد</button>
      <button class="small-action" type="button" data-action="delete">حذف محلي</button>
    </div>
  `;
}

function renderProofControls(request) {
  if (request.proof.locked) {
    return `
      <div class="approval-box">
        <span class="locked-note">النسخة ${escapeHtml(request.proof.version)} مقفلة بعد الاعتماد.</span>
        <p class="muted">تاريخ الاعتماد: ${formatDate(request.proof.approvalDate)}</p>
      </div>
    `;
  }

  return `
    <div class="approval-box">
      <label>
        <span>ملاحظات التعديل</span>
        <textarea data-field="changeRequest" rows="3" placeholder="اكتب سبب طلب التعديل عند الحاجة">${escapeHtml(request.proof.changeRequest || "")}</textarea>
      </label>
      <div class="card-actions">
        <button class="primary-action" type="button" data-action="approve-proof">اعتماد البروفة</button>
        <button class="ghost-action" type="button" data-action="request-changes">طلب تعديل</button>
      </div>
    </div>
  `;
}

function renderPreflightChecks(checks, failed, warnings, request) {
  const canProduce = failed === 0;
  return `
    <div class="check-list">
      ${checks.map((check) => `
        <div class="check-row">
          <span class="check-state ${check.state}">${check.state === "pass" ? "✓" : check.state === "warn" ? "!" : "×"}</span>
          <div>
            <strong>${escapeHtml(check.label)}</strong>
            <span>${escapeHtml(check.detail)}</span>
          </div>
        </div>
      `).join("")}
    </div>
    <div class="card-actions margin-top">
      <button class="primary-action" type="button" data-action="mark-production" ${canProduce ? "" : "disabled"}>تحديد كجاهز للإنتاج</button>
      <span class="chip ${failed ? "red" : warnings ? "orange" : "green"}">
        ${failed ? `${failed} عناصر مانعة` : warnings ? `${warnings} تحذيرات` : "جاهز"}
      </span>
      ${request.status === "جاهز للإنتاج" ? `<span class="chip green">تم اعتماد الجاهزية</span>` : ""}
    </div>
  `;
}

function bindRequestActions(container) {
  container.querySelectorAll("[data-action]").forEach((control) => {
    control.addEventListener("click", handleRequestAction);
    control.addEventListener("change", handleRequestAction);
  });
}

function handleRequestAction(event) {
  const action = event.currentTarget.dataset.action;
  const card = event.currentTarget.closest("[data-request-id]");
  const request = state.requests.find((item) => item.id === card.dataset.requestId);
  if (!request) return;

  if (action === "status") {
    const nextStatus = event.currentTarget.value;
    if (nextStatus === "جاهز للإنتاج" && getPreflightChecks(request, findTemplate(request.templateId)).some((check) => check.state === "fail")) {
      event.currentTarget.value = request.status;
      toast("لا يمكن الانتقال للإنتاج قبل اعتماد البروفة واكتمال الفحص.");
      return;
    }
    request.status = nextStatus;
    request.updatedAt = new Date().toISOString();
    logActivity("تغيير حالة", `تم تغيير حالة ${request.id} إلى ${nextStatus}.`, request.id);
  }

  if (action === "duplicate") {
    const copy = {
      ...structuredClone(request),
      id: `${state.settings.requestPrefix}-${String(Date.now()).slice(-6)}`,
      title: `${request.title} - نسخة`,
      status: "طلب جديد",
      proof: { approved: false, approvalDate: null, locked: false, version: "v1", changeRequest: "" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.requests.unshift(copy);
    logActivity("نسخ طلب", `تم إنشاء ${copy.id} من ${request.id}.`, copy.id);
  }

  if (action === "delete") {
    const confirmed = window.confirm("حذف هذا الطلب التجريبي من المتصفح فقط؟");
    if (!confirmed) return;
    state.requests = state.requests.filter((item) => item.id !== request.id);
    logActivity("حذف طلب", `تم حذف ${request.id} من التخزين المحلي.`);
  }

  if (action === "approve-proof") {
    request.proof.approved = true;
    request.proof.approvalDate = new Date().toISOString();
    request.proof.locked = true;
    request.status = "معتمد";
    request.updatedAt = new Date().toISOString();
    logActivity("اعتماد بروفة", `تم اعتماد وقفل بروفة ${request.id}.`, request.id);
  }

  if (action === "request-changes") {
    const notes = card.querySelector("[data-field='changeRequest']").value.trim();
    request.proof.changeRequest = notes;
    request.status = "تعديل مطلوب";
    request.updatedAt = new Date().toISOString();
    logActivity("طلب تعديل", notes || `تم طلب تعديل على ${request.id}.`, request.id);
  }

  if (action === "mark-production") {
    request.status = "جاهز للإنتاج";
    request.updatedAt = new Date().toISOString();
    logActivity("جاهز للإنتاج", `اكتمل فحص ما قبل الإنتاج للطلب ${request.id}.`, request.id);
  }

  saveState();
  renderAll();
}

function getPreflightChecks(request, template) {
  const names = request.imageNames.map((name) => name.toLowerCase());
  const uniqueNames = new Set(names);
  const expectedImageCount = request.imageCount >= template.minImages && request.imageCount <= template.maxImages;
  const namesMatchCount = request.imageNames.length === 0 || request.imageNames.length === request.imageCount;
  const duplicateImages = names.length > 0 && uniqueNames.size !== names.length;
  const qualityWarning = request.imageNames.some((name) => /low|small|whatsapp|screen|screenshot/i.test(name));

  return [
    {
      label: "المقاس صحيح",
      state: template.size ? "pass" : "fail",
      detail: `القالب مضبوط على مقاس ${template.size}.`,
    },
    {
      label: "الاسم/النص المطلوب موجود",
      state: request.requiredText ? "pass" : "fail",
      detail: request.requiredText || "النص المطلوب غير مكتمل.",
    },
    {
      label: "عدد الصور صحيح",
      state: expectedImageCount && namesMatchCount ? "pass" : "fail",
      detail: `المطلوب ${imageRequirementLabel(template)}، والمستلم ${request.imageCount}.`,
    },
    {
      label: "لا توجد صور مكررة",
      state: duplicateImages ? "fail" : "pass",
      detail: duplicateImages ? "تم اكتشاف أسماء صور مكررة." : "لم يتم اكتشاف تكرار في أسماء الصور.",
    },
    {
      label: "تحذير جودة الصور",
      state: qualityWarning ? "warn" : "pass",
      detail: qualityWarning ? "توجد أسماء صور توحي بجودة منخفضة." : "لا توجد مؤشرات جودة منخفضة في الأسماء.",
    },
    {
      label: "البروفة معتمدة",
      state: request.proof.approved ? "pass" : "fail",
      detail: request.proof.approved ? `تم الاعتماد في ${formatDate(request.proof.approvalDate)}.` : "لا يمكن الإنتاج قبل اعتماد البروفة.",
    },
    {
      label: "ملف الخرج موجود",
      state: request.outputFile ? "pass" : "fail",
      detail: request.outputFile || "أدخل اسم ملف الخرج النهائي أو البروفة.",
    },
    {
      label: "ملاحظات الإنتاج مكتملة",
      state: request.productionNotes && request.productionNotes.length >= 8 ? "pass" : "fail",
      detail: request.productionNotes || "أضف ملاحظات الإنتاج المطلوبة.",
    },
  ];
}

function getRiskItems() {
  return state.requests.flatMap((request) => {
    const template = findTemplate(request.templateId);
    return getPreflightChecks(request, template)
      .filter((check) => check.state !== "pass")
      .map((check) => ({
        title: `${request.id}: ${check.label}`,
        detail: check.detail,
        level: check.state,
      }));
  });
}

function seedDemoRequests() {
  const first = state.templates[0];
  const second = state.templates[4];
  const now = Date.now();
  const demoRequests = [
    {
      id: `${state.settings.requestPrefix}-${String(now).slice(-6)}`,
      title: "طلب تجريبي - كولاج عيد ميلاد",
      templateId: first.id,
      status: "بروفة جاهزة",
      requiredText: "اسم تجريبي",
      imageCount: 8,
      imageNames: ["img-01.jpg", "img-02.jpg", "img-03.jpg", "img-04.jpg", "img-05.jpg", "img-06.jpg", "img-07.jpg", "img-08.jpg"],
      outputFile: "birthday-proof-v1.pdf",
      designer: "مصمم تجريبي",
      productionNotes: "طباعة لوحة تجريبية مع مراجعة الهوامش.",
      proof: { approved: false, approvalDate: null, locked: false, version: "v1", changeRequest: "" },
      preflightOverrides: {},
      createdAt: new Date(now - 86400000).toISOString(),
      updatedAt: new Date(now - 3600000).toISOString(),
    },
    {
      id: `${state.settings.requestPrefix}-${String(now + 1).slice(-6)}`,
      title: "طلب تجريبي - مج تخرج",
      templateId: second.id,
      status: "معتمد",
      requiredText: "Class of 2026",
      imageCount: 2,
      imageNames: ["portrait-high.jpg", "logo.png"],
      outputFile: "graduation-mug-final.png",
      designer: "مصمم تجريبي",
      productionNotes: "تجهيز ملف PNG ملفوف للمج قبل الطباعة.",
      proof: { approved: true, approvalDate: new Date(now - 1800000).toISOString(), locked: true, version: "v1", changeRequest: "" },
      preflightOverrides: {},
      createdAt: new Date(now - 172800000).toISOString(),
      updatedAt: new Date(now - 1800000).toISOString(),
    },
  ];

  state.requests.unshift(...demoRequests);
  logActivity("إضافة بيانات تجريبية", "تمت إضافة طلبين لاختبار لوحة التحكم والفحص.");
  saveState();
  renderAll();
  toast("تمت إضافة طلبات تجريبية.");
}

function exportBackup() {
  const payload = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    app: "Matbagy Design Workflow MVP",
    safety: "Independent experimental data only. No production connection.",
    data: state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `matbagy-design-workflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  logActivity("تصدير نسخة JSON", "تم تصدير نسخة احتياطية تجريبية.");
  saveState();
  renderActivity();
}

async function importBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed.data || !Array.isArray(parsed.data.templates) || !Array.isArray(parsed.data.requests)) {
      throw new Error("Invalid backup structure");
    }

    state.templates = parsed.data.templates;
    state.requests = parsed.data.requests;
    state.activity = parsed.data.activity || [];
    state.settings = { ...defaultSettings, ...(parsed.data.settings || {}) };
    logActivity("استيراد نسخة JSON", `تم استيراد ${file.name} بنجاح.`);
    saveState();
    renderAll();
    toast("تم استيراد النسخة الاحتياطية.");
  } catch (error) {
    console.error(error);
    toast("تعذر استيراد الملف. تأكد من أنه نسخة JSON صحيحة.");
  } finally {
    event.target.value = "";
  }
}

function findTemplate(templateId) {
  return state.templates.find((template) => template.id === templateId) || state.templates[0] || seedTemplates[0];
}

function imageRequirementLabel(template) {
  return template.minImages === template.maxImages
    ? `${template.minImages} صور`
    : `${template.minImages}-${template.maxImages} صور`;
}

function splitLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function cleanText(value) {
  return String(value || "").trim();
}

function formatDate(value) {
  if (!value) return "غير محدد";
  return new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emptyState() {
  return document.getElementById("emptyStateTemplate").innerHTML;
}

let toastTimer;
function toast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 3200);
}
