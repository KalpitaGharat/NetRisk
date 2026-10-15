/**
 * NETRISK - Assessment Form Controller
 * Live slider updates, badge categorizations, client validation, and submission.
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("assessment-form");
  const alertBox = document.getElementById("validation-alert");
  const submitBtn = document.getElementById("btn-submit");
  const resetBtn = document.getElementById("btn-reset");

  const sliders = {
    sec: {
      input: document.getElementById("sec_criticality"),
      num: document.getElementById("num-sec"),
      badge: document.getElementById("badge-sec"),
      weight: 0.25,
      prev: document.getElementById("prev-sec-c"),
    },
    ai: {
      input: document.getElementById("ai_complexity"),
      num: document.getElementById("num-ai"),
      badge: document.getElementById("badge-ai"),
      weight: 0.20,
      prev: document.getElementById("prev-ai-c"),
    },
    req: {
      input: document.getElementById("req_uncertainty"),
      num: document.getElementById("num-req"),
      badge: document.getElementById("badge-req"),
      weight: 0.15,
      prev: document.getElementById("prev-req-c"),
    },
    threat: {
      input: document.getElementById("threat_volatility"),
      num: document.getElementById("num-threat"),
      badge: document.getElementById("badge-threat"),
      weight: 0.15,
      prev: document.getElementById("prev-threat-c"),
    },
    ops: {
      input: document.getElementById("ops_criticality"),
      num: document.getElementById("num-ops"),
      badge: document.getElementById("badge-ops"),
      weight: 0.10,
      prev: document.getElementById("prev-ops-c"),
    },
    comp: {
      input: document.getElementById("compliance_req"),
      num: document.getElementById("num-comp"),
      badge: document.getElementById("badge-comp"),
      weight: 0.10,
      prev: document.getElementById("prev-comp-c"),
    },
    exp: {
      input: document.getElementById("team_exp"),
      num: document.getElementById("num-exp"),
      badge: document.getElementById("badge-exp"),
      weight: 0.05,
      prev: document.getElementById("prev-team-c"),
      isExp: true,
    },
  };

  // Interpretation helpers
  function getStandardInterpretation(val) {
    if (val <= 30) return { label: "LOW", cls: "badge-low", color: "#10b981" };
    if (val <= 50) return { label: "MODERATE", cls: "badge-moderate", color: "#f59e0b" };
    if (val <= 70) return { label: "HIGH", cls: "badge-high", color: "#f97316" };
    return { label: "VERY HIGH", cls: "badge-very-high", color: "#ef4444" };
  }

  function getExperienceInterpretation(val) {
    if (val <= 30) return { label: "BEGINNER", cls: "badge-very-high", color: "#ef4444" };
    if (val <= 50) return { label: "BASIC", cls: "badge-high", color: "#f97316" };
    if (val <= 70) return { label: "INTERMEDIATE", cls: "badge-moderate", color: "#f59e0b" };
    if (val <= 85) return { label: "ADVANCED", cls: "badge-low", color: "#38bdf8" };
    return { label: "EXPERT", cls: "badge-low", color: "#10b981" };
  }

  // Update a single slider UI and live preview
  function updateSlider(key) {
    const s = sliders[key];
    const val = parseFloat(s.input.value);
    s.num.textContent = val;

    const interp = s.isExp ? getExperienceInterpretation(val) : getStandardInterpretation(val);
    s.badge.className = `badge ${interp.cls}`;
    s.badge.textContent = interp.label;

    updateLivePreview();
  }

  // Update sticky preview calculations
  function updateLivePreview() {
    let totalRisk = 0;

    for (const [key, s] of Object.entries(sliders)) {
      const val = parseFloat(s.input.value);
      let contrib = 0;
      if (s.isExp) {
        // Team Risk = (100 - experience) * 0.05
        contrib = (100.0 - val) * s.weight;
      } else {
        contrib = val * s.weight;
      }
      totalRisk += contrib;
      if (s.prev) {
        s.prev.textContent = `${contrib.toFixed(2)}%`;
      }
    }

    totalRisk = Math.max(0, Math.min(100, totalRisk));
    const scoreElem = document.getElementById("preview-overall-score");
    const levelElem = document.getElementById("preview-overall-level");

    if (scoreElem) {
      scoreElem.textContent = `${totalRisk.toFixed(2)}%`;
      const cat = getStandardInterpretation(totalRisk);
      scoreElem.style.color = cat.color;
      levelElem.innerHTML = `<span class="badge ${cat.cls}">${cat.label}</span>`;
    }
  }

  // Bind input listeners to all sliders
  Object.keys(sliders).forEach(k => {
    sliders[k].input.addEventListener("input", () => updateSlider(k));
    updateSlider(k);
  });

  // Reset button logic
  resetBtn.addEventListener("click", () => {
    document.getElementById("project_name").value = "";
    document.getElementById("description").value = "";
    Object.keys(sliders).forEach(k => {
      sliders[k].input.value = 50;
      updateSlider(k);
    });
    if (alertBox) alertBox.style.display = "none";
    UIUtils.showToast("Form reset to default baseline values (50%).", "info");
  });

  // Handle Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (alertBox) alertBox.style.display = "none";

    const projectName = document.getElementById("project_name").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!projectName) {
      showAlert("Project Name is mandatory. Please provide an identifier for this evaluation.");
      document.getElementById("project_name").focus();
      return;
    }

    const payload = {
      project_name: projectName,
      description: description || null,
      security_criticality: parseFloat(sliders.sec.input.value),
      ai_complexity: parseFloat(sliders.ai.input.value),
      requirement_uncertainty: parseFloat(sliders.req.input.value),
      threat_volatility: parseFloat(sliders.threat.input.value),
      operational_criticality: parseFloat(sliders.ops.input.value),
      compliance_requirement: parseFloat(sliders.comp.input.value),
      team_experience: parseFloat(sliders.exp.input.value),
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = `⏳ Computing SDLC Suitability...`;

    try {
      const result = await NetRiskAPI.createAssessment(payload);
      UIUtils.showToast("Assessment computed and saved!", "success");
      // Redirect to results view with new assessment ID
      window.location.href = `results.html?id=${result.id}`;
    } catch (err) {
      showAlert(err.message || "Failed to submit assessment.");
      submitBtn.disabled = false;
      submitBtn.innerHTML = `⚡ Calculate Risk & Recommend SDLC`;
    }
  });

  function showAlert(msg) {
    if (alertBox) {
      alertBox.textContent = msg;
      alertBox.style.display = "block";
      alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
});
