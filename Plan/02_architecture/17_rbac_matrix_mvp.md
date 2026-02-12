# Jobarium RBAC Matrix (MVP)

## Purpose
Define role-based access control at endpoint/action level for MVP services.

This is the authoritative policy for:
- who can read/write which resources,
- cross-tenant isolation,
- admin-only operations,
- support-safe access patterns.

## Roles
- `candidate`
- `employer_admin`
- `hiring_manager`
- `platform_admin`

## Global RBAC Rules
1. Deny-by-default for all endpoints/actions.
2. Tenant isolation is mandatory:
   - employer users can access only their organization records.
   - candidates can access only their own records.
3. `platform_admin` can access cross-tenant operational data but must be audit-logged.
4. Sensitive actions require explicit scope check + audit event.

## Resource Access Matrix

### Identity and Profile
| Resource / Action | candidate | employer_admin | hiring_manager | platform_admin |
|---|---|---|---|---|
| View own user profile | Allow (self) | Allow (self) | Allow (self) | Allow |
| Update own user profile | Allow (self) | Allow (self) | Allow (self) | Allow |
| View candidate profile | Allow (self) | Allow (org scoped via packet) | Allow (org scoped via packet) | Allow |
| Update candidate profile | Allow (self) | Deny | Deny | Allow (support-only) |
| Upload candidate document | Allow (self) | Deny | Deny | Allow (support-only) |

### Organization and Team
| Resource / Action | candidate | employer_admin | hiring_manager | platform_admin |
|---|---|---|---|---|
| Create organization | Deny | Allow | Deny | Allow |
| View organization settings | Deny | Allow (own org) | Allow (own org, read-only) | Allow |
| Update organization settings | Deny | Allow (own org) | Deny | Allow |
| Manage org members | Deny | Allow (own org) | Deny | Allow |

### Jobs and Templates
| Resource / Action | candidate | employer_admin | hiring_manager | platform_admin |
|---|---|---|---|---|
| Create/edit job | Deny | Allow (own org) | Allow (own org, if granted) | Allow |
| Activate/pause/close job | Deny | Allow (own org) | Allow (own org, if granted) | Allow |
| View job in employer portal | Deny | Allow (own org) | Allow (own org) | Allow |
| View job as candidate (public/invited) | Allow (eligible scope) | Deny | Deny | Allow |
| Manage role templates (org templates) | Deny | Allow (own org) | Allow (own org, if granted) | Allow |
| Manage platform default templates | Deny | Deny | Deny | Allow |

### Matching and Invitations
| Resource / Action | candidate | employer_admin | hiring_manager | platform_admin |
|---|---|---|---|---|
| View shortlist candidates | Deny | Allow (own org jobs) | Allow (own org jobs) | Allow |
| Trigger manual invite | Deny | Allow (own org jobs) | Allow (own org jobs, if granted) | Allow |
| Configure invite policy | Deny | Allow (own org jobs) | Deny (unless explicit permission) | Allow |
| View invite status (candidate) | Allow (self) | Deny | Deny | Allow |
| View invite status (employer) | Deny | Allow (own org jobs) | Allow (own org jobs) | Allow |

### Q&A and Packet Workflow
| Resource / Action | candidate | employer_admin | hiring_manager | platform_admin |
|---|---|---|---|---|
| Start/submit Q&A session | Allow (self invite only) | Deny | Deny | Allow (support replay only) |
| View own Q&A answers | Allow (self) | Deny | Deny | Allow |
| View packet summary/transcript | Deny | Allow (own org jobs) | Allow (own org jobs) | Allow |
| Take packet action (interview/clarify/reject) | Deny | Allow (own org jobs) | Allow (own org jobs) | Allow |
| View authenticity reason codes | Deny | Allow (own org packets) | Allow (own org packets) | Allow |
| Override authenticity label | Deny | Deny | Deny | Allow (with audit reason required) |

### Billing and Analytics
| Resource / Action | candidate | employer_admin | hiring_manager | platform_admin |
|---|---|---|---|---|
| View org billing status | Deny | Allow (own org) | Allow (own org, read-only) | Allow |
| Manage subscription/payment config | Deny | Allow (own org) | Deny | Allow |
| View employer analytics dashboard | Deny | Allow (own org) | Allow (own org) | Allow |
| View platform-wide analytics | Deny | Deny | Deny | Allow |

### Admin/Ops Functions
| Resource / Action | candidate | employer_admin | hiring_manager | platform_admin |
|---|---|---|---|---|
| View failed jobs/DLQ | Deny | Deny | Deny | Allow |
| Replay failed event/job | Deny | Deny | Deny | Allow |
| Process GDPR request | Deny | Deny | Deny | Allow |
| Access audit logs | Deny | Deny | Deny | Allow |

## API Authorization Requirements
- Every API route must declare:
  - required role(s),
  - tenant scoping rule,
  - sensitive action audit requirement.
- Service-to-service operations must use workload identity and scoped service accounts.

## Sensitive Operations Requiring Explicit Audit Reason
- authenticity override
- manual packet state correction
- GDPR delete execution
- cross-tenant read by `platform_admin`
- billing plan manual adjustments

## MVP Implementation Notes
- Keep permissions model simple:
  - role + organization scope + resource ownership check.
- Optional phase 1.5:
  - granular permission flags for `hiring_manager` actions.

## Test Checklist
1. Unauthorized role receives `403` for protected endpoints.
2. Cross-tenant access attempts are blocked.
3. Support/admin actions generate audit entries.
4. Candidate cannot access other candidates' data.
5. Hiring manager limitations enforced as configured.
