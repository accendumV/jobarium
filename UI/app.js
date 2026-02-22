const STORAGE_KEY = "jobarium_ui_demo_state_v1";

const initialState = {
  authEmail: "",
  consentAccepted: false,
  consentVersion: "2026.02-mvp",
  emailVerified: false,
  userType: "",
  consentSet: [],
  notificationPreferences: {
    email: true,
    sms: false,
    inApp: true,
    digest: "realtime"
  },
  privacyRequests: {
    exportStatus: "none",
    deletionStatus: "none"
  },
  candidate: {
    onboarding: {
      cvUploaded: false,
      parseStatus: "none",
      intakeMethod: "none",
      plainTextDescription: "",
      constructorCompleted: false,
      requiredCompleted: false,
      profileCompleteness: 28,
      preferredRoles: [],
      roleInput: "",
      locationPref: {
        workMode: "onsite",
        scope: "radius",
        anchor: "",
        radiusKm: 25,
        regions: []
      },
      compensation: {
        min: 70000,
        max: 85000,
        currency: "USD",
        period: "year"
      },
      earliestStart: "2_weeks",
      rolePreference: "",
      location: "",
      payRange: "",
      availability: "",
      canonicalDraft: {
        headline: "",
        primary_location: "",
        summary: "",
        experience: [],
        skills_flat: [],
        certifications: []
      }
    },
    matching: {
      selectedMatchId: "m1",
      matches: [
        {
          id: "m1",
          title: "Warehouse Operations Lead",
          employer: "Northline Logistics",
          fitScore: 86,
          inviteStatus: "ready",
          screeningStatus: "not_started",
          outcomeStatus: "new",
          why: "Shift fit, location fit, certification match"
        },
        {
          id: "m2",
          title: "Maintenance Supervisor",
          employer: "Hampton Facilities",
          fitScore: 79,
          inviteStatus: "queued",
          screeningStatus: "not_started",
          outcomeStatus: "new",
          why: "Experience fit, leadership history"
        },
        {
          id: "m3",
          title: "Inventory Control Manager",
          employer: "BlueDock Supply",
          fitScore: 74,
          inviteStatus: "none",
          screeningStatus: "not_started",
          outcomeStatus: "new",
          why: "Systems knowledge, process optimization"
        }
      ]
    },
    screening: {
      inviteAccepted: false,
      qaProgress: 0,
      qaSubmitted: false,
      qaAnswers: {},
      clarificationRequested: false
    },
    outcomes: {
      timelineStatus: "submitted",
      interviewRequested: true,
      offerReceived: false
    },
    appeal: {
      submitted: false,
      status: "none"
    }
  },
  employer: {
    onboarding: {
      organizationName: "",
      timezone: "America/Chicago",
      channels: ["email"],
      setupCompleted: false
    },
    team: {
      members: [
        { id: "u1", name: "Alicia Grant", email: "alicia@northline.example", role: "Admin", status: "active" },
        { id: "u2", name: "Marcus Lee", email: "marcus@northline.example", role: "Recruiter", status: "active" }
      ]
    },
    jobSetup: {
      template: "Warehouse Operations Lead",
      title: "Warehouse Operations Lead",
      location: "Chicago, IL",
      schedule: "Day shift",
      compensationMin: 78000,
      compensationMax: 92000,
      mustHaves: ["3+ years operations leadership", "Inventory systems experience"],
      dealbreakers: ["Work authorization", "On-site availability"],
      questionKitReady: true
    },
    automation: {
      triggerMode: "top_n",
      topN: 25,
      dailyCap: 20,
      weeklyCap: 80,
      maxActiveInvites: 40,
      expiryHours: 72,
      cooldownDays: 7,
      policyValid: true
    },
    lifecycle: {
      status: "active"
    },
    packets: {
      selectedPacketId: "p1",
      items: [
        {
          id: "p1",
          candidateName: "Jordan Miller",
          role: "Warehouse Operations Lead",
          fitScore: 86,
          authenticity: "low_risk",
          status: "ready",
          summary: "Strong shift management and process optimization outcomes.",
          transcriptFallback: false
        },
        {
          id: "p2",
          candidateName: "Riley Carter",
          role: "Warehouse Operations Lead",
          fitScore: 79,
          authenticity: "review",
          status: "ready",
          summary: "Good leadership signal; needs clarification on certification recency.",
          transcriptFallback: false
        },
        {
          id: "p3",
          candidateName: "Taylor Brooks",
          role: "Maintenance Supervisor",
          fitScore: 74,
          authenticity: "low_risk",
          status: "ready",
          summary: "",
          transcriptFallback: true
        }
      ]
    },
    clarifications: {
      queue: []
    },
    integrations: {
      email: "healthy",
      sms: "degraded",
      ats: "not_connected",
      calendar: "healthy"
    },
    billing: {
      plan: "Growth",
      activeJobsLimit: 10,
      activeJobsUsed: 3,
      packetLimit: 400,
      packetUsed: 92
    }
  }
};

function readState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      ...initialState,
      ...parsed,
      notificationPreferences: {
        ...initialState.notificationPreferences,
        ...(parsed.notificationPreferences || {})
      },
      privacyRequests: {
        ...initialState.privacyRequests,
        ...(parsed.privacyRequests || {})
      },
      candidate: {
        ...initialState.candidate,
        ...(parsed.candidate || {}),
        onboarding: {
          ...initialState.candidate.onboarding,
          ...((parsed.candidate && parsed.candidate.onboarding) || {})
        },
        matching: {
          ...initialState.candidate.matching,
          ...((parsed.candidate && parsed.candidate.matching) || {}),
          matches:
            (parsed.candidate &&
              parsed.candidate.matching &&
              parsed.candidate.matching.matches) ||
            initialState.candidate.matching.matches
        },
        screening: {
          ...initialState.candidate.screening,
          ...((parsed.candidate && parsed.candidate.screening) || {})
        },
        outcomes: {
          ...initialState.candidate.outcomes,
          ...((parsed.candidate && parsed.candidate.outcomes) || {})
        },
        appeal: {
          ...initialState.candidate.appeal,
          ...((parsed.candidate && parsed.candidate.appeal) || {})
        }
      },
      employer: {
        ...initialState.employer,
        ...(parsed.employer || {}),
        onboarding: {
          ...initialState.employer.onboarding,
          ...((parsed.employer && parsed.employer.onboarding) || {})
        },
        team: {
          ...initialState.employer.team,
          ...((parsed.employer && parsed.employer.team) || {}),
          members:
            (parsed.employer &&
              parsed.employer.team &&
              parsed.employer.team.members) ||
            initialState.employer.team.members
        },
        jobSetup: {
          ...initialState.employer.jobSetup,
          ...((parsed.employer && parsed.employer.jobSetup) || {})
        },
        automation: {
          ...initialState.employer.automation,
          ...((parsed.employer && parsed.employer.automation) || {})
        },
        lifecycle: {
          ...initialState.employer.lifecycle,
          ...((parsed.employer && parsed.employer.lifecycle) || {})
        },
        packets: {
          ...initialState.employer.packets,
          ...((parsed.employer && parsed.employer.packets) || {}),
          items:
            (parsed.employer &&
              parsed.employer.packets &&
              parsed.employer.packets.items) ||
            initialState.employer.packets.items
        },
        clarifications: {
          ...initialState.employer.clarifications,
          ...((parsed.employer && parsed.employer.clarifications) || {}),
          queue:
            (parsed.employer &&
              parsed.employer.clarifications &&
              parsed.employer.clarifications.queue) ||
            initialState.employer.clarifications.queue
        },
        integrations: {
          ...initialState.employer.integrations,
          ...((parsed.employer && parsed.employer.integrations) || {})
        },
        billing: {
          ...initialState.employer.billing,
          ...((parsed.employer && parsed.employer.billing) || {})
        }
      }
    };
  } catch {
    return { ...initialState };
  }
}

function writeState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function updateState(patch) {
  const nextState = { ...readState(), ...patch };
  writeState(nextState);
  return nextState;
}

function resetFlow() {
  localStorage.removeItem(STORAGE_KEY);
  showToast("Flow state has been reset.");
  setTimeout(() => {
    location.href = "landing.html";
  }, 500);
}

function guard(screenName) {
  const s = readState();
  if (screenName === "consent" && !s.authEmail) {
    location.href = "auth.html";
  }
  if (screenName === "auth" && !s.userType) {
    location.href = "role-intent.html";
  }
  if (screenName === "consent" && !s.userType) {
    location.href = "role-intent.html";
  }
  if (screenName === "verification" && !s.consentAccepted) {
    location.href = "consent.html";
  }
  if (screenName === "candidate") {
    if (s.userType !== "candidate") {
      location.href = "role-intent.html";
      return;
    }
    if (!s.emailVerified) {
      location.href = "verification.html";
    }
  }
  if (screenName === "employer") {
    if (s.userType !== "employer") {
      location.href = "role-intent.html";
      return;
    }
    if (!s.emailVerified) {
      location.href = "verification.html";
    }
  }
}

function getCandidateMatch() {
  const s = readState();
  const selectedId = s.candidate.matching.selectedMatchId;
  return (
    s.candidate.matching.matches.find((match) => match.id === selectedId) ||
    s.candidate.matching.matches[0]
  );
}

function getEmployerPacket() {
  const s = readState();
  const selectedId = s.employer.packets.selectedPacketId;
  return (
    s.employer.packets.items.find((packet) => packet.id === selectedId) ||
    s.employer.packets.items[0]
  );
}

function showStatus(kind, message) {
  const el = document.querySelector("[data-status]");
  if (!el) return;
  window.clearTimeout(showStatus._fadeTimer);
  window.clearTimeout(showStatus._hideTimer);
  el.className = `status-box ${kind}`;
  el.textContent = message;
  el.classList.remove("fade-out");
  el.classList.remove("hidden");
  showStatus._fadeTimer = setTimeout(() => {
    el.classList.add("fade-out");
  }, 2700);
  showStatus._hideTimer = setTimeout(() => {
    hideStatus();
  }, 3000);
}

function hideStatus() {
  const el = document.querySelector("[data-status]");
  if (!el) return;
  window.clearTimeout(showStatus._fadeTimer);
  window.clearTimeout(showStatus._hideTimer);
  el.className = "status-box hidden";
  el.textContent = "";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = "block";
  window.clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.style.display = "none";
  }, 2200);
}

function setHeaderState() {
  const s = readState();
  const target = document.getElementById("flowState");
  if (!target) return;
  target.innerHTML = `
    <span>role: ${s.userType || "unset"}</span>
    <span>email: ${s.authEmail || "not set"}</span>
    <span>consent: ${s.consentAccepted ? "accepted" : "pending"}</span>
    <span>verification: ${s.emailVerified ? "verified" : "pending"}</span>
  `;
}

window.UIFlow = {
  readState,
  updateState,
  guard,
  getCandidateMatch,
  getEmployerPacket,
  showStatus,
  hideStatus,
  showToast,
  setHeaderState,
  resetFlow
};
